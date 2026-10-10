using Microsoft.EntityFrameworkCore;
using PillWise.API.Controllers;
using PillWise.API.Data;
using PillWise.API.DTOs;
using PillWise.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace PillWise.Tests;

public class InteractionsControllerTests : IDisposable
{
    private readonly PillWiseDbContext _db;
    private readonly InteractionsController _controller;

    public InteractionsControllerTests()
    {
        var options = new DbContextOptionsBuilder<PillWiseDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _db = new PillWiseDbContext(options);
        _db.Medicines.AddRange(
            new Medicine { Id = 1, Name = "Aspirin" },
            new Medicine { Id = 2, Name = "Warfarin" },
            new Medicine { Id = 3, Name = "Paracetamol" },
            new Medicine { Id = 4, Name = "Ibuprofen" }
        );
        _db.Interactions.Add(new Interaction
        {
            Medicine1Id = 1,
            Medicine2Id = 2,
            Severity = "Major",
            Description = "Aspirin may enhance anticoagulant effect of Warfarin",
            Advice = "Avoid combining. Risk of bleeding increases significantly."
        });
        _db.SaveChanges();
        _controller = new InteractionsController(_db);
    }

    public void Dispose() => _db.Dispose();

    [Fact]
    public async Task Check_FewerThanTwoMedicines_ReturnsBadRequest()
    {
        var result = await _controller.CheckInteractions(
            new InteractionCheckDto { MedicineIds = new List<int> { 1 } });

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Check_KnownInteraction_ReturnsSeverityAndAdvice()
    {
        var result = await _controller.CheckInteractions(
            new InteractionCheckDto { MedicineIds = new List<int> { 1, 2 } });

        var ok = Assert.IsType<OkObjectResult>(result);
        var list = Assert.IsType<List<InteractionResultDto>>(ok.Value);
        Assert.Single(list);
        Assert.Equal("Major", list[0].Severity);
        Assert.Contains("Warfarin", list[0].Description);
        Assert.Equal("Aspirin", list[0].Medicine1Name);
        Assert.Equal("Warfarin", list[0].Medicine2Name);
    }

    [Fact]
    public async Task Check_SafePair_ReturnsSafeSeverity()
    {
        var result = await _controller.CheckInteractions(
            new InteractionCheckDto { MedicineIds = new List<int> { 3, 4 } });

        var ok = Assert.IsType<OkObjectResult>(result);
        var list = Assert.IsType<List<InteractionResultDto>>(ok.Value);
        Assert.Single(list);
        Assert.Equal("Safe", list[0].Severity);
        Assert.Contains("No known interaction", list[0].Description);
    }

    [Fact]
    public async Task Check_InteractionIsSymmetric_RegardlessOfOrder()
    {
        var result = await _controller.CheckInteractions(
            new InteractionCheckDto { MedicineIds = new List<int> { 2, 1 } });

        var ok = Assert.IsType<OkObjectResult>(result);
        var list = Assert.IsType<List<InteractionResultDto>>(ok.Value);
        Assert.Single(list);
        Assert.Equal("Major", list[0].Severity);
    }

    [Fact]
    public async Task Check_DuplicateIdsAreDeduplicated()
    {
        var result = await _controller.CheckInteractions(
            new InteractionCheckDto { MedicineIds = new List<int> { 1, 1, 2, 2 } });

        var ok = Assert.IsType<OkObjectResult>(result);
        var list = Assert.IsType<List<InteractionResultDto>>(ok.Value);
        Assert.Single(list);
    }

    [Fact]
    public async Task Check_ThreeMedicines_ChecksAllPairs()
    {
        var result = await _controller.CheckInteractions(
            new InteractionCheckDto { MedicineIds = new List<int> { 1, 2, 3 } });

        var ok = Assert.IsType<OkObjectResult>(result);
        var list = Assert.IsType<List<InteractionResultDto>>(ok.Value);
        Assert.Equal(3, list.Count);
        Assert.Single(list, x => x.Severity == "Major");
        Assert.Equal(2, list.Count(x => x.Severity == "Safe"));
    }

    [Fact]
    public async Task Check_NullMedicineIds_ReturnsBadRequest()
    {
        var result = await _controller.CheckInteractions(
            new InteractionCheckDto { MedicineIds = null! });

        Assert.IsType<BadRequestObjectResult>(result);
    }
}


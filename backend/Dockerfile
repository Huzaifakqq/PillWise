FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["PillWise.API/PillWise.API.csproj", "PillWise.API/"]
RUN dotnet restore "PillWise.API/PillWise.API.csproj"
COPY . .
RUN dotnet publish "PillWise.API/PillWise.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "PillWise.API.dll"]

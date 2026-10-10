# ☁️ Deploying the PillWise Backend (Azure)

The Vercel frontend needs a **publicly reachable API**. Free-tier Azure App Service works well.

## Option A — Azure CLI (quickest)

```bash
# Login
az login

# Create a free Linux app service (F1 tier)
az group create --name pillwise-rg --location eastasia
az appservice plan create --name pillwise-plan --resource-group pillwise-rg --sku F1 --is-linux
az webapp create --name pillwise-api --resource-group pillwise-rg --plan pillwise-plan --runtime "DOTNET|10.0"

# Use Azure SQL (free 2GB tier) or SQL in a container; set the connection string
az webapp config connection-string set \
  --name pillwise-api --resource-group pillwise-rg \
  --connection-string-type SQLAzure \
  --settings DefaultConnection="Server=tcp:pillwise-sql.database.windows.net,1433;Initial Catalog=PillWise;User Id=...;Password=...;Encrypt=True;TrustServerCertificate=False"

# Deploy the backend folder
cd backend
az webapp deploy --name pillwise-api --resource-group pillwise-rg --src-path . --type zip

# Open Swagger
# https://pillwise-api.azurewebsites.net/swagger
```

On first boot the API auto-creates the schema and seeds core data (`DbSeeder`) — no manual SQL needed.

## Option B — GitHub Actions deploy

Add to `.github/workflows/ci.yml` (needs `AZURE_WEBAPP_PUBLISH_PROFILE` secret):

```yaml
  deploy-api:
    needs: backend
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with: { dotnet-version: '10.0.x' }
      - run: dotnet publish backend/PillWise.API -c Release -o out
      - uses: azure/webapps-deploy@v3
        with:
          app-name: pillwise-api
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: out
```

## Pointing Vercel at the API

1. Vercel → Project → **Settings → Environment Variables**
2. Add `NEXT_PUBLIC_API_URL = https://pillwise-api.azurewebsites.net/api`
3. Redeploy — the frontend picks up the new API URL at build time.

## Local Docker (no Azure needed)

```bash
docker compose up --build
# Frontend: http://localhost:3000
# API:      http://localhost:5198/swagger
# SQL:      localhost,1433 (sa / PillWise!Demo2026)
```

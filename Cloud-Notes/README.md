# ☁️ Cloud Notes

> A premium full-stack notes app — beautiful glassmorphism UI, built with **Next.js 14**, containerized with **Docker**, and deployed to **Azure Container Instances** via **Terraform**. Demonstrates a complete, production-grade DevOps pipeline.

---

## ✨ Features

| Feature | Details |
|---|---|
| 💡 **Full CRUD** | Create, read, update, delete notes via a REST API |
| 🔍 **Live Search** | Instant full-text search across title and body |
| 🏷️ **Tag System** | Color-coded tags with filter chips |
| 💾 **Autosave** | 1.5 s debounce autosave + Ctrl/Cmd+S shortcut |
| 🎨 **Premium UI** | Dark glassmorphism, animated gradients, micro-interactions |
| 🐳 **Docker** | Optimized 3-stage multi-stage build with healthcheck |
| ☁️ **Azure** | Deployed to Azure Container Instances via ACR |
| 🏗️ **Terraform** | Full IaC — resource group, ACR, ACI in one `apply` |
| 🔄 **CI/CD** | GitHub Actions — build → push → deploy on every merge |

---

## 🗂️ Project Structure

```
cloud-notes/
├── components/          # Reusable React components
│   ├── Layout.tsx       # App shell (header, background orbs)
│   ├── NoteCard.tsx     # Note card with edit/delete actions
│   ├── NoteModal.tsx    # Create-note modal (title, body, tags, color)
│   ├── SearchBar.tsx    # Debounce-ready search input
│   ├── TagChip.tsx      # Colored tag pill
│   └── EmptyState.tsx   # Zero-notes / zero-results state
├── pages/
│   ├── _document.tsx    # Google Fonts + meta tags
│   ├── _app.tsx         # Global CSS import
│   ├── index.tsx        # Landing / hero page
│   ├── dashboard.tsx    # Notes dashboard (SSR + client CRUD)
│   ├── notes/[id].tsx   # Full-page note editor with autosave
│   └── api/notes/
│       ├── index.ts     # GET all / POST create
│       └── [id].ts      # GET one / PUT update / DELETE
├── lib/
│   ├── notesStore.ts    # File-based CRUD (data/notes.json)
│   └── utils.ts         # Date formatting, tag colors, ID generation
├── styles/
│   └── globals.css      # Full design system (CSS vars, glass, animations)
├── types/index.ts        # Shared Note interface
├── data/notes.json       # Persistent note store (auto-created)
├── terraform/
│   ├── versions.tf      # Provider & Terraform version pins
│   ├── variables.tf     # All input variables with descriptions
│   ├── main.tf          # Azure resource definitions
│   └── outputs.tf       # FQDN, IP, ACR server, credentials
├── .github/workflows/
│   ├── deploy.yml        # Build image → push to ACR → restart ACI
│   └── terraform.yml     # Terraform plan (PR) → apply (main)
├── Dockerfile            # 3-stage build (deps / builder / runner)
├── docker-compose.yml    # Local production simulation with volume
├── next.config.js        # Security headers, strict mode
└── .env.example          # Required environment variables template
```

---

## 🚀 Quick Start (Local)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000
```

---

## 🐳 Run with Docker

```bash
# Build and start in production mode
docker compose up --build

# → http://localhost:3000
# Notes are persisted in a Docker named volume
```

---

## ☁️ Deploy to Azure

### Prerequisites
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed and logged in
- [Terraform](https://developer.hashicorp.com/terraform/downloads) >= 1.5
- [Docker](https://www.docker.com/) installed

### 1 — Provision infrastructure

```bash
cd terraform

# First time only
terraform init

# Review what will be created
terraform plan

# Provision: Resource Group → ACR → Container Instance
terraform apply
```

Terraform will output:
```
acr_login_server  = "cloudnotesacr123.azurecr.io"
app_fqdn          = "http://cloud-notes-prod.eastus.azurecontainer.io:3000"
app_ip            = "http://xx.xx.xx.xx:3000"
```

### 2 — Build and push the Docker image

```bash
# Log in to ACR (password from Terraform output)
az acr login --name cloudnotesacr123

# Build production image
docker build --target runner -t cloudnotesacr123.azurecr.io/cloud-notes:latest .

# Push to registry
docker push cloudnotesacr123.azurecr.io/cloud-notes:latest
```

### 3 — Restart the container to pull the latest image

```bash
az container restart \
  --resource-group cloud-notes-rg \
  --name cloud-notes-cg
```

The app will be live at the FQDN printed by Terraform.

---

## 🔄 CI/CD (GitHub Actions)

Two workflows are included:

| Workflow | Trigger | What it does |
|---|---|---|
| `deploy.yml` | Push to `main` (app code) | Build → push SHA-tagged image to ACR → restart ACI |
| `terraform.yml` | Push/PR touching `terraform/` | fmt → validate → plan (PR comment) → apply (main only) |

### Required GitHub Secrets

| Secret | How to get it |
|---|---|
| `AZURE_CREDENTIALS` | `az ad sp create-for-rbac --name cloud-notes-sp --role Contributor --scopes /subscriptions/<SUB_ID> --sdk-auth` |

### Optional GitHub Variables

| Variable | Default |
|---|---|
| `ACR_NAME` | `cloudnotesacr123` |
| `RESOURCE_GROUP` | `cloud-notes-rg` |
| `CONTAINER_GROUP` | `cloud-notes-cg` |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                         GitHub                          │
│  push to main ──► Actions: build.yml ──► deploy.yml    │
│  PR on terraform/ ──► Actions: terraform.yml (plan)    │
└───────────────┬───────────────────────────┬────────────┘
                │ docker push               │ terraform apply
                ▼                           ▼
┌──────────────────────┐   ┌───────────────────────────────┐
│  Azure Container     │   │  Azure Resource Group         │
│  Registry (ACR)      │◄──│  └─ ACR (Basic)               │
│                      │   │  └─ Container Instance (ACI)  │
│  cloud-notes:latest  │──►│     └─ cloud-notes:latest     │
└──────────────────────┘   │        Port 3000, Public IP   │
                           └───────────────────────────────┘
                                          │
                                          ▼
                              http://<fqdn>:3000  🌐
```

---

## 🔧 Customising Terraform Variables

Override defaults in `terraform.tfvars` (not committed):

```hcl
# terraform/terraform.tfvars
location             = "UK South"
acr_name             = "mynotesuniqueacr"      # must be globally unique
resource_group_name  = "my-notes-rg"
environment          = "prod"
cpu                  = "1"
memory               = "2"
tags = {
  project    = "cloud-notes"
  managed-by = "terraform"
  owner      = "your-name"
}
```

---

## 📄 License

MIT — free to use, fork, and deploy.

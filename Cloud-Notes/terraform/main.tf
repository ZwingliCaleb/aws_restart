provider "azurerm" {
  features {}
}

# ── Resource Group ────────────────────────────────────────────────────────────
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

# ── Azure Container Registry ──────────────────────────────────────────────────
resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true # required for ACI to pull images
  tags                = var.tags
}

# ── Azure Container Instance ──────────────────────────────────────────────────
resource "azurerm_container_group" "app" {
  name                = var.container_group_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  restart_policy      = "Always"

  # Networking
  ip_address_type = "Public"
  dns_name_label  = "${var.app_name}-${var.environment}" # e.g. cloud-notes-prod.eastus.azurecontainer.io

  # Pull credentials from ACR
  image_registry_credential {
    server   = azurerm_container_registry.acr.login_server
    username = azurerm_container_registry.acr.admin_username
    password = azurerm_container_registry.acr.admin_password
  }

  container {
    name   = var.app_name
    image  = "${azurerm_container_registry.acr.login_server}/${var.app_name}:latest"
    cpu    = var.cpu
    memory = var.memory

    ports {
      port     = var.container_port
      protocol = "TCP"
    }

    environment_variables = {
      NODE_ENV = "production"
      PORT     = tostring(var.container_port)
    }
  }

  tags = var.tags
}

output "acr_login_server" {
  description = "Azure Container Registry login server (use with docker login)."
  value       = azurerm_container_registry.acr.login_server
}

output "acr_admin_username" {
  description = "ACR admin username."
  value       = azurerm_container_registry.acr.admin_username
  sensitive   = false
}

output "acr_admin_password" {
  description = "ACR admin password (sensitive)."
  value       = azurerm_container_registry.acr.admin_password
  sensitive   = true
}

output "app_fqdn" {
  description = "Fully qualified domain name of the deployed app."
  value       = "http://${azurerm_container_group.app.fqdn}:${var.container_port}"
}

output "app_ip" {
  description = "Public IP address of the deployed app."
  value       = "http://${azurerm_container_group.app.ip_address}:${var.container_port}"
}

output "resource_group" {
  description = "Name of the Azure Resource Group."
  value       = azurerm_resource_group.rg.name
}

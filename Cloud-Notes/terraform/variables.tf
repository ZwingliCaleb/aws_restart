# ── General ─────────────────────────────────────────────────────────────────
variable "location" {
  description = "Azure region to deploy all resources."
  type        = string
  default     = "East US"
}

variable "environment" {
  description = "Environment label (prod, staging, dev). Used in resource names and DNS label."
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["prod", "staging", "dev"], var.environment)
    error_message = "environment must be one of: prod, staging, dev."
  }
}

variable "tags" {
  description = "Tags applied to every Azure resource."
  type        = map(string)
  default = {
    project     = "cloud-notes"
    managed-by  = "terraform"
    environment = "prod"
  }
}

# ── Naming ───────────────────────────────────────────────────────────────────
variable "resource_group_name" {
  description = "Name of the Azure Resource Group."
  type        = string
  default     = "cloud-notes-rg"
}

variable "app_name" {
  description = "Base application name. Used as the container name."
  type        = string
  default     = "cloud-notes"
}

variable "acr_name" {
  description = "Azure Container Registry name (globally unique, 5–50 alphanumeric chars, no hyphens)."
  type        = string
  default     = "cloudnotesacr123"
}

variable "container_group_name" {
  description = "Name of the Azure Container Group."
  type        = string
  default     = "cloud-notes-cg"
}

# ── Container sizing ─────────────────────────────────────────────────────────
variable "cpu" {
  description = "CPU cores allocated to the container (e.g. 0.5, 1, 2)."
  type        = string
  default     = "0.5"
}

variable "memory" {
  description = "Memory (GB) allocated to the container (e.g. 1.5, 2)."
  type        = string
  default     = "1.5"
}

variable "container_port" {
  description = "Port the Next.js server listens on inside the container."
  type        = number
  default     = 3000
}

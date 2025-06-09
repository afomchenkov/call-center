variable "gcp_project" {
  type        = string
  description = "Your GCP project ID"
}

variable "gcp_region" {
  type        = string
  description = "Your GCP region"
  default     = "us-central1"
}

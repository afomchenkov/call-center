# AWS provider
provider "aws" {
  region = "us-east-1"
  alias  = "aws"
}

# Google Cloud provider
provider "google" {
  project = var.gcp_project
  region  = var.gcp_region
  alias   = "gcp"
}

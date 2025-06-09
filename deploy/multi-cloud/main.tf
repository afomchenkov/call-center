# AWS S3 bucket
resource "aws_s3_bucket" "bucket" {
  provider = aws
  bucket   = "multi-cloud-example-bucket-${random_id.id.hex}"
  acl      = "private"
}

resource "random_id" "id" {
  byte_length = 4
}

# AWS ECR repository
resource "aws_ecr_repository" "repo" {
  provider = aws
  name     = "example-ecr-repo"
}

# GCP Kubernetes Engine (GKE) cluster
resource "google_container_cluster" "gke_cluster" {
  provider = google
  name     = "example-gke-cluster"
  location = var.gcp_region

  initial_node_count = 1

  node_config {
    machine_type = "e2-medium"
  }
}

output "s3_bucket_name" {
  value = aws_s3_bucket.bucket.id
}

output "ecr_repo_url" {
  value = aws_ecr_repository.repo.repository_url
}

output "gke_cluster_name" {
  value = google_container_cluster.gke_cluster.name
}

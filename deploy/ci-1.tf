# Provision EC2, S3 and RDS (PostgreSQL)

provider "aws" {
  region = "eu-central-1"
}

resource "aws_vpc" "this" {
 cidr_block = var.vpc_cidr
}

variable "vpc_cidr" {
  description = "CIDR for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# S3 Bucket
resource "aws_s3_bucket" "bucket1" {
  bucket = "ci-bucket-1"
  acl    = "private"
}

# PostgreSQL RDS Instance
resource "aws_db_instance" "postgres" {
  identifier        = "postgres-ci-1"
  engine            = "postgres"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  username          = "postgres"
  password          = "pass123"
  skip_final_snapshot = true
}

# EC2 Instance
resource "aws_instance" "app_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Example Ubuntu AMI
  instance_type = "t3.micro"

  tags = {
    Name = "ci-ec2-1"
  }
}

# Output values
output "s3_bucket_name" {
  value = aws_s3_bucket.bucket1.bucket
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

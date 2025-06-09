provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "example" {
  ami = "ami-hash-test"
  instance_type = "t2.micro"
  key_name = "MyService"
  vpc_security_group_ids = ["sg-something"]
  iam_instance_profile = "EC2Access"

  user_data = <<-EOF
    #!bin/bash
    sudo yum update –y
    sudo yum install git -y
    mkdir /app
    chmod 755 /app
    cd /app
    git clone https://github.com/resource/repo.git
    curl -sL https://rpm.nodesource.com/setup_6.x | sudo -E bash -
    sudo yum install nodejs --enablerepo=nodesource -y
    node --version > nodeVersion.txt
    cd /app/test-service
    npm install
    npm start
    EOF
}
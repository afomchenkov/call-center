# Multi cloud terraform config

```shell
terraform init
terraform plan -var="gcp_project=your-project-id"
terraform apply -var="gcp_project=your-project-id"
```


```txt
Terraform file types include:
    - main.tf – containing the resource blocks that define the resources to be created in the target cloud platform.
    - variables.tf – containing the variable declarations used in the resource blocks.
    - provider.tf – containing the terraform block, s3 backend definition, provider configurations, and aliases.
    - output.tf – containing the output that needs to be generated on successful completion of “apply” operation.
    - *.tfvars – containing the environment-specific default values of variables.
```

```txt
It may make sense to consolidate various components depending on a certain pattern.
A couple of examples of slicing the main.tf files are:
    - By services – you can include all the components required to support a particular business service in one file. This file contains all the databases, compute resources, network configs, etc., in a single file. The file is named according to the service being supported. Thus, while doing the root cause analysis (RCA), we already know which Terraform file needs to be investigated.
    - By components – you may decide to segregate the resource blocks based on the nature of the components used. A Terraform project may have a single file to manage all the databases. Similarly, all network configurations, compute resources, etc., are managed in their individual files.
```

# Test service


## Run on EC2
```shell
$ cd nodejs-service
$ npm start
# OR
$ pm2 start bin/www --name nodejs-demo
```

## Run on Docker
```shell
$ cd nodejs-service
$ docker build -t nodejs-demo .
$ docker run -it --rm -p 3000:3000 nodejs-demo
```


## Helm chart config
```txt
    my-chart/
    ├── Chart.yaml          # Metadata about the chart
    ├── values.yaml         # Default configuration values
    ├── templates/          # Templated Kubernetes manifests
    │   ├── deployment.yaml
    │   ├── ingress.yaml
    │   ├── service.yaml
    │   └── _helpers.tpl    # Template helpers (optional)
```

## Helm commands
```shell
# Render the templates locally
helm template my-app ./my-app
# Install the chart to your cluster
helm install my-app ./my-app
# Upgrade with new values
helm upgrade my-app ./my-app --set replicaCount=3
# Uninstall
helm uninstall my-app
```

## Terraform commands
```shell
$ cd terraform-ec2-nodejs-deployment
$ terraform init
$ terraform plan
$ terraform apply
```
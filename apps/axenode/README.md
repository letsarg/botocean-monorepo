# Axenode
Requirements:
```
brew install kubectl

```
In order for kubectl to find and access a Kubernetes cluster, it needs a kubeconfig file, which is created automatically when you create a cluster using [kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh) or successfully deploy a Minikube cluster. By default, kubectl configuration is located at ~/.kube/config.

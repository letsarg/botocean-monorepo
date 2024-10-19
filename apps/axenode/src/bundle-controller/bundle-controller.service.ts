import { Injectable, OnModuleInit } from '@nestjs/common';
import * as k8s from "@kubernetes/client-node"
import * as toml from 'toml';
import { BundleRegistryService } from './bundle-registry.service';

const BOTOCEAN_K8S_NAMESPACE = {
  metadata: {
    name: 'botocean',
  },
};

@Injectable()
export class BundleControllerService implements OnModuleInit {
  private kc: k8s.KubeConfig;
  private k8sApi: k8s.CoreV1Api;

  constructor(
    private readonly bundleRegistry: BundleRegistryService,
  ) {
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromDefault();
    this.k8sApi = this.kc.makeApiClient(k8s.CoreV1Api);
  }

  async onModuleInit() {
    try {
      const readNamespaceRes = await this.k8sApi.readNamespace(BOTOCEAN_K8S_NAMESPACE.metadata.name);
      console.log('Namespace: ', readNamespaceRes.body);

      const createNamespaceRes = await this.k8sApi.createNamespace(BOTOCEAN_K8S_NAMESPACE);
      console.log('New namespace created: ', createNamespaceRes.body);

      await this.k8sApi.deleteNamespace(BOTOCEAN_K8S_NAMESPACE.metadata.name);
    } catch (err) {
      console.error(err);
    }

    await this.deployAxeBundle("QmcoKCHjainCqtM6rjCNS6nATkBRKcUGmX89TxruijeSVY");
  }

  async deployAxeBundle(cid: string) {
    await this.bundleRegistry.pull(cid);


  }
}

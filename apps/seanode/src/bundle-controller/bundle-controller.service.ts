import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as k8s from "@kubernetes/client-node"
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { BundleRegistryService } from './bundle-registry.service';

const BOTOCEAN_K8S_NAMESPACE = {
  metadata: {
    name: 'botocean',
  },
};

@Injectable()
export class BundleControllerService implements OnModuleInit {
  private logger = new Logger(BundleControllerService.name);

  private kc: k8s.KubeConfig;
  private k8sCoreApi: k8s.CoreV1Api;
  private k8sAppsApi: k8s.AppsV1Api;

  constructor(
    private readonly bundleRegistry: BundleRegistryService,
  ) {
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromDefault();
    this.k8sCoreApi = this.kc.makeApiClient(k8s.CoreV1Api);
    this.k8sAppsApi = this.kc.makeApiClient(k8s.AppsV1Api);
  }

  async onModuleInit() {
    // try {
    //   const readNamespaceRes = await this.k8sCoreApi.readNamespace(BOTOCEAN_K8S_NAMESPACE.metadata.name);
    //   console.log('Namespace: ', readNamespaceRes.body);

    //   const createNamespaceRes = await this.k8sCoreApi.createNamespace(BOTOCEAN_K8S_NAMESPACE);
    //   console.log('New namespace created: ', createNamespaceRes.body);

    //   await this.k8sCoreApi.deleteNamespace(BOTOCEAN_K8S_NAMESPACE.metadata.name);
    // } catch (err) {
    //   console.error(err);
    // }

    await this.deployAxeBundle("QmaiS8JjzBykEwFGj9q2yTRn3oAzz1Voeoj2uRrYkfumxs");
  }

  async deployAxeBundle(cid: string) {
    await this.bundleRegistry.pull(cid);
    const deployPath = path.join(__dirname, `bundleReg/${cid}/deploy.yml`);
    await this.applyYaml(deployPath)
  }

  async applyYaml(filePath: string) {
    try {
      // Load YAML file
      const yamlContent = fs.readFileSync(filePath, 'utf8');
      const resource: any = yaml.load(yamlContent);

      switch (resource.kind) {
        case 'Service':
          await this.k8sAppsApi.createNamespacedDeployment('default', resource);
          this.logger.log(`Service ${resource.metadata.name} applied successfully.`);
          break;
        case 'Deployment':
          await this.k8sCoreApi.createNamespacedService('default', resource);
          this.logger.log(`Deployment ${resource.metadata.name} applied successfully.`);
          break;
        default:
          this.logger.log(`Resource kind ${resource.kind} not supported.`);
      }
    } catch (error) {
      this.logger.error(`Error applying YAML: ${JSON.stringify(error)}`);
    }
  }
}

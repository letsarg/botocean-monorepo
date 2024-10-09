import { Injectable } from '@nestjs/common';
import { ModelType } from 'src/prompt/prompt.dto';
import { ProviderInstance } from './provider-instance.dto';
import { ProviderType } from 'src/hub/hub.dto';

@Injectable()
export class ProviderService {
  // Maps provider ID to a Provider instance
  private providerMap: Map<string, ProviderInstance> = new Map();

  // Maps model type to an array of provider IDs
  private modelProviderMap: Map<string, Set<string>> = new Map();

  // Registers a provider
  registerProvider(provider: ProviderInstance) {
    let models: string[];
    switch (provider.providerInfo.providerType) {
      case ProviderType.Ollama:
        models = provider.providerInfo.ollamaProviderDetail.models;
        break;
      default:
        throw new Error(`unsupported provider ${provider.providerInfo.providerType}`);
    }

    // Add to provider map list
    this.providerMap.set(provider.id, provider);

    // Add provider to map of model -> providers
    for (let index = 0; index < models.length; index++) {
      const model = models[index];
      let providerIds = this.modelProviderMap.get(model);
      if (!providerIds) {
        providerIds = new Set();
      }
      providerIds.add(provider.id);
      this.modelProviderMap.set(model, providerIds);
    }
  }

  // Deregisters a provider by providerId
  deregisterProvider(providerId: string) {
    // Get the provider from the provider map
    const provider = this.providerMap.get(providerId);
    if (!provider) {
      throw new Error(`Provider with ID ${providerId} not found`);
    }

    let models: string[];
    switch (provider.providerInfo.providerType) {
      case ProviderType.Ollama:
        models = provider.providerInfo.ollamaProviderDetail.models;
        break;
      default:
        throw new Error(`unsupported provider ${provider.providerInfo.providerType}`);
    }

    // Remove the provider from provider map
    this.providerMap.delete(providerId);

    // Unset all provider ids from models
    for (let index = 0; index < models.length; index++) {
      const model = models[index];
      let providerIds = this.modelProviderMap.get(model);
      if (providerIds) {
        providerIds.delete(provider.id);
        if (providerIds.values.length > 0) {
          this.modelProviderMap.set(model, providerIds);
        } else {
          this.modelProviderMap.delete(model);
        }
      }
    }
  }

  findProvidersByModel(model: string): ProviderInstance[] {
    // Get the list of provider IDs for the model
    const providerIds = this.modelProviderMap.get(model);

    if (!providerIds || providerIds.values.length === 0) {
      return []; // No providers found for this model
    }

    let insts: ProviderInstance[] = [];
    for (const providerId of providerIds.values()) {
      insts.push(this.providerMap.get(providerId))
    }
    return insts;
  }
}
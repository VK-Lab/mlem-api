import { ModuleMetadata } from "@nestjs/common";

export interface ICasperModuleOption {
  nodeUrl: string;
  networkName: string;
}

export interface ICasperModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<ICasperModuleOption> | ICasperModuleOption;
  inject?: any[];
}

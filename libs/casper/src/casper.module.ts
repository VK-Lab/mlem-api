import { DynamicModule, Module } from '@nestjs/common';
import { CONFIG_CONNECTION_OPTIONS } from './constants';
import { ICasperModuleAsyncOptions } from './interfaces';
import { CasperCep78Service } from './services';


@Module({})
export class CasperModule {
  public static registerCep78(options: ICasperModuleAsyncOptions): DynamicModule {
    return {
        module: CasperModule,
        providers: [
            {
                provide: CONFIG_CONNECTION_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            },
            CasperCep78Service,
        ],
        exports: [CasperCep78Service],
    };
  }
}

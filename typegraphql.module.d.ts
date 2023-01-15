import { DynamicModule } from "@nestjs/common";
import { TypeGraphQLFeatureModuleOptions, TypeGraphQLRootModuleOptions, TypeGraphQLRootModuleAsyncOptions } from "./types";
export declare class TypeGraphQLModule {
    private static forFeatureIndex;
    static forFeature(options?: TypeGraphQLFeatureModuleOptions): DynamicModule;
    static forRoot(options?: TypeGraphQLRootModuleOptions): DynamicModule;
    static forRootAsync(options: TypeGraphQLRootModuleAsyncOptions): DynamicModule;
}

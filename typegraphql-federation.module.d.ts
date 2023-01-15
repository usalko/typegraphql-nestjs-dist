import { DynamicModule } from "@nestjs/common";
import { TypeGraphQLFeatureFedarationModuleOptions, TypeGraphQLRootFederationModuleOptions, TypeGraphQLRootFederationModuleAsyncOptions } from "./types";
export declare class TypeGraphQLFederationModule {
    private static forFeatureIndex;
    static forFeature(options?: TypeGraphQLFeatureFedarationModuleOptions): DynamicModule;
    static forRoot(options?: TypeGraphQLRootFederationModuleOptions): DynamicModule;
    static forRootAsync(options: TypeGraphQLRootFederationModuleAsyncOptions): DynamicModule;
}

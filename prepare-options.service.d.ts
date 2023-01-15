import { ModulesContainer, ModuleRef } from "@nestjs/core";
import { ClassType, ContainerType } from "type-graphql";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";
import { TypeGraphQLFeatureModuleOptions } from "./types";
export default class OptionsPreparatorService {
    private readonly moduleRef;
    private readonly modulesContainer;
    constructor(moduleRef: ModuleRef, modulesContainer: ModulesContainer);
    prepareOptions<TOptions extends TypeGraphQLFeatureModuleOptions>(featureModuleToken: string, globalMiddlewares?: Middleware<any>[]): {
        resolversClasses: ClassType<any>[];
        orphanedTypes: Function[] | undefined;
        container: ContainerType;
        featureModuleOptionsArray: TOptions[];
    };
}

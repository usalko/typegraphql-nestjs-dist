import { GqlOptionsFactory, GqlModuleOptions } from "@nestjs/graphql";
import { TypeGraphQLRootModuleOptions } from "./types";
import OptionsPreparatorService from "./prepare-options.service";
export default class TypeGraphQLOptionsFactory implements GqlOptionsFactory {
    private readonly rootModuleOptions;
    private readonly optionsPreparatorService;
    constructor(rootModuleOptions: TypeGraphQLRootModuleOptions, optionsPreparatorService: OptionsPreparatorService);
    createGqlOptions(): Promise<GqlModuleOptions>;
}

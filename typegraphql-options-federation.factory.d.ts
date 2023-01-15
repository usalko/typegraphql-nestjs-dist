import { GqlModuleOptions, GqlOptionsFactory } from "@nestjs/graphql";
import { GraphQLFieldResolver, GraphQLScalarType } from "graphql";
import OptionsPreparatorService from "./prepare-options.service";
import { TypeGraphQLRootFederationModuleOptions } from "./types";
export interface GraphQLResolverMap<TContext = {}> {
    [typeName: string]: {
        [fieldName: string]: GraphQLFieldResolver<any, TContext> | {
            requires?: string;
            resolve: GraphQLFieldResolver<any, TContext>;
        };
    } | GraphQLScalarType | {
        [enumValue: string]: string | number;
    };
}
export default class TypeGraphQLFederationOptionsFactory implements GqlOptionsFactory {
    private readonly rootModuleOptions;
    private readonly optionsPreparatorService;
    constructor(rootModuleOptions: TypeGraphQLRootFederationModuleOptions, optionsPreparatorService: OptionsPreparatorService);
    createGqlOptions(): Promise<GqlModuleOptions>;
}

"use strict";
var TypeGraphQLFederationModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeGraphQLFederationModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const graphql_federation_module_1 = require("./graphql-federation.module");
const prepare_options_service_1 = tslib_1.__importDefault(require("./prepare-options.service"));
const constants_1 = require("./constants");
const typegraphql_options_federation_factory_1 = tslib_1.__importDefault(require("./typegraphql-options-federation.factory"));
let TypeGraphQLFederationModule = TypeGraphQLFederationModule_1 = class TypeGraphQLFederationModule {
    static forFeature(options = {}) {
        const token = `${constants_1.TYPEGRAPHQL_FEATURE_FEDERATION_MODULE_OPTIONS}_${this
            .forFeatureIndex++}`;
        return {
            module: TypeGraphQLFederationModule_1,
            providers: [{ provide: token, useValue: options }],
            exports: [token],
        };
    }
    static forRoot(options = {}) {
        const dynamicGraphQLModule = graphql_federation_module_1.GraphQLFederationModule.forRootAsync({
            useClass: typegraphql_options_federation_factory_1.default,
        });
        return Object.assign(Object.assign({}, dynamicGraphQLModule), { providers: [
                ...dynamicGraphQLModule.providers,
                prepare_options_service_1.default,
                {
                    provide: constants_1.TYPEGRAPHQL_ROOT_FEDERATION_MODULE_OPTIONS,
                    useValue: options,
                },
            ] });
    }
    static forRootAsync(options) {
        const dynamicGraphQLModule = graphql_federation_module_1.GraphQLFederationModule.forRootAsync({
            imports: options.imports,
            useClass: typegraphql_options_federation_factory_1.default,
        });
        return Object.assign(Object.assign({}, dynamicGraphQLModule), { providers: [
                ...dynamicGraphQLModule.providers,
                prepare_options_service_1.default,
                {
                    inject: options.inject,
                    provide: constants_1.TYPEGRAPHQL_ROOT_FEDERATION_MODULE_OPTIONS,
                    useFactory: options.useFactory,
                },
            ] });
    }
};
TypeGraphQLFederationModule.forFeatureIndex = 1;
TypeGraphQLFederationModule = TypeGraphQLFederationModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], TypeGraphQLFederationModule);
exports.TypeGraphQLFederationModule = TypeGraphQLFederationModule;

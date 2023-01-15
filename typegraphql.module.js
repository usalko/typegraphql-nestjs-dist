"use strict";
var TypeGraphQLModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeGraphQLModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const constants_1 = require("./constants");
const prepare_options_service_1 = tslib_1.__importDefault(require("./prepare-options.service"));
const typegraphql_options_factory_1 = tslib_1.__importDefault(require("./typegraphql-options.factory"));
let TypeGraphQLModule = TypeGraphQLModule_1 = class TypeGraphQLModule {
    static forFeature(options = {}) {
        const token = `${constants_1.TYPEGRAPHQL_FEATURE_MODULE_OPTIONS}_${this
            .forFeatureIndex++}`;
        return {
            module: TypeGraphQLModule_1,
            providers: [{ provide: token, useValue: options }],
            exports: [token],
        };
    }
    static forRoot(options = {}) {
        const dynamicGraphQLModule = graphql_1.GraphQLModule.forRootAsync({
            useClass: typegraphql_options_factory_1.default,
        });
        return Object.assign(Object.assign({}, dynamicGraphQLModule), { providers: [
                ...dynamicGraphQLModule.providers,
                prepare_options_service_1.default,
                {
                    provide: constants_1.TYPEGRAPHQL_ROOT_MODULE_OPTIONS,
                    useValue: options,
                },
            ] });
    }
    static forRootAsync(options) {
        const dynamicGraphQLModule = graphql_1.GraphQLModule.forRootAsync({
            imports: options.imports,
            useClass: typegraphql_options_factory_1.default,
        });
        return Object.assign(Object.assign({}, dynamicGraphQLModule), { providers: [
                ...dynamicGraphQLModule.providers,
                prepare_options_service_1.default,
                {
                    inject: options.inject,
                    provide: constants_1.TYPEGRAPHQL_ROOT_MODULE_OPTIONS,
                    useFactory: options.useFactory,
                },
            ] });
    }
};
TypeGraphQLModule.forFeatureIndex = 1;
TypeGraphQLModule = TypeGraphQLModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], TypeGraphQLModule);
exports.TypeGraphQLModule = TypeGraphQLModule;

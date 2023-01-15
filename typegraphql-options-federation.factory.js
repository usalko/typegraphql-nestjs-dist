"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const federation_1 = require("@apollo/federation");
const directives_1 = require("@apollo/subgraph/dist/directives");
const schema_1 = require("@graphql-tools/schema");
const common_1 = require("@nestjs/common");
const graphql_1 = require("graphql");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./constants");
const prepare_options_service_1 = tslib_1.__importDefault(require("./prepare-options.service"));
let TypeGraphQLFederationOptionsFactory = class TypeGraphQLFederationOptionsFactory {
    constructor(rootModuleOptions, optionsPreparatorService) {
        this.rootModuleOptions = rootModuleOptions;
        this.optionsPreparatorService = optionsPreparatorService;
    }
    createGqlOptions() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { globalMiddlewares } = this.rootModuleOptions;
            const { resolversClasses, container, orphanedTypes, featureModuleOptionsArray, } = this.optionsPreparatorService.prepareOptions(constants_1.TYPEGRAPHQL_FEATURE_FEDERATION_MODULE_OPTIONS, globalMiddlewares);
            const referenceResolversArray = [...featureModuleOptionsArray].filter(it => it.referenceResolvers);
            const referenceResolvers = referenceResolversArray.length > 0
                ? Object.fromEntries(referenceResolversArray.flatMap(it => Object.entries(it.referenceResolvers)))
                : undefined;
            const baseSchema = yield (0, type_graphql_1.buildSchema)(Object.assign(Object.assign({}, this.rootModuleOptions), { directives: [...graphql_1.specifiedDirectives, ...directives_1.federationDirectives], resolvers: resolversClasses, orphanedTypes,
                container }));
            const schema = (0, federation_1.buildFederatedSchema)({
                typeDefs: (0, graphql_tag_1.default)((0, graphql_1.printSchema)(baseSchema)),
                resolvers: (0, type_graphql_1.createResolversMap)(baseSchema),
            });
            if (referenceResolvers) {
                (0, schema_1.addResolversToSchema)({ schema, resolvers: referenceResolvers });
            }
            return Object.assign(Object.assign({}, this.rootModuleOptions), { schema });
        });
    }
};
TypeGraphQLFederationOptionsFactory = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(constants_1.TYPEGRAPHQL_ROOT_FEDERATION_MODULE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [Object, prepare_options_service_1.default])
], TypeGraphQLFederationOptionsFactory);
exports.default = TypeGraphQLFederationOptionsFactory;

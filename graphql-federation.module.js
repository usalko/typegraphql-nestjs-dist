"use strict";
var GraphQLFederationModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLFederationModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const core_1 = require("@nestjs/core");
const graphql_1 = require("@nestjs/graphql");
const graphql_schema_builder_1 = require("@nestjs/graphql/dist/graphql-schema.builder");
const graphql_2 = require("@nestjs/graphql");
const graphql_3 = require("@nestjs/graphql");
const graphql_4 = require("@nestjs/graphql");
const graphql_5 = require("@nestjs/graphql");
const graphql_6 = require("@nestjs/graphql");
const plugins_explorer_service_1 = require("@nestjs/apollo/dist/services/plugins-explorer.service");
const services_1 = require("@nestjs/graphql/dist/services");
const utils_1 = require("@nestjs/graphql/dist/utils");
const graphql_7 = require("@nestjs/graphql");
let GraphQLFederationModule = GraphQLFederationModule_1 = class GraphQLFederationModule {
    get apolloServer() {
        return this._apolloServer;
    }
    constructor(httpAdapterHost, options, graphqlFederationFactory, graphqlTypesLoader, graphqlFactory, applicationConfig) {
        this.httpAdapterHost = httpAdapterHost;
        this.options = options;
        this.graphqlFederationFactory = graphqlFederationFactory;
        this.graphqlTypesLoader = graphqlTypesLoader;
        this.graphqlFactory = graphqlFactory;
        this.applicationConfig = applicationConfig;
        this._apolloServer = null;
    }
    static forRoot(options = {}) {
        return {
            module: GraphQLFederationModule_1,
            providers: [
                {
                    provide: graphql_4.GRAPHQL_MODULE_OPTIONS,
                    useValue: options,
                },
            ],
        };
    }
    static forRootAsync(options) {
        return {
            module: GraphQLFederationModule_1,
            imports: options.imports,
            providers: [
                ...this.createAsyncProviders(options),
                {
                    provide: graphql_4.GRAPHQL_MODULE_ID,
                    useValue: (0, utils_1.generateString)(),
                },
            ],
        };
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: graphql_4.GRAPHQL_MODULE_OPTIONS,
                useFactory: (...args) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield options.useFactory(...args); }),
                inject: options.inject || [],
            };
        }
        return {
            provide: graphql_4.GRAPHQL_MODULE_OPTIONS,
            useFactory: (optionsFactory) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield optionsFactory.createGqlOptions(); }),
            inject: [options.useExisting || options.useClass],
        };
    }
    onModuleInit() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.httpAdapterHost || !this.httpAdapterHost.httpAdapter) {
                return;
            }
            const { printSubgraphSchema } = (0, load_package_util_1.loadPackage)('@apollo/subgraph', 'ApolloFederation', () => require('@apollo/subgraph'));
            const { typePaths } = this.options;
            const typeDefs = (yield this.graphqlTypesLoader.mergeTypesByPaths(typePaths)) || [];
            const mergedTypeDefs = (0, utils_1.extend)(typeDefs, this.options.typeDefs);
            const apolloOptions = yield this.graphqlFederationFactory.mergeWithSchema(Object.assign(Object.assign({}, this.options), { typeDefs: mergedTypeDefs }));
            yield this.runExecutorFactoryIfPresent(apolloOptions);
            if (this.options.definitions && this.options.definitions.path) {
                yield this.graphqlFactory.generateDefinitions(printSubgraphSchema(apolloOptions.schema), this.options);
            }
            yield this.registerGqlServer(apolloOptions);
        });
    }
    onModuleDestroy() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield ((_a = this._apolloServer) === null || _a === void 0 ? void 0 : _a.stop());
        });
    }
    registerGqlServer(apolloOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const httpAdapter = this.httpAdapterHost.httpAdapter;
            const platformName = httpAdapter.getType();
            if (platformName === 'express') {
                yield this.registerExpress(apolloOptions);
            }
            else if (platformName === 'fastify') {
                yield this.registerFastify(apolloOptions);
            }
            else {
                throw new Error(`No support for current HttpAdapter: ${platformName}`);
            }
        });
    }
    registerExpress(apolloOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { ApolloServer } = (0, load_package_util_1.loadPackage)('apollo-server-express', 'GraphQLModule', () => require('apollo-server-express'));
            const { disableHealthCheck, onHealthCheck, cors, bodyParserConfig } = this.options;
            const app = this.httpAdapterHost.httpAdapter.getInstance();
            const path = this.getNormalizedPath(apolloOptions);
            const apolloServer = new ApolloServer(apolloOptions);
            yield apolloServer.start();
            apolloServer.applyMiddleware({
                app,
                path,
                disableHealthCheck,
                onHealthCheck,
                cors,
                bodyParserConfig,
            });
            this._apolloServer = apolloServer;
        });
    }
    registerFastify(apolloOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { ApolloServer } = (0, load_package_util_1.loadPackage)('apollo-server-fastify', 'GraphQLModule', () => require('apollo-server-fastify'));
            const httpAdapter = this.httpAdapterHost.httpAdapter;
            const app = httpAdapter.getInstance();
            const path = this.getNormalizedPath(apolloOptions);
            const apolloServer = new ApolloServer(apolloOptions);
            yield apolloServer.start();
            const { disableHealthCheck, onHealthCheck, cors, bodyParserConfig } = this.options;
            yield app.register(apolloServer.createHandler({
                disableHealthCheck,
                onHealthCheck,
                cors,
                bodyParserConfig,
                path,
            }));
            this._apolloServer = apolloServer;
        });
    }
    getNormalizedPath(apolloOptions) {
        const prefix = this.applicationConfig.getGlobalPrefix();
        const useGlobalPrefix = prefix && this.options.useGlobalPrefix;
        const gqlOptionsPath = (0, utils_1.normalizeRoutePath)(apolloOptions.path || '');
        return useGlobalPrefix
            ? (0, utils_1.normalizeRoutePath)(prefix) + gqlOptionsPath
            : gqlOptionsPath;
    }
    runExecutorFactoryIfPresent(apolloOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!apolloOptions.executorFactory) {
                return;
            }
            const executor = yield apolloOptions.executorFactory(apolloOptions.schema);
            apolloOptions.executor = executor;
        });
    }
};
GraphQLFederationModule = GraphQLFederationModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [graphql_6.GraphQLSchemaBuilderModule],
        providers: [
            graphql_7.GraphQLFederationFactory,
            graphql_5.GraphQLFactory,
            core_1.MetadataScanner,
            services_1.ResolversExplorerService,
            plugins_explorer_service_1.PluginsExplorerService,
            services_1.ScalarsExplorerService,
            graphql_1.GraphQLAstExplorer,
            graphql_3.GraphQLTypesLoader,
            graphql_schema_builder_1.GraphQLSchemaBuilder,
            graphql_2.GraphQLSchemaHost,
        ],
        exports: [graphql_2.GraphQLSchemaHost, graphql_3.GraphQLTypesLoader, graphql_1.GraphQLAstExplorer],
    }),
    tslib_1.__param(0, (0, common_1.Optional)()),
    tslib_1.__param(1, (0, common_1.Inject)(graphql_4.GRAPHQL_MODULE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [core_1.HttpAdapterHost, Object, graphql_7.GraphQLFederationFactory,
        graphql_3.GraphQLTypesLoader,
        graphql_5.GraphQLFactory,
        core_1.ApplicationConfig])
], GraphQLFederationModule);
exports.GraphQLFederationModule = GraphQLFederationModule;

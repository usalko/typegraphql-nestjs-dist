"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const request_constants_1 = require("@nestjs/core/router/request/request-constants");
const type_graphql_1 = require("type-graphql");
let OptionsPreparatorService = class OptionsPreparatorService {
    constructor(moduleRef, modulesContainer) {
        this.moduleRef = moduleRef;
        this.modulesContainer = modulesContainer;
    }
    prepareOptions(featureModuleToken, globalMiddlewares = []) {
        const globalResolvers = (0, type_graphql_1.getMetadataStorage)().resolverClasses.map(metadata => metadata.target);
        const globalMiddlewareClasses = globalMiddlewares.filter(it => it.prototype);
        const featureModuleOptionsArray = [];
        const resolversClasses = [];
        const providersMetadataMap = new Map();
        for (const module of this.modulesContainer.values()) {
            for (const provider of module.providers.values()) {
                if (typeof provider.name === "string" &&
                    provider.name.includes(featureModuleToken)) {
                    featureModuleOptionsArray.push(provider.instance);
                }
                if (globalResolvers.includes(provider.metatype)) {
                    providersMetadataMap.set(provider.metatype, provider);
                    resolversClasses.push(provider.metatype);
                }
                if (globalMiddlewareClasses.includes(provider.metatype)) {
                    providersMetadataMap.set(provider.metatype, provider);
                }
            }
        }
        const orphanedTypes = (0, common_1.flatten)(featureModuleOptionsArray.map(it => it.orphanedTypes));
        const container = {
            get: (cls, { context }) => {
                let contextId = context[request_constants_1.REQUEST_CONTEXT_ID];
                if (!contextId) {
                    contextId = core_1.ContextIdFactory.create();
                    context[request_constants_1.REQUEST_CONTEXT_ID] = contextId;
                }
                const providerMetadata = providersMetadataMap.get(cls);
                if (providerMetadata.isDependencyTreeStatic() &&
                    !providerMetadata.isTransient) {
                    return this.moduleRef.get(cls, { strict: false });
                }
                return this.moduleRef.resolve(cls, contextId, { strict: false });
            },
        };
        return {
            resolversClasses,
            orphanedTypes,
            container,
            featureModuleOptionsArray,
        };
    }
};
OptionsPreparatorService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.ModuleRef,
        core_1.ModulesContainer])
], OptionsPreparatorService);
exports.default = OptionsPreparatorService;

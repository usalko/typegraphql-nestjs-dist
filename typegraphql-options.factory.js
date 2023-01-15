"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("./constants");
const prepare_options_service_1 = tslib_1.__importDefault(require("./prepare-options.service"));
let TypeGraphQLOptionsFactory = class TypeGraphQLOptionsFactory {
    constructor(rootModuleOptions, optionsPreparatorService) {
        this.rootModuleOptions = rootModuleOptions;
        this.optionsPreparatorService = optionsPreparatorService;
    }
    createGqlOptions() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { globalMiddlewares } = this.rootModuleOptions;
            const { resolversClasses, container, orphanedTypes } = this.optionsPreparatorService.prepareOptions(constants_1.TYPEGRAPHQL_FEATURE_MODULE_OPTIONS, globalMiddlewares);
            const schema = yield (0, type_graphql_1.buildSchema)(Object.assign(Object.assign({}, this.rootModuleOptions), { resolvers: resolversClasses, orphanedTypes,
                container }));
            return Object.assign(Object.assign({}, this.rootModuleOptions), { schema });
        });
    }
};
TypeGraphQLOptionsFactory = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(constants_1.TYPEGRAPHQL_ROOT_MODULE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [Object, prepare_options_service_1.default])
], TypeGraphQLOptionsFactory);
exports.default = TypeGraphQLOptionsFactory;

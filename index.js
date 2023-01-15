"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeGraphQLFederationModule = exports.TypeGraphQLModule = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./types"), exports);
var typegraphql_module_1 = require("./typegraphql.module");
Object.defineProperty(exports, "TypeGraphQLModule", { enumerable: true, get: function () { return typegraphql_module_1.TypeGraphQLModule; } });
var typegraphql_federation_module_1 = require("./typegraphql-federation.module");
Object.defineProperty(exports, "TypeGraphQLFederationModule", { enumerable: true, get: function () { return typegraphql_federation_module_1.TypeGraphQLFederationModule; } });

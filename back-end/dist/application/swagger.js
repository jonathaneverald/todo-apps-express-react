"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUiServe = exports.swaggerUiSetup = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Read the OpenAPI specification file
const openApiPath = path_1.default.join(__dirname, "../../docs/openapi.json");
const openApiSpec = JSON.parse(fs_1.default.readFileSync(openApiPath, "utf8"));
// Swagger UI options
const options = {
    swaggerOptions: {
        persistAuthorization: true,
    },
};
exports.swaggerUiSetup = swagger_ui_express_1.default.setup(openApiSpec, options);
exports.swaggerUiServe = swagger_ui_express_1.default.serve;

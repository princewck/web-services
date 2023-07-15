"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// exports.Sse = void 0;
const constants_1 = require("@nestjs/common/constants");
const request_method_enum_1 = require("@nestjs/common/enums/request-method.enum");
/**
 * Declares this route as a Server-Sent-Events endpoint
 *
 * @publicApi
 */
export function Sse(path) {
    console.log('sss', path);
    return (target, key, descriptor) => {
        console.log('descriptor.value', descriptor.value);
        console.log('descriptor.path', path);
        path = path && path.length ? path : '/';
        Reflect.defineMetadata(constants_1.PATH_METADATA, path, descriptor.value);
        Reflect.defineMetadata(constants_1.METHOD_METADATA, request_method_enum_1.RequestMethod.GET, descriptor.value);
        Reflect.defineMetadata(constants_1.SSE_METADATA, true, descriptor.value);
        return descriptor;
    };
}
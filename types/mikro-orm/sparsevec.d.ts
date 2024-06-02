export class SparsevecType extends Type<string, string> {
    constructor();
    convertToDatabaseValue(value: any, platform: any): any;
    convertToJSValue(value: any, platform: any): utils.SparseVector;
    getColumnType(prop: any, platform: any): any;
}
import { Type } from "@mikro-orm/core/types";
import utils = require("../utils");

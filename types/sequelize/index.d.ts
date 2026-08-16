/// <reference path="../../src/sequelize/index.d.ts" preserve="true" />
import { Utils } from 'sequelize';
import './halfvec.js';
import './sparsevec.js';
import './vector.js';
import type { Sequelize } from 'sequelize';
declare const registerType: (Sequelize: any) => void;
declare const registerTypes: (Sequelize: any) => void;
export declare function l2Distance(column: any, value: any, sequelize: Sequelize): Utils.Literal;
export declare function maxInnerProduct(column: any, value: any, sequelize: Sequelize): Utils.Literal;
export declare function cosineDistance(column: any, value: any, sequelize: Sequelize): Utils.Literal;
export declare function l1Distance(column: any, value: any, sequelize: Sequelize): Utils.Literal;
export declare function hammingDistance(column: any, value: string, sequelize: Sequelize): Utils.Literal;
export declare function jaccardDistance(column: any, value: string, sequelize: Sequelize): Utils.Literal;
export { registerType, registerTypes };
declare const _default: {
    registerType: (Sequelize: any) => void;
    registerTypes: (Sequelize: any) => void;
};
export default _default;

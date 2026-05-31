/// <reference path="../../src/sequelize/index.d.ts" preserve="true" />
export function l2Distance(column: any, value: any, sequelize: Sequelize): Utils.Literal;
export function maxInnerProduct(column: any, value: any, sequelize: Sequelize): Utils.Literal;
export function cosineDistance(column: any, value: any, sequelize: Sequelize): Utils.Literal;
export function l1Distance(column: any, value: any, sequelize: Sequelize): Utils.Literal;
export function hammingDistance(column: any, value: string, sequelize: Sequelize): Utils.Literal;
export function jaccardDistance(column: any, value: string, sequelize: Sequelize): Utils.Literal;
declare namespace _default {
    export { registerType };
    export { registerTypes };
}
export default _default;
import type { Sequelize } from 'sequelize';
import { Utils } from 'sequelize';
export function registerType(Sequelize: any): void;
export function registerTypes(Sequelize: any): void;

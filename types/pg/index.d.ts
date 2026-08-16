import { toSql } from '../index.js';
import type { ClientBase } from 'pg';
declare function registerTypes(client: ClientBase): Promise<void>;
declare const registerType: typeof registerTypes;
export { registerType, registerTypes, toSql };
declare const _default: {
    registerType: typeof registerTypes;
    registerTypes: typeof registerTypes;
    toSql: typeof toSql;
};
export default _default;

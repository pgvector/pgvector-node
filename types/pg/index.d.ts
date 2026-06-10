declare namespace _default {
    export { registerType };
    export { registerTypes };
    export { fromSql };
    export { toSql };
}
export default _default;
export function registerType(client: ClientBase): Promise<void>;
export function registerTypes(client: ClientBase): Promise<void>;
import { fromSql } from '../index.js';
import { toSql } from '../index.js';
import type { ClientBase } from 'pg';
export { fromSql, toSql };

declare namespace _default {
    export { registerType };
    export { registerTypes };
    export { toSql };
}
export default _default;
export function registerType(client: ClientBase): Promise<void>;
export function registerTypes(client: ClientBase): Promise<void>;
import { toSql } from '../index.js';
import type { ClientBase } from 'pg';
export { toSql };

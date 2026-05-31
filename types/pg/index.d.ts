declare namespace _default {
    export { registerType };
    export { registerTypes };
    export { toSql };
}
export default _default;
export function registerType(client: Client): Promise<void>;
export function registerTypes(client: Client): Promise<void>;
import { toSql } from '../index.js';
export { toSql };

declare namespace _default {
    export { registerType };
    export { registerTypes };
    export { toSql };
}
export default _default;
export function registerType(client: any): Promise<void>;
export function registerTypes(client: any): Promise<void>;
import { toSql } from '../utils/index.js';
export { toSql };

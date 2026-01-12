declare namespace _default {
    export { registerType };
    export { registerTypes };
    export { toSql };
}
export default _default;
declare function registerType(client: any): Promise<void>;
declare function registerTypes(client: any): Promise<void>;
import { toSql } from '../utils/index.js';

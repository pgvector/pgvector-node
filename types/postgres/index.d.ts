import { vectorFromSql, vectorToSql, sparsevecFromSql, sparsevecToSql } from '../utils.js';
export declare const pgvectorTypes: {
    vector: {
        to: string;
        from: string[];
        serialize: typeof vectorToSql;
        parse: typeof vectorFromSql;
    };
    halfvec: {
        to: string;
        from: string[];
        serialize: typeof vectorToSql;
        parse: typeof vectorFromSql;
    };
    sparsevec: {
        to: string;
        from: string[];
        serialize: typeof sparsevecToSql;
        parse: typeof sparsevecFromSql;
    };
};

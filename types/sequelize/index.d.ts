import type { DataType } from 'sequelize';

// VECTOR data type constructor
export interface VectorDataTypeConstructor {
  new (dimensions?: number): DataType;
  (dimensions?: number): DataType;
}

// HALFVEC data type constructor
export interface HalfvecDataTypeConstructor {
  new (dimensions?: number): DataType;
  (dimensions?: number): DataType;
}

// SPARSEVEC data type constructor
export interface SparsevecDataTypeConstructor {
  new (dimensions?: number): DataType;
  (dimensions?: number): DataType;
}

// Module augmentation to extend Sequelize DataTypes
declare module 'sequelize' {
  namespace DataTypes {
    const VECTOR: VectorDataTypeConstructor;
    const HALFVEC: HalfvecDataTypeConstructor;
    const SPARSEVEC: SparsevecDataTypeConstructor;
    
    namespace postgres {
      const VECTOR: VectorDataTypeConstructor;
      const HALFVEC: HalfvecDataTypeConstructor;
      const SPARSEVEC: SparsevecDataTypeConstructor;
    }
  }
}

export function registerType(Sequelize: any): void;
export function registerTypes(Sequelize: any): void;
export function l2Distance(column: any, value: any, sequelize: any): any;
export function maxInnerProduct(column: any, value: any, sequelize: any): any;
export function cosineDistance(column: any, value: any, sequelize: any): any;
export function l1Distance(column: any, value: any, sequelize: any): any;
export function hammingDistance(column: any, value: any, sequelize: any): any;
export function jaccardDistance(column: any, value: any, sequelize: any): any;

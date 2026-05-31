import 'sequelize';

declare module 'sequelize' {
  namespace DataTypes {
    interface VectorDataTypeConstructor extends AbstractDataTypeConstructor {
      new (dimensions?: number): DataType;
      (dimensions?: number): DataType;
    }

    const VECTOR: VectorDataTypeConstructor;
    const HALFVEC: VectorDataTypeConstructor;
    const SPARSEVEC: VectorDataTypeConstructor;
  }
}

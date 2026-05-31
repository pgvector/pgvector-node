import 'sequelize';

declare module 'sequelize' {
  namespace DataTypes {
    interface VectorDataTypeConstructor extends AbstractDataTypeConstructor {
      new (dimensions?: number): AbstractDataType;
      (dimensions?: number): AbstractDataType;
    }

    const VECTOR: VectorDataTypeConstructor;
    const HALFVEC: VectorDataTypeConstructor;
    const SPARSEVEC: VectorDataTypeConstructor;
  }
}

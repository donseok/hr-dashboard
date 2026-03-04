import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode, ObjectValueNode } from 'graphql';

@Scalar('JSON')
export class JsonScalar implements CustomScalar<unknown, unknown> {
  description = 'JSON custom scalar type';

  parseValue(value: unknown): unknown {
    return value;
  }

  serialize(value: unknown): unknown {
    return value;
  }

  parseLiteral(ast: ValueNode): unknown {
    switch (ast.kind) {
      case Kind.STRING:
        return ast.value;
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.INT:
        return parseInt(ast.value, 10);
      case Kind.FLOAT:
        return parseFloat(ast.value);
      case Kind.OBJECT:
        return this.parseObject(ast);
      case Kind.LIST:
        return ast.values.map((v) => this.parseLiteral(v));
      default:
        return null;
    }
  }

  private parseObject(ast: ObjectValueNode): Record<string, unknown> {
    const value: Record<string, unknown> = {};
    ast.fields.forEach((field) => {
      value[field.name.value] = this.parseLiteral(field.value);
    });
    return value;
  }
}

import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  parseValue(value: unknown): Date {
    return new Date(value as string);
  }

  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return new Date(value as string).toISOString();
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return new Date();
  }
}

import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("NodeEntryWhereUniqueInput", {
  isAbstract: true
})
export class NodeEntryWhereUniqueInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  uid?: string | undefined;
}

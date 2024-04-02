import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NodeStatus } from "../../enums/NodeStatus";

@TypeGraphQL.InputType("NestedEnumNodeStatusFilter", {
  isAbstract: true
})
export class NestedEnumNodeStatusFilter {
  @TypeGraphQL.Field(_type => NodeStatus, {
    nullable: true
  })
  equals?: "INITIATED" | "VERIFIED" | "INVALID" | undefined;

  @TypeGraphQL.Field(_type => [NodeStatus], {
    nullable: true
  })
  in?: Array<"INITIATED" | "VERIFIED" | "INVALID"> | undefined;

  @TypeGraphQL.Field(_type => [NodeStatus], {
    nullable: true
  })
  notIn?: Array<"INITIATED" | "VERIFIED" | "INVALID"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumNodeStatusFilter, {
    nullable: true
  })
  not?: NestedEnumNodeStatusFilter | undefined;
}

import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumNodeStatusFilter } from "../inputs/NestedEnumNodeStatusFilter";
import { NodeStatus } from "../../enums/NodeStatus";

@TypeGraphQL.InputType("EnumNodeStatusFilter", {
  isAbstract: true
})
export class EnumNodeStatusFilter {
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

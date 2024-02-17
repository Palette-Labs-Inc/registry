import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumNodeStatusFilter } from "../inputs/NestedEnumNodeStatusFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { NodeStatus } from "../../enums/NodeStatus";

@TypeGraphQL.InputType("NestedEnumNodeStatusWithAggregatesFilter", {
  isAbstract: true
})
export class NestedEnumNodeStatusWithAggregatesFilter {
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

  @TypeGraphQL.Field(_type => NestedEnumNodeStatusWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumNodeStatusWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumNodeStatusFilter, {
    nullable: true
  })
  _min?: NestedEnumNodeStatusFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumNodeStatusFilter, {
    nullable: true
  })
  _max?: NestedEnumNodeStatusFilter | undefined;
}

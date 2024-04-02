import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumNodeTypeFilter } from "../inputs/NestedEnumNodeTypeFilter";
import { NestedEnumNodeTypeWithAggregatesFilter } from "../inputs/NestedEnumNodeTypeWithAggregatesFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { NodeType } from "../../enums/NodeType";

@TypeGraphQL.InputType("EnumNodeTypeWithAggregatesFilter", {
  isAbstract: true
})
export class EnumNodeTypeWithAggregatesFilter {
  @TypeGraphQL.Field(_type => NodeType, {
    nullable: true
  })
  equals?: "PSN" | "BSN" | "GP" | undefined;

  @TypeGraphQL.Field(_type => [NodeType], {
    nullable: true
  })
  in?: Array<"PSN" | "BSN" | "GP"> | undefined;

  @TypeGraphQL.Field(_type => [NodeType], {
    nullable: true
  })
  notIn?: Array<"PSN" | "BSN" | "GP"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumNodeTypeWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumNodeTypeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumNodeTypeFilter, {
    nullable: true
  })
  _min?: NestedEnumNodeTypeFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumNodeTypeFilter, {
    nullable: true
  })
  _max?: NestedEnumNodeTypeFilter | undefined;
}

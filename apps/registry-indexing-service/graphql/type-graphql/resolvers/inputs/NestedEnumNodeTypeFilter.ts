import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NodeType } from "../../enums/NodeType";

@TypeGraphQL.InputType("NestedEnumNodeTypeFilter", {
  isAbstract: true
})
export class NestedEnumNodeTypeFilter {
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

  @TypeGraphQL.Field(_type => NestedEnumNodeTypeFilter, {
    nullable: true
  })
  not?: NestedEnumNodeTypeFilter | undefined;
}

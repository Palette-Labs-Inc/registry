import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { EnumNodeStatusFilter } from "../inputs/EnumNodeStatusFilter";
import { EnumNodeTypeFilter } from "../inputs/EnumNodeTypeFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StringNullableListFilter } from "../inputs/StringNullableListFilter";

@TypeGraphQL.InputType("NodeEntryWhereInput", {
  isAbstract: true
})
export class NodeEntryWhereInput {
  @TypeGraphQL.Field(_type => [NodeEntryWhereInput], {
    nullable: true
  })
  AND?: NodeEntryWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [NodeEntryWhereInput], {
    nullable: true
  })
  OR?: NodeEntryWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [NodeEntryWhereInput], {
    nullable: true
  })
  NOT?: NodeEntryWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  uid?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  name?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  callbackUrl?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableListFilter, {
    nullable: true
  })
  location?: StringNullableListFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  industryCode?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  owner?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => EnumNodeTypeFilter, {
    nullable: true
  })
  nodeType?: EnumNodeTypeFilter | undefined;

  @TypeGraphQL.Field(_type => EnumNodeStatusFilter, {
    nullable: true
  })
  status?: EnumNodeStatusFilter | undefined;
}

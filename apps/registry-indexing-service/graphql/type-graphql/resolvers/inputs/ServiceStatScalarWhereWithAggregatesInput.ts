import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType("ServiceStatScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class ServiceStatScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [ServiceStatScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: ServiceStatScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [ServiceStatScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: ServiceStatScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [ServiceStatScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: ServiceStatScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  name?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  value?: StringWithAggregatesFilter | undefined;
}

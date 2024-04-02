import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType("ServiceStatWhereInput", {
  isAbstract: true
})
export class ServiceStatWhereInput {
  @TypeGraphQL.Field(_type => [ServiceStatWhereInput], {
    nullable: true
  })
  AND?: ServiceStatWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [ServiceStatWhereInput], {
    nullable: true
  })
  OR?: ServiceStatWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [ServiceStatWhereInput], {
    nullable: true
  })
  NOT?: ServiceStatWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  name?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  value?: StringFilter | undefined;
}

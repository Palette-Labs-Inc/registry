import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ServiceStatOrderByWithRelationInput } from "../../../inputs/ServiceStatOrderByWithRelationInput";
import { ServiceStatWhereInput } from "../../../inputs/ServiceStatWhereInput";
import { ServiceStatWhereUniqueInput } from "../../../inputs/ServiceStatWhereUniqueInput";
import { ServiceStatScalarFieldEnum } from "../../../../enums/ServiceStatScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindFirstServiceStatArgs {
  @TypeGraphQL.Field(_type => ServiceStatWhereInput, {
    nullable: true
  })
  where?: ServiceStatWhereInput | undefined;

  @TypeGraphQL.Field(_type => [ServiceStatOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: ServiceStatOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => ServiceStatWhereUniqueInput, {
    nullable: true
  })
  cursor?: ServiceStatWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [ServiceStatScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"name" | "value"> | undefined;
}

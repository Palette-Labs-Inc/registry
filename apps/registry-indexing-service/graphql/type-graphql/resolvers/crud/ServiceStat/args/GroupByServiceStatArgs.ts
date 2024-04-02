import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ServiceStatOrderByWithAggregationInput } from "../../../inputs/ServiceStatOrderByWithAggregationInput";
import { ServiceStatScalarWhereWithAggregatesInput } from "../../../inputs/ServiceStatScalarWhereWithAggregatesInput";
import { ServiceStatWhereInput } from "../../../inputs/ServiceStatWhereInput";
import { ServiceStatScalarFieldEnum } from "../../../../enums/ServiceStatScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByServiceStatArgs {
  @TypeGraphQL.Field(_type => ServiceStatWhereInput, {
    nullable: true
  })
  where?: ServiceStatWhereInput | undefined;

  @TypeGraphQL.Field(_type => [ServiceStatOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: ServiceStatOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [ServiceStatScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"name" | "value">;

  @TypeGraphQL.Field(_type => ServiceStatScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: ServiceStatScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}

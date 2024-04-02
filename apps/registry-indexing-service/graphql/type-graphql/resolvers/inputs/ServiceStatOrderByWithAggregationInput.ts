import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ServiceStatCountOrderByAggregateInput } from "../inputs/ServiceStatCountOrderByAggregateInput";
import { ServiceStatMaxOrderByAggregateInput } from "../inputs/ServiceStatMaxOrderByAggregateInput";
import { ServiceStatMinOrderByAggregateInput } from "../inputs/ServiceStatMinOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("ServiceStatOrderByWithAggregationInput", {
  isAbstract: true
})
export class ServiceStatOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  name?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  value?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => ServiceStatCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: ServiceStatCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => ServiceStatMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: ServiceStatMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => ServiceStatMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: ServiceStatMinOrderByAggregateInput | undefined;
}

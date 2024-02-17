import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ServiceStatCountAggregate } from "../outputs/ServiceStatCountAggregate";
import { ServiceStatMaxAggregate } from "../outputs/ServiceStatMaxAggregate";
import { ServiceStatMinAggregate } from "../outputs/ServiceStatMinAggregate";

@TypeGraphQL.ObjectType("ServiceStatGroupBy", {
  isAbstract: true
})
export class ServiceStatGroupBy {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  value!: string;

  @TypeGraphQL.Field(_type => ServiceStatCountAggregate, {
    nullable: true
  })
  _count!: ServiceStatCountAggregate | null;

  @TypeGraphQL.Field(_type => ServiceStatMinAggregate, {
    nullable: true
  })
  _min!: ServiceStatMinAggregate | null;

  @TypeGraphQL.Field(_type => ServiceStatMaxAggregate, {
    nullable: true
  })
  _max!: ServiceStatMaxAggregate | null;
}

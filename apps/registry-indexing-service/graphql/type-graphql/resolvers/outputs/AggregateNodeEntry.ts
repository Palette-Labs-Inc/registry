import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NodeEntryCountAggregate } from "../outputs/NodeEntryCountAggregate";
import { NodeEntryMaxAggregate } from "../outputs/NodeEntryMaxAggregate";
import { NodeEntryMinAggregate } from "../outputs/NodeEntryMinAggregate";

@TypeGraphQL.ObjectType("AggregateNodeEntry", {
  isAbstract: true
})
export class AggregateNodeEntry {
  @TypeGraphQL.Field(_type => NodeEntryCountAggregate, {
    nullable: true
  })
  _count!: NodeEntryCountAggregate | null;

  @TypeGraphQL.Field(_type => NodeEntryMinAggregate, {
    nullable: true
  })
  _min!: NodeEntryMinAggregate | null;

  @TypeGraphQL.Field(_type => NodeEntryMaxAggregate, {
    nullable: true
  })
  _max!: NodeEntryMaxAggregate | null;
}

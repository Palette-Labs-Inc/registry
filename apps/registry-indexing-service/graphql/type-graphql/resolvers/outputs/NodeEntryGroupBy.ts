import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NodeEntryCountAggregate } from "../outputs/NodeEntryCountAggregate";
import { NodeEntryMaxAggregate } from "../outputs/NodeEntryMaxAggregate";
import { NodeEntryMinAggregate } from "../outputs/NodeEntryMinAggregate";
import { NodeStatus } from "../../enums/NodeStatus";
import { NodeType } from "../../enums/NodeType";

@TypeGraphQL.ObjectType("NodeEntryGroupBy", {
  isAbstract: true
})
export class NodeEntryGroupBy {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  uid!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  callbackUrl!: string;

  @TypeGraphQL.Field(_type => [String], {
    nullable: true
  })
  location!: string[] | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  industryCode!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  owner!: string;

  @TypeGraphQL.Field(_type => NodeType, {
    nullable: false
  })
  nodeType!: "PSN" | "BSN" | "GP";

  @TypeGraphQL.Field(_type => NodeStatus, {
    nullable: false
  })
  status!: "INITIATED" | "VERIFIED" | "INVALID";

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

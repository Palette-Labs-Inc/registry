import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NodeEntryCreatelocationInput } from "../inputs/NodeEntryCreatelocationInput";
import { NodeStatus } from "../../enums/NodeStatus";
import { NodeType } from "../../enums/NodeType";

@TypeGraphQL.InputType("NodeEntryCreateInput", {
  isAbstract: true
})
export class NodeEntryCreateInput {
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

  @TypeGraphQL.Field(_type => NodeEntryCreatelocationInput, {
    nullable: true
  })
  location?: NodeEntryCreatelocationInput | undefined;

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
}

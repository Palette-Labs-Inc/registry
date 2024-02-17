import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NodeStatus } from "../../enums/NodeStatus";
import { NodeType } from "../../enums/NodeType";

@TypeGraphQL.ObjectType("NodeEntryMinAggregate", {
  isAbstract: true
})
export class NodeEntryMinAggregate {
  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  uid!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  name!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  callbackUrl!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  industryCode!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  owner!: string | null;

  @TypeGraphQL.Field(_type => NodeType, {
    nullable: true
  })
  nodeType!: "PSN" | "BSN" | "GP" | null;

  @TypeGraphQL.Field(_type => NodeStatus, {
    nullable: true
  })
  status!: "INITIATED" | "VERIFIED" | "INVALID" | null;
}

import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NodeStatus } from "../../enums/NodeStatus";

@TypeGraphQL.InputType("EnumNodeStatusFieldUpdateOperationsInput", {
  isAbstract: true
})
export class EnumNodeStatusFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => NodeStatus, {
    nullable: true
  })
  set?: "INITIATED" | "VERIFIED" | "INVALID" | undefined;
}

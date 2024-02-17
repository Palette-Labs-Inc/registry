import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NodeType } from "../../enums/NodeType";

@TypeGraphQL.InputType("EnumNodeTypeFieldUpdateOperationsInput", {
  isAbstract: true
})
export class EnumNodeTypeFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => NodeType, {
    nullable: true
  })
  set?: "PSN" | "BSN" | "GP" | undefined;
}

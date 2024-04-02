import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { EnumNodeStatusFieldUpdateOperationsInput } from "../inputs/EnumNodeStatusFieldUpdateOperationsInput";
import { EnumNodeTypeFieldUpdateOperationsInput } from "../inputs/EnumNodeTypeFieldUpdateOperationsInput";
import { NodeEntryUpdatelocationInput } from "../inputs/NodeEntryUpdatelocationInput";
import { StringFieldUpdateOperationsInput } from "../inputs/StringFieldUpdateOperationsInput";

@TypeGraphQL.InputType("NodeEntryUpdateManyMutationInput", {
  isAbstract: true
})
export class NodeEntryUpdateManyMutationInput {
  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  uid?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  name?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  callbackUrl?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NodeEntryUpdatelocationInput, {
    nullable: true
  })
  location?: NodeEntryUpdatelocationInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  industryCode?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  owner?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => EnumNodeTypeFieldUpdateOperationsInput, {
    nullable: true
  })
  nodeType?: EnumNodeTypeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => EnumNodeStatusFieldUpdateOperationsInput, {
    nullable: true
  })
  status?: EnumNodeStatusFieldUpdateOperationsInput | undefined;
}

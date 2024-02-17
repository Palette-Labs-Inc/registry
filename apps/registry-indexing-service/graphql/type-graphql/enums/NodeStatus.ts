import * as TypeGraphQL from "type-graphql";

export enum NodeStatus {
  INITIATED = "INITIATED",
  VERIFIED = "VERIFIED",
  INVALID = "INVALID"
}
TypeGraphQL.registerEnumType(NodeStatus, {
  name: "NodeStatus",
  description: undefined,
});

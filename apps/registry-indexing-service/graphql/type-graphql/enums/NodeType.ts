import * as TypeGraphQL from "type-graphql";

export enum NodeType {
  PSN = "PSN",
  BSN = "BSN",
  GP = "GP"
}
TypeGraphQL.registerEnumType(NodeType, {
  name: "NodeType",
  description: undefined,
});

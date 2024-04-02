import * as TypeGraphQL from "type-graphql";

export enum NodeEntryScalarFieldEnum {
  uid = "uid",
  name = "name",
  callbackUrl = "callbackUrl",
  location = "location",
  industryCode = "industryCode",
  owner = "owner",
  nodeType = "nodeType",
  status = "status"
}
TypeGraphQL.registerEnumType(NodeEntryScalarFieldEnum, {
  name: "NodeEntryScalarFieldEnum",
  description: undefined,
});

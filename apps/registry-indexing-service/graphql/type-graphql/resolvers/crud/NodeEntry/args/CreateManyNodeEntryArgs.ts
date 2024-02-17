import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NodeEntryCreateManyInput } from "../../../inputs/NodeEntryCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyNodeEntryArgs {
  @TypeGraphQL.Field(_type => [NodeEntryCreateManyInput], {
    nullable: false
  })
  data!: NodeEntryCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}

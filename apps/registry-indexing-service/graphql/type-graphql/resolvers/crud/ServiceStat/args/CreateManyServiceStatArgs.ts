import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ServiceStatCreateManyInput } from "../../../inputs/ServiceStatCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyServiceStatArgs {
  @TypeGraphQL.Field(_type => [ServiceStatCreateManyInput], {
    nullable: false
  })
  data!: ServiceStatCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}

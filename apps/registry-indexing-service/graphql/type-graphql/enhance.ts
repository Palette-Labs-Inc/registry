import { ClassType } from "type-graphql";
import * as tslib from "tslib";
import * as crudResolvers from "./resolvers/crud/resolvers-crud.index";
import * as argsTypes from "./resolvers/crud/args.index";
import * as actionResolvers from "./resolvers/crud/resolvers-actions.index";
import * as models from "./models";
import * as outputTypes from "./resolvers/outputs";
import * as inputTypes from "./resolvers/inputs";

export type MethodDecoratorOverrideFn = (decorators: MethodDecorator[]) => MethodDecorator[];

const crudResolversMap = {
  NodeEntry: crudResolvers.NodeEntryCrudResolver,
  ServiceStat: crudResolvers.ServiceStatCrudResolver
};
const actionResolversMap = {
  NodeEntry: {
    aggregateNodeEntry: actionResolvers.AggregateNodeEntryResolver,
    createManyNodeEntry: actionResolvers.CreateManyNodeEntryResolver,
    createOneNodeEntry: actionResolvers.CreateOneNodeEntryResolver,
    deleteManyNodeEntry: actionResolvers.DeleteManyNodeEntryResolver,
    deleteOneNodeEntry: actionResolvers.DeleteOneNodeEntryResolver,
    findFirstNodeEntry: actionResolvers.FindFirstNodeEntryResolver,
    findFirstNodeEntryOrThrow: actionResolvers.FindFirstNodeEntryOrThrowResolver,
    nodeEntries: actionResolvers.FindManyNodeEntryResolver,
    nodeEntry: actionResolvers.FindUniqueNodeEntryResolver,
    getNodeEntry: actionResolvers.FindUniqueNodeEntryOrThrowResolver,
    groupByNodeEntry: actionResolvers.GroupByNodeEntryResolver,
    updateManyNodeEntry: actionResolvers.UpdateManyNodeEntryResolver,
    updateOneNodeEntry: actionResolvers.UpdateOneNodeEntryResolver,
    upsertOneNodeEntry: actionResolvers.UpsertOneNodeEntryResolver
  },
  ServiceStat: {
    aggregateServiceStat: actionResolvers.AggregateServiceStatResolver,
    createManyServiceStat: actionResolvers.CreateManyServiceStatResolver,
    createOneServiceStat: actionResolvers.CreateOneServiceStatResolver,
    deleteManyServiceStat: actionResolvers.DeleteManyServiceStatResolver,
    deleteOneServiceStat: actionResolvers.DeleteOneServiceStatResolver,
    findFirstServiceStat: actionResolvers.FindFirstServiceStatResolver,
    findFirstServiceStatOrThrow: actionResolvers.FindFirstServiceStatOrThrowResolver,
    serviceStats: actionResolvers.FindManyServiceStatResolver,
    serviceStat: actionResolvers.FindUniqueServiceStatResolver,
    getServiceStat: actionResolvers.FindUniqueServiceStatOrThrowResolver,
    groupByServiceStat: actionResolvers.GroupByServiceStatResolver,
    updateManyServiceStat: actionResolvers.UpdateManyServiceStatResolver,
    updateOneServiceStat: actionResolvers.UpdateOneServiceStatResolver,
    upsertOneServiceStat: actionResolvers.UpsertOneServiceStatResolver
  }
};
const crudResolversInfo = {
  NodeEntry: ["aggregateNodeEntry", "createManyNodeEntry", "createOneNodeEntry", "deleteManyNodeEntry", "deleteOneNodeEntry", "findFirstNodeEntry", "findFirstNodeEntryOrThrow", "nodeEntries", "nodeEntry", "getNodeEntry", "groupByNodeEntry", "updateManyNodeEntry", "updateOneNodeEntry", "upsertOneNodeEntry"],
  ServiceStat: ["aggregateServiceStat", "createManyServiceStat", "createOneServiceStat", "deleteManyServiceStat", "deleteOneServiceStat", "findFirstServiceStat", "findFirstServiceStatOrThrow", "serviceStats", "serviceStat", "getServiceStat", "groupByServiceStat", "updateManyServiceStat", "updateOneServiceStat", "upsertOneServiceStat"]
};
const argsInfo = {
  AggregateNodeEntryArgs: ["where", "orderBy", "cursor", "take", "skip"],
  CreateManyNodeEntryArgs: ["data", "skipDuplicates"],
  CreateOneNodeEntryArgs: ["data"],
  DeleteManyNodeEntryArgs: ["where"],
  DeleteOneNodeEntryArgs: ["where"],
  FindFirstNodeEntryArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  FindFirstNodeEntryOrThrowArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  FindManyNodeEntryArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  FindUniqueNodeEntryArgs: ["where"],
  FindUniqueNodeEntryOrThrowArgs: ["where"],
  GroupByNodeEntryArgs: ["where", "orderBy", "by", "having", "take", "skip"],
  UpdateManyNodeEntryArgs: ["data", "where"],
  UpdateOneNodeEntryArgs: ["data", "where"],
  UpsertOneNodeEntryArgs: ["where", "create", "update"],
  AggregateServiceStatArgs: ["where", "orderBy", "cursor", "take", "skip"],
  CreateManyServiceStatArgs: ["data", "skipDuplicates"],
  CreateOneServiceStatArgs: ["data"],
  DeleteManyServiceStatArgs: ["where"],
  DeleteOneServiceStatArgs: ["where"],
  FindFirstServiceStatArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  FindFirstServiceStatOrThrowArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  FindManyServiceStatArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  FindUniqueServiceStatArgs: ["where"],
  FindUniqueServiceStatOrThrowArgs: ["where"],
  GroupByServiceStatArgs: ["where", "orderBy", "by", "having", "take", "skip"],
  UpdateManyServiceStatArgs: ["data", "where"],
  UpdateOneServiceStatArgs: ["data", "where"],
  UpsertOneServiceStatArgs: ["where", "create", "update"]
};

type ResolverModelNames = keyof typeof crudResolversMap;

type ModelResolverActionNames<
  TModel extends ResolverModelNames
> = keyof typeof crudResolversMap[TModel]["prototype"];

export type ResolverActionsConfig<
  TModel extends ResolverModelNames
> = Partial<Record<ModelResolverActionNames<TModel>, MethodDecorator[] | MethodDecoratorOverrideFn>>
  & { _all?: MethodDecorator[] };

export type ResolversEnhanceMap = {
  [TModel in ResolverModelNames]?: ResolverActionsConfig<TModel>;
};

export function applyResolversEnhanceMap(
  resolversEnhanceMap: ResolversEnhanceMap,
) {
  for (const resolversEnhanceMapKey of Object.keys(resolversEnhanceMap)) {
    const modelName = resolversEnhanceMapKey as keyof typeof resolversEnhanceMap;
    const crudTarget = crudResolversMap[modelName].prototype;
    const resolverActionsConfig = resolversEnhanceMap[modelName]!;
    const actionResolversConfig = actionResolversMap[modelName];
    const allActionsDecorators = resolverActionsConfig._all ?? [];
    const resolverActionNames = crudResolversInfo[modelName as keyof typeof crudResolversInfo];
    for (const resolverActionName of resolverActionNames) {
      const maybeDecoratorsOrFn = resolverActionsConfig[
        resolverActionName as keyof typeof resolverActionsConfig
      ] as MethodDecorator[] | MethodDecoratorOverrideFn | undefined;
      let decorators: MethodDecorator[];
      if (typeof maybeDecoratorsOrFn === "function") {
        decorators = maybeDecoratorsOrFn(allActionsDecorators);
      } else {
        decorators = [...allActionsDecorators, ...maybeDecoratorsOrFn ?? []];
      }
      const actionTarget = (actionResolversConfig[
        resolverActionName as keyof typeof actionResolversConfig
      ] as Function).prototype;
      tslib.__decorate(decorators, crudTarget, resolverActionName, null);
      tslib.__decorate(decorators, actionTarget, resolverActionName, null);
    }
  }
}

type ArgsTypesNames = keyof typeof argsTypes;

type ArgFieldNames<TArgsType extends ArgsTypesNames> = Exclude<
  keyof typeof argsTypes[TArgsType]["prototype"],
  number | symbol
>;

type ArgFieldsConfig<
  TArgsType extends ArgsTypesNames
> = FieldsConfig<ArgFieldNames<TArgsType>>;

export type ArgConfig<TArgsType extends ArgsTypesNames> = {
  class?: ClassDecorator[];
  fields?: ArgFieldsConfig<TArgsType>;
};

export type ArgsTypesEnhanceMap = {
  [TArgsType in ArgsTypesNames]?: ArgConfig<TArgsType>;
};

export function applyArgsTypesEnhanceMap(
  argsTypesEnhanceMap: ArgsTypesEnhanceMap,
) {
  for (const argsTypesEnhanceMapKey of Object.keys(argsTypesEnhanceMap)) {
    const argsTypeName = argsTypesEnhanceMapKey as keyof typeof argsTypesEnhanceMap;
    const typeConfig = argsTypesEnhanceMap[argsTypeName]!;
    const typeClass = argsTypes[argsTypeName];
    const typeTarget = typeClass.prototype;
    applyTypeClassEnhanceConfig(
      typeConfig,
      typeClass,
      typeTarget,
      argsInfo[argsTypeName as keyof typeof argsInfo],
    );
  }
}

type TypeConfig = {
  class?: ClassDecorator[];
  fields?: FieldsConfig;
};

export type PropertyDecoratorOverrideFn = (decorators: PropertyDecorator[]) => PropertyDecorator[];

type FieldsConfig<TTypeKeys extends string = string> = Partial<
  Record<TTypeKeys, PropertyDecorator[] | PropertyDecoratorOverrideFn>
> & { _all?: PropertyDecorator[] };

function applyTypeClassEnhanceConfig<
  TEnhanceConfig extends TypeConfig,
  TType extends object
>(
  enhanceConfig: TEnhanceConfig,
  typeClass: ClassType<TType>,
  typePrototype: TType,
  typeFieldNames: string[]
) {
  if (enhanceConfig.class) {
    tslib.__decorate(enhanceConfig.class, typeClass);
  }
  if (enhanceConfig.fields) {
    const allFieldsDecorators = enhanceConfig.fields._all ?? [];
    for (const typeFieldName of typeFieldNames) {
      const maybeDecoratorsOrFn = enhanceConfig.fields[
        typeFieldName
      ] as PropertyDecorator[] | PropertyDecoratorOverrideFn | undefined;
      let decorators: PropertyDecorator[];
      if (typeof maybeDecoratorsOrFn === "function") {
        decorators = maybeDecoratorsOrFn(allFieldsDecorators);
      } else {
        decorators = [...allFieldsDecorators, ...maybeDecoratorsOrFn ?? []];
      }
      tslib.__decorate(decorators, typePrototype, typeFieldName, void 0);
    }
  }
}

const modelsInfo = {
  NodeEntry: ["uid", "name", "callbackUrl", "location", "industryCode", "owner", "nodeType", "status"],
  ServiceStat: ["name", "value"]
};

type ModelNames = keyof typeof models;

type ModelFieldNames<TModel extends ModelNames> = Exclude<
  keyof typeof models[TModel]["prototype"],
  number | symbol
>;

type ModelFieldsConfig<TModel extends ModelNames> = FieldsConfig<
  ModelFieldNames<TModel>
>;

export type ModelConfig<TModel extends ModelNames> = {
  class?: ClassDecorator[];
  fields?: ModelFieldsConfig<TModel>;
};

export type ModelsEnhanceMap = {
  [TModel in ModelNames]?: ModelConfig<TModel>;
};

export function applyModelsEnhanceMap(modelsEnhanceMap: ModelsEnhanceMap) {
  for (const modelsEnhanceMapKey of Object.keys(modelsEnhanceMap)) {
    const modelName = modelsEnhanceMapKey as keyof typeof modelsEnhanceMap;
    const modelConfig = modelsEnhanceMap[modelName]!;
    const modelClass = models[modelName];
    const modelTarget = modelClass.prototype;
    applyTypeClassEnhanceConfig(
      modelConfig,
      modelClass,
      modelTarget,
      modelsInfo[modelName as keyof typeof modelsInfo],
    );
  }
}

const outputsInfo = {
  AggregateNodeEntry: ["_count", "_min", "_max"],
  NodeEntryGroupBy: ["uid", "name", "callbackUrl", "location", "industryCode", "owner", "nodeType", "status", "_count", "_min", "_max"],
  AggregateServiceStat: ["_count", "_min", "_max"],
  ServiceStatGroupBy: ["name", "value", "_count", "_min", "_max"],
  AffectedRowsOutput: ["count"],
  NodeEntryCountAggregate: ["uid", "name", "callbackUrl", "location", "industryCode", "owner", "nodeType", "status", "_all"],
  NodeEntryMinAggregate: ["uid", "name", "callbackUrl", "industryCode", "owner", "nodeType", "status"],
  NodeEntryMaxAggregate: ["uid", "name", "callbackUrl", "industryCode", "owner", "nodeType", "status"],
  ServiceStatCountAggregate: ["name", "value", "_all"],
  ServiceStatMinAggregate: ["name", "value"],
  ServiceStatMaxAggregate: ["name", "value"]
};

type OutputTypesNames = keyof typeof outputTypes;

type OutputTypeFieldNames<TOutput extends OutputTypesNames> = Exclude<
  keyof typeof outputTypes[TOutput]["prototype"],
  number | symbol
>;

type OutputTypeFieldsConfig<
  TOutput extends OutputTypesNames
> = FieldsConfig<OutputTypeFieldNames<TOutput>>;

export type OutputTypeConfig<TOutput extends OutputTypesNames> = {
  class?: ClassDecorator[];
  fields?: OutputTypeFieldsConfig<TOutput>;
};

export type OutputTypesEnhanceMap = {
  [TOutput in OutputTypesNames]?: OutputTypeConfig<TOutput>;
};

export function applyOutputTypesEnhanceMap(
  outputTypesEnhanceMap: OutputTypesEnhanceMap,
) {
  for (const outputTypeEnhanceMapKey of Object.keys(outputTypesEnhanceMap)) {
    const outputTypeName = outputTypeEnhanceMapKey as keyof typeof outputTypesEnhanceMap;
    const typeConfig = outputTypesEnhanceMap[outputTypeName]!;
    const typeClass = outputTypes[outputTypeName];
    const typeTarget = typeClass.prototype;
    applyTypeClassEnhanceConfig(
      typeConfig,
      typeClass,
      typeTarget,
      outputsInfo[outputTypeName as keyof typeof outputsInfo],
    );
  }
}

const inputsInfo = {
  NodeEntryWhereInput: ["AND", "OR", "NOT", "uid", "name", "callbackUrl", "location", "industryCode", "owner", "nodeType", "status"],
  NodeEntryOrderByWithRelationInput: ["uid", "name", "callbackUrl", "location", "industryCode", "owner", "nodeType", "status"],
  NodeEntryWhereUniqueInput: ["uid"],
  NodeEntryOrderByWithAggregationInput: ["uid", "name", "callbackUrl", "location", "industryCode", "owner", "nodeType", "status", "_count", "_max", "_min"],
  NodeEntryScalarWhereWithAggregatesInput: ["AND", "OR", "NOT", "uid", "name", "callbackUrl", "location", "industryCode", "owner", "nodeType", "status"],
  ServiceStatWhereInput: ["AND", "OR", "NOT", "name", "value"],
  ServiceStatOrderByWithRelationInput: ["name", "value"],
  ServiceStatWhereUniqueInput: ["name"],
  ServiceStatOrderByWithAggregationInput: ["name", "value", "_count", "_max", "_min"],
  ServiceStatScalarWhereWithAggregatesInput: ["AND", "OR", "NOT", "name", "value"],
  NodeEntryCreateInput: ["uid", "name", "callbackUrl", "location", "industryCode", "owner", "nodeType", "status"],
  NodeEntryUpdateInput: ["uid", "name", "callbackUrl", "location", "industryCode", "owner", "nodeType", "status"],
  NodeEntryCreateManyInput: ["uid", "name", "callbackUrl", "location", "industryCode", "owner", "nodeType", "status"],
  NodeEntryUpdateManyMutationInput: ["uid", "name", "callbackUrl", "location", "industryCode", "owner", "nodeType", "status"],
  ServiceStatCreateInput: ["name", "value"],
  ServiceStatUpdateInput: ["name", "value"],
  ServiceStatCreateManyInput: ["name", "value"],
  ServiceStatUpdateManyMutationInput: ["name", "value"],
  StringFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "mode", "not"],
  StringNullableListFilter: ["equals", "has", "hasEvery", "hasSome", "isEmpty"],
  EnumNodeTypeFilter: ["equals", "in", "notIn", "not"],
  EnumNodeStatusFilter: ["equals", "in", "notIn", "not"],
  NodeEntryCountOrderByAggregateInput: ["uid", "name", "callbackUrl", "location", "industryCode", "owner", "nodeType", "status"],
  NodeEntryMaxOrderByAggregateInput: ["uid", "name", "callbackUrl", "industryCode", "owner", "nodeType", "status"],
  NodeEntryMinOrderByAggregateInput: ["uid", "name", "callbackUrl", "industryCode", "owner", "nodeType", "status"],
  StringWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "mode", "not", "_count", "_min", "_max"],
  EnumNodeTypeWithAggregatesFilter: ["equals", "in", "notIn", "not", "_count", "_min", "_max"],
  EnumNodeStatusWithAggregatesFilter: ["equals", "in", "notIn", "not", "_count", "_min", "_max"],
  ServiceStatCountOrderByAggregateInput: ["name", "value"],
  ServiceStatMaxOrderByAggregateInput: ["name", "value"],
  ServiceStatMinOrderByAggregateInput: ["name", "value"],
  NodeEntryCreatelocationInput: ["set"],
  StringFieldUpdateOperationsInput: ["set"],
  NodeEntryUpdatelocationInput: ["set", "push"],
  EnumNodeTypeFieldUpdateOperationsInput: ["set"],
  EnumNodeStatusFieldUpdateOperationsInput: ["set"],
  NestedStringFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "not"],
  NestedEnumNodeTypeFilter: ["equals", "in", "notIn", "not"],
  NestedEnumNodeStatusFilter: ["equals", "in", "notIn", "not"],
  NestedStringWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "not", "_count", "_min", "_max"],
  NestedIntFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  NestedEnumNodeTypeWithAggregatesFilter: ["equals", "in", "notIn", "not", "_count", "_min", "_max"],
  NestedEnumNodeStatusWithAggregatesFilter: ["equals", "in", "notIn", "not", "_count", "_min", "_max"]
};

type InputTypesNames = keyof typeof inputTypes;

type InputTypeFieldNames<TInput extends InputTypesNames> = Exclude<
  keyof typeof inputTypes[TInput]["prototype"],
  number | symbol
>;

type InputTypeFieldsConfig<
  TInput extends InputTypesNames
> = FieldsConfig<InputTypeFieldNames<TInput>>;

export type InputTypeConfig<TInput extends InputTypesNames> = {
  class?: ClassDecorator[];
  fields?: InputTypeFieldsConfig<TInput>;
};

export type InputTypesEnhanceMap = {
  [TInput in InputTypesNames]?: InputTypeConfig<TInput>;
};

export function applyInputTypesEnhanceMap(
  inputTypesEnhanceMap: InputTypesEnhanceMap,
) {
  for (const inputTypeEnhanceMapKey of Object.keys(inputTypesEnhanceMap)) {
    const inputTypeName = inputTypeEnhanceMapKey as keyof typeof inputTypesEnhanceMap;
    const typeConfig = inputTypesEnhanceMap[inputTypeName]!;
    const typeClass = inputTypes[inputTypeName];
    const typeTarget = typeClass.prototype;
    applyTypeClassEnhanceConfig(
      typeConfig,
      typeClass,
      typeTarget,
      inputsInfo[inputTypeName as keyof typeof inputsInfo],
    );
  }
}


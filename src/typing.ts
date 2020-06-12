import {
  RootValue as Root,
  ArgsValue as Args,
  GetGen as Get,
  NexusObjectTypeDef,
  GenTypesShapeKeys,
} from '@nexus/schema/dist/core';

export type TypeNameType = string | NexusObjectTypeDef<any>;
export type FieldNameType = string;

// Custom RootValue and ArgsValue to support new types
export type RootValue<T extends TypeNameType> = T extends string
  ? Root<T>
  : T extends NexusObjectTypeDef<infer U>
  ? Root<U>
  : any;

export type ArgsValue<
  T extends TypeNameType,
  F extends FieldNameType
> = F extends string
  ? T extends string
    ? Args<T, F>
    : T extends NexusObjectTypeDef<infer U>
    ? Args<U, F>
    : any
  : any;

// Reexported types for convinience
export type GetGen<K extends GenTypesShapeKeys, Fallback = any> = Get<
  K,
  Fallback
>;

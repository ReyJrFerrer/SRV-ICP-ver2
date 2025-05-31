import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Location {
  'latitude' : number,
  'country' : string,
  'city' : string,
  'postalCode' : string,
  'state' : string,
  'longitude' : number,
  'address' : string,
}
export type Result = { 'ok' : Service } |
  { 'err' : string };
export type Result_1 = { 'ok' : Array<Service> } |
  { 'err' : string };
export interface Service {
  'id' : string,
  'status' : ServiceStatus,
  'title' : string,
  'createdAt' : Time,
  'description' : string,
  'updatedAt' : Time,
  'category' : ServiceCategory,
  'rating' : [] | [number],
  'price' : bigint,
  'reviewCount' : bigint,
  'providerId' : Principal,
  'location' : Location,
}
export interface ServiceCategory {
  'id' : string,
  'name' : string,
  'slug' : string,
  'description' : string,
  'imageUrl' : string,
  'parentId' : [] | [string],
}
export type ServiceStatus = { 'Available' : null } |
  { 'Suspended' : null } |
  { 'Unavailable' : null };
export type Time = bigint;
export interface _SERVICE {
  'getAllCategories' : ActorMethod<[], Array<ServiceCategory>>,
  'getAllServices' : ActorMethod<[], Array<Service>>,
  'getService' : ActorMethod<[string], Result>,
  'testCreateService' : ActorMethod<[], Result>,
  'testGetServiceByProvider' : ActorMethod<[], Result_1>,
  'testSearchServicesByLocation' : ActorMethod<[], Result_1>,
  'testUpdateServiceRating' : ActorMethod<[], Result>,
  'testUpdateServiceStatus' : ActorMethod<[], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

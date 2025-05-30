import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Profile {
  'id' : Principal,
  'name' : string,
  'createdAt' : Time,
  'role' : UserRole,
  'email' : string,
  'updatedAt' : Time,
  'isVerified' : boolean,
  'phone' : string,
}
export type Result = { 'ok' : Profile } |
  { 'err' : string };
export type Time = bigint;
export type UserRole = { 'Client' : null } |
  { 'ServiceProvider' : null };
export interface _SERVICE {
  'createProfile' : ActorMethod<[string, string, string, UserRole], Result>,
  'getAllServiceProviders' : ActorMethod<[], Array<Profile>>,
  'getMyProfile' : ActorMethod<[], Result>,
  'getProfile' : ActorMethod<[Principal], Result>,
  'updateProfile' : ActorMethod<
    [[] | [string], [] | [string], [] | [string]],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

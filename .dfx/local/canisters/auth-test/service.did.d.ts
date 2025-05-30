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
export type Result_1 = { 'ok' : Array<Profile> } |
  { 'err' : string };
export type Time = bigint;
export type UserRole = { 'Client' : null } |
  { 'ServiceProvider' : null };
export interface _SERVICE {
  'getAllProfiles' : ActorMethod<[], Array<Profile>>,
  'getAllServiceProviders' : ActorMethod<[], Array<Profile>>,
  'getProfile' : ActorMethod<[Principal], Result>,
  'testCreateProfile' : ActorMethod<[], Result>,
  'testGetAllServiceProviders' : ActorMethod<[], Result_1>,
  'testInvalidEmail' : ActorMethod<[], Result>,
  'testInvalidPhone' : ActorMethod<[], Result>,
  'testUpdateProfile' : ActorMethod<[], Result>,
  'testVerifyUser' : ActorMethod<[], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

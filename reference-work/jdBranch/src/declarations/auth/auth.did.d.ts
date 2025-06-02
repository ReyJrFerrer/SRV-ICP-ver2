import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Profile {
  'id' : Principal,
  'name' : string,
  'createdAt' : Time,
  'role' : UserRole,
  'biography' : [] | [string],
  'email' : string,
  'updatedAt' : Time,
  'isVerified' : boolean,
  'phone' : string,
  'profilePicture' : [] | [ProfileImage],
}
export interface ProfileImage { 'thumbnailUrl' : string, 'imageUrl' : string }
export type Result = { 'ok' : boolean } |
  { 'err' : string };
export type Result_1 = { 'ok' : Profile } |
  { 'err' : string };
export type Result_2 = { 'ok' : string } |
  { 'err' : string };
export type Time = bigint;
export type UserRole = { 'Client' : null } |
  { 'ServiceProvider' : null };
export interface _SERVICE {
  'createProfile' : ActorMethod<[string, string, string, UserRole], Result_1>,
  'getAllServiceProviders' : ActorMethod<[], Array<Profile>>,
  'getMyProfile' : ActorMethod<[], Result_1>,
  'getProfile' : ActorMethod<[Principal], Result_1>,
  'setCanisterReferences' : ActorMethod<[[] | [Principal]], Result_2>,
  'updateProfile' : ActorMethod<
    [[] | [string], [] | [string], [] | [string]],
    Result_1
  >,
  'verifyUser' : ActorMethod<[Principal], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

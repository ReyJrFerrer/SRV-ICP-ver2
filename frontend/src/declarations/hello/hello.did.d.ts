import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'getProjectInfo' : ActorMethod<
    [],
    { 'name' : string, 'description' : string, 'version' : string }
  >,
  'getWelcomeMessage' : ActorMethod<[], string>,
  'greet' : ActorMethod<[string], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

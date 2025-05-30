import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : Review } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export type Result_2 = { 'ok' : null } |
  { 'err' : string };
export type Result_3 = { 'ok' : number } |
  { 'err' : string };
export interface Review {
  'id' : string,
  'bookingId' : string,
  'createdAt' : Time,
  'reviewerId' : Principal,
  'comment' : string,
  'updatedAt' : Time,
  'rating' : bigint,
}
export type Time = bigint;
export interface _SERVICE {
  'calculateProviderRating' : ActorMethod<[Principal], Result_3>,
  'calculateServiceRating' : ActorMethod<[string], Result_3>,
  'calculateUserAverageRating' : ActorMethod<[Principal], Result_3>,
  'deleteReview' : ActorMethod<[string], Result_2>,
  'getBookingReviews' : ActorMethod<[string], Array<Review>>,
  'getReview' : ActorMethod<[string], Result>,
  'getUserReviews' : ActorMethod<[Principal], Array<Review>>,
  'setCanisterReferences' : ActorMethod<[Principal, Principal], Result_1>,
  'submitReview' : ActorMethod<[string, bigint, string], Result>,
  'updateReview' : ActorMethod<[string, bigint, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

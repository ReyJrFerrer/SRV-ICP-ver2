import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : Review } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export type Result_2 = { 'ok' : Array<Review> } |
  { 'err' : string };
export type Result_3 = { 'ok' : null } |
  { 'err' : string };
export type Result_4 = { 'ok' : number } |
  { 'err' : string };
export interface Review {
  'id' : string,
  'status' : ReviewStatus,
  'clientId' : Principal,
  'bookingId' : string,
  'createdAt' : Time,
  'qualityScore' : [] | [number],
  'comment' : string,
  'updatedAt' : Time,
  'rating' : bigint,
  'serviceId' : string,
  'providerId' : Principal,
}
export type ReviewStatus = { 'Visible' : null } |
  { 'Hidden' : null } |
  { 'Flagged' : null };
export type Time = bigint;
export interface _SERVICE {
  'calculateProviderRating' : ActorMethod<[Principal], Result_4>,
  'calculateServiceRating' : ActorMethod<[string], Result_4>,
  'calculateUserAverageRating' : ActorMethod<[Principal], Result_4>,
  'deleteReview' : ActorMethod<[string], Result_3>,
  'getBookingReviews' : ActorMethod<[string], Result_2>,
  'getReview' : ActorMethod<[string], Result>,
  'getReviewStatistics' : ActorMethod<
    [],
    {
      'hiddenReviews' : bigint,
      'flaggedReviews' : bigint,
      'deletedReviews' : bigint,
      'totalReviews' : bigint,
      'activeReviews' : bigint,
    }
  >,
  'getUserReviews' : ActorMethod<[Principal], Array<Review>>,
  'setCanisterReferences' : ActorMethod<
    [Principal, Principal, Principal],
    Result_1
  >,
  'submitReview' : ActorMethod<[string, bigint, string], Result>,
  'updateReview' : ActorMethod<[string, bigint, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

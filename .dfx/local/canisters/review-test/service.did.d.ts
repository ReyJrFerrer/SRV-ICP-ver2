import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : Review } |
  { 'err' : string };
export type Result_1 = { 'ok' : Array<Review> } |
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
  'getAllReviews' : ActorMethod<[], Array<Review>>,
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
  'testDeleteReview' : ActorMethod<[], Result>,
  'testGetBookingReviews' : ActorMethod<[], Result_1>,
  'testGetUserReviews' : ActorMethod<[], Result_1>,
  'testInvalidComment' : ActorMethod<[], Result>,
  'testInvalidRating' : ActorMethod<[], Result>,
  'testSubmitReview' : ActorMethod<[], Result>,
  'testUpdateReview' : ActorMethod<[], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

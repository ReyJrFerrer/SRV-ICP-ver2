import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type DetectionFlag = { 'ReviewBomb' : null } |
  { 'Other' : null } |
  { 'FakeEvidence' : null } |
  { 'CompetitiveManipulation' : null } |
  { 'IdentityFraud' : null };
export interface Evidence {
  'id' : string,
  'bookingId' : string,
  'createdAt' : Time,
  'submitterId' : Principal,
  'description' : string,
  'fileUrls' : Array<string>,
  'qualityScore' : [] | [number],
}
export interface ReputationScore {
  'detectionFlags' : Array<DetectionFlag>,
  'userId' : Principal,
  'trustLevel' : TrustLevel,
  'trustScore' : number,
  'lastUpdated' : Time,
  'averageRating' : [] | [number],
  'completedBookings' : bigint,
}
export type Result = { 'ok' : ReputationScore } |
  { 'err' : string };
export type Result_1 = { 'ok' : Review } |
  { 'err' : string };
export type Result_2 = { 'ok' : Evidence } |
  { 'err' : string };
export type Result_3 = { 'ok' : boolean } |
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
export type TrustLevel = { 'Low' : null } |
  { 'New' : null } |
  { 'VeryHigh' : null } |
  { 'High' : null } |
  { 'Medium' : null };
export interface _SERVICE {
  'addDetectionFlag' : ActorMethod<[Principal, DetectionFlag], Result>,
  'detectCompetitiveManipulation' : ActorMethod<[Principal], Result_3>,
  'detectReviewBombing' : ActorMethod<[Principal], Result_3>,
  'getReputationScore' : ActorMethod<[Principal], Result>,
  'initializeReputation' : ActorMethod<[Principal, Time], Result>,
  'processEvidence' : ActorMethod<[Evidence], Result_2>,
  'processReview' : ActorMethod<[Review], Result_1>,
  'updateAverageRating' : ActorMethod<[Principal, number], Result>,
  'updateCompletedBookings' : ActorMethod<[Principal, bigint], Result>,
  'updateUserReputation' : ActorMethod<[Principal], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

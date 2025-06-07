import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type DetectionFlag = { 'ReviewBomb' : null } |
  { 'Other' : null } |
  { 'FakeEvidence' : null } |
  { 'CompetitiveManipulation' : null } |
  { 'IdentityFraud' : null };
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
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export type Result_2 = { 'ok' : Review } |
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
  'getReputationScore' : ActorMethod<[Principal], Result>,
  'getReputationStatistics' : ActorMethod<
    [],
    {
      'trustLevelDistribution' : Array<[TrustLevel, bigint]>,
      'totalUsers' : bigint,
      'averageTrustScore' : number,
    }
  >,
  'initializeReputation' : ActorMethod<[Principal, Time], Result>,
  'processReview' : ActorMethod<[Review], Result_2>,
  'setCanisterReferences' : ActorMethod<
    [Principal, Principal, Principal, Principal],
    Result_1
  >,
  'updateUserReputation' : ActorMethod<[Principal], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

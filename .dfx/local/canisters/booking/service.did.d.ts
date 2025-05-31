import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Booking {
  'id' : string,
  'completedDate' : [] | [Time],
  'status' : BookingStatus,
  'clientId' : Principal,
  'scheduledDate' : [] | [Time],
  'createdAt' : Time,
  'updatedAt' : Time,
  'evidence' : [] | [Evidence],
  'requestedDate' : Time,
  'serviceId' : string,
  'price' : bigint,
  'providerId' : Principal,
  'location' : Location,
}
export type BookingStatus = { 'Disputed' : null } |
  { 'Accepted' : null } |
  { 'Declined' : null } |
  { 'Requested' : null } |
  { 'Cancelled' : null } |
  { 'InProgress' : null } |
  { 'Completed' : null };
export interface Evidence {
  'id' : string,
  'bookingId' : string,
  'createdAt' : Time,
  'submitterId' : Principal,
  'description' : string,
  'fileUrls' : Array<string>,
  'qualityScore' : [] | [number],
}
export interface Location {
  'latitude' : number,
  'country' : string,
  'city' : string,
  'postalCode' : string,
  'state' : string,
  'longitude' : number,
  'address' : string,
}
export type Result = { 'ok' : Evidence } |
  { 'err' : string };
export type Result_1 = { 'ok' : Booking } |
  { 'err' : string };
export type Result_2 = { 'ok' : string } |
  { 'err' : string };
export type Result_3 = { 'ok' : boolean } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE {
  'acceptBooking' : ActorMethod<[string, Time], Result_1>,
  'cancelBooking' : ActorMethod<[string], Result_1>,
  'completeBooking' : ActorMethod<[string], Result_1>,
  'createBooking' : ActorMethod<
    [string, Principal, bigint, Location, Time],
    Result_1
  >,
  'declineBooking' : ActorMethod<[string], Result_1>,
  'disputeBooking' : ActorMethod<[string], Result_1>,
  'getBooking' : ActorMethod<[string], Result_1>,
  'getBookingsByDateRange' : ActorMethod<[Time, Time], Array<Booking>>,
  'getBookingsByStatus' : ActorMethod<[BookingStatus], Array<Booking>>,
  'getClientActiveBookings' : ActorMethod<[Principal], Array<Booking>>,
  'getClientBookings' : ActorMethod<[Principal], Array<Booking>>,
  'getClientCompletedBookings' : ActorMethod<[Principal], Array<Booking>>,
  'getDisputedBookings' : ActorMethod<[], Array<Booking>>,
  'getProviderActiveBookings' : ActorMethod<[Principal], Array<Booking>>,
  'getProviderBookings' : ActorMethod<[Principal], Array<Booking>>,
  'getProviderCompletedBookings' : ActorMethod<[Principal], Array<Booking>>,
  'isEligibleForReview' : ActorMethod<[string, Principal], Result_3>,
  'setCanisterReferences' : ActorMethod<
    [[] | [Principal], [] | [Principal], [] | [Principal], [] | [Principal]],
    Result_2
  >,
  'startBooking' : ActorMethod<[string], Result_1>,
  'submitEvidence' : ActorMethod<[string, string, Array<string>], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

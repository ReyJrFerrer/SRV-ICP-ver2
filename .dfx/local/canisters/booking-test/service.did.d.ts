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
export type Result_2 = { 'ok' : Array<Booking> } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE {
  'getAllBookings' : ActorMethod<[], Array<Booking>>,
  'getAllEvidences' : ActorMethod<[], Array<Evidence>>,
  'getBooking' : ActorMethod<[string], Result_1>,
  'testAcceptBooking' : ActorMethod<[], Result_1>,
  'testCompleteBooking' : ActorMethod<[], Result_1>,
  'testCreateBooking' : ActorMethod<[], Result_1>,
  'testDisputeBooking' : ActorMethod<[], Result_1>,
  'testGetClientBookings' : ActorMethod<[], Result_2>,
  'testGetProviderBookings' : ActorMethod<[], Result_2>,
  'testStartBooking' : ActorMethod<[], Result_1>,
  'testSubmitEvidence' : ActorMethod<[], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

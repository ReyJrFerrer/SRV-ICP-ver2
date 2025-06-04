import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AvailableSlot {
  'date' : Time,
  'isAvailable' : boolean,
  'conflictingBookings' : Array<string>,
  'timeSlot' : TimeSlot,
}
export interface Booking {
  'id' : string,
  'completedDate' : [] | [Time],
  'status' : BookingStatus,
  'clientId' : Principal,
  'scheduledDate' : [] | [Time],
  'createdAt' : Time,
  'servicePackageId' : [] | [string],
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
export interface DayAvailability {
  'isAvailable' : boolean,
  'slots' : Array<TimeSlot>,
}
export type DayOfWeek = { 'Saturday' : null } |
  { 'Thursday' : null } |
  { 'Sunday' : null } |
  { 'Tuesday' : null } |
  { 'Friday' : null } |
  { 'Wednesday' : null } |
  { 'Monday' : null };
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
export interface ProviderAnalytics {
  'completedJobs' : bigint,
  'endDate' : [] | [Time],
  'completionRate' : number,
  'totalJobs' : bigint,
  'packageBreakdown' : Array<[string, bigint]>,
  'cancelledJobs' : bigint,
  'totalEarnings' : bigint,
  'providerId' : Principal,
  'startDate' : [] | [Time],
}
export interface ProviderAvailability {
  'weeklySchedule' : Array<[DayOfWeek, DayAvailability]>,
  'createdAt' : Time,
  'instantBookingEnabled' : boolean,
  'isActive' : boolean,
  'maxBookingsPerDay' : bigint,
  'updatedAt' : Time,
  'bookingNoticeHours' : bigint,
  'providerId' : Principal,
}
export type Result = { 'ok' : Evidence } |
  { 'err' : string };
export type Result_1 = { 'ok' : Booking } |
  { 'err' : string };
export type Result_2 = { 'ok' : string } |
  { 'err' : string };
export type Result_3 = { 'ok' : boolean } |
  { 'err' : string };
export type Result_4 = { 'ok' : Array<AvailableSlot> } |
  { 'err' : string };
export type Result_5 = { 'ok' : ProviderAvailability } |
  { 'err' : string };
export type Result_6 = { 'ok' : ProviderAnalytics } |
  { 'err' : string };
export type Time = bigint;
export interface TimeSlot { 'startTime' : string, 'endTime' : string }
export interface _SERVICE {
  'acceptBooking' : ActorMethod<[string, Time], Result_1>,
  'cancelBooking' : ActorMethod<[string], Result_1>,
  'checkProviderAvailability' : ActorMethod<[Principal, Time], Result_3>,
  'checkServiceAvailability' : ActorMethod<[string, Time], Result_3>,
  'completeBooking' : ActorMethod<[string], Result_1>,
  'createBooking' : ActorMethod<
    [string, Principal, bigint, Location, Time, [] | [string]],
    Result_1
  >,
  'declineBooking' : ActorMethod<[string], Result_1>,
  'disputeBooking' : ActorMethod<[string], Result_1>,
  'getBooking' : ActorMethod<[string], Result_1>,
  'getBookingsByDateRange' : ActorMethod<[Time, Time], Array<Booking>>,
  'getBookingsByPackage' : ActorMethod<[string], Array<Booking>>,
  'getBookingsByStatus' : ActorMethod<[BookingStatus], Array<Booking>>,
  'getClientActiveBookings' : ActorMethod<[Principal], Array<Booking>>,
  'getClientAnalytics' : ActorMethod<
    [Principal, [] | [Time], [] | [Time]],
    Result_6
  >,
  'getClientBookings' : ActorMethod<[Principal], Array<Booking>>,
  'getClientCompletedBookings' : ActorMethod<[Principal], Array<Booking>>,
  'getDailyBookingCount' : ActorMethod<[Principal, Time], bigint>,
  'getDisputedBookings' : ActorMethod<[], Array<Booking>>,
  'getPackageAnalytics' : ActorMethod<
    [string, [] | [Time], [] | [Time]],
    Result_6
  >,
  'getProviderActiveBookings' : ActorMethod<[Principal], Array<Booking>>,
  'getProviderAnalytics' : ActorMethod<
    [Principal, [] | [Time], [] | [Time]],
    Result_6
  >,
  'getProviderAvailabilitySettings' : ActorMethod<[Principal], Result_5>,
  'getProviderAvailableSlots' : ActorMethod<[Principal, Time], Result_4>,
  'getProviderBookingConflicts' : ActorMethod<
    [Principal, Time, Time],
    Array<Booking>
  >,
  'getProviderBookings' : ActorMethod<[Principal], Array<Booking>>,
  'getProviderCompletedBookings' : ActorMethod<[Principal], Array<Booking>>,
  'getServiceAnalytics' : ActorMethod<
    [string, [] | [Time], [] | [Time]],
    Result_6
  >,
  'getServiceAvailabilitySettings' : ActorMethod<[string], Result_5>,
  'getServiceAvailableSlots' : ActorMethod<[string, Time], Result_4>,
  'getServiceBookingConflicts' : ActorMethod<
    [string, Time, Time],
    Array<Booking>
  >,
  'getServiceDailyBookingCount' : ActorMethod<[string, Time], bigint>,
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

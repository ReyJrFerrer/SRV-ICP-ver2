import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AvailableSlot {
  'date' : Time,
  'isAvailable' : boolean,
  'conflictingBookings' : Array<string>,
  'timeSlot' : TimeSlot,
}
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
export interface Location {
  'latitude' : number,
  'country' : string,
  'city' : string,
  'postalCode' : string,
  'state' : string,
  'longitude' : number,
  'address' : string,
}
export interface ProviderAvailability {
  'vacationDates' : Array<VacationPeriod>,
  'weeklySchedule' : Array<[DayOfWeek, DayAvailability]>,
  'createdAt' : Time,
  'instantBookingEnabled' : boolean,
  'isActive' : boolean,
  'maxBookingsPerDay' : bigint,
  'updatedAt' : Time,
  'bookingNoticeHours' : bigint,
  'providerId' : Principal,
}
export type Result = { 'ok' : Service } |
  { 'err' : string };
export type Result_1 = { 'ok' : ProviderAvailability } |
  { 'err' : string };
export type Result_2 = { 'ok' : string } |
  { 'err' : string };
export type Result_3 = { 'ok' : boolean } |
  { 'err' : string };
export type Result_4 = { 'ok' : Array<AvailableSlot> } |
  { 'err' : string };
export type Result_5 = { 'ok' : ServiceCategory } |
  { 'err' : string };
export interface Service {
  'id' : string,
  'status' : ServiceStatus,
  'title' : string,
  'createdAt' : Time,
  'description' : string,
  'updatedAt' : Time,
  'category' : ServiceCategory,
  'rating' : [] | [number],
  'price' : bigint,
  'reviewCount' : bigint,
  'providerId' : Principal,
  'location' : Location,
}
export interface ServiceCategory {
  'id' : string,
  'name' : string,
  'slug' : string,
  'description' : string,
  'imageUrl' : string,
  'parentId' : [] | [string],
}
export type ServiceStatus = { 'Available' : null } |
  { 'Suspended' : null } |
  { 'Unavailable' : null };
export type Time = bigint;
export interface TimeSlot { 'startTime' : string, 'endTime' : string }
export interface VacationPeriod {
  'id' : string,
  'endDate' : Time,
  'createdAt' : Time,
  'startDate' : Time,
  'reason' : [] | [string],
}
export interface _SERVICE {
  'addCategory' : ActorMethod<
    [string, string, [] | [string], string, string],
    Result_5
  >,
  'addVacationDates' : ActorMethod<[Time, Time, [] | [string]], Result_1>,
  'createService' : ActorMethod<
    [string, string, string, bigint, Location],
    Result
  >,
  'getAllCategories' : ActorMethod<[], Array<ServiceCategory>>,
  'getAvailableTimeSlots' : ActorMethod<[Principal, Time], Result_4>,
  'getProviderAvailability' : ActorMethod<[Principal], Result_1>,
  'getService' : ActorMethod<[string], Result>,
  'getServicesByCategory' : ActorMethod<[string], Array<Service>>,
  'getServicesByProvider' : ActorMethod<[Principal], Array<Service>>,
  'isProviderAvailable' : ActorMethod<[Principal, Time], Result_3>,
  'removeVacationDates' : ActorMethod<[string], Result_1>,
  'searchServicesByLocation' : ActorMethod<
    [Location, number, [] | [string]],
    Array<Service>
  >,
  'searchServicesWithReputationFilter' : ActorMethod<
    [Location, number, [] | [string], [] | [number]],
    Array<Service>
  >,
  'setCanisterReferences' : ActorMethod<
    [[] | [Principal], [] | [Principal], [] | [Principal], [] | [Principal]],
    Result_2
  >,
  'setProviderAvailability' : ActorMethod<
    [Array<[DayOfWeek, DayAvailability]>, boolean, bigint, bigint],
    Result_1
  >,
  'updateServiceRating' : ActorMethod<[string, number, bigint], Result>,
  'updateServiceStatus' : ActorMethod<[string, ServiceStatus], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

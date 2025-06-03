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
export type Result_1 = { 'ok' : ServicePackage } |
  { 'err' : string };
export type Result_2 = { 'ok' : ProviderAvailability } |
  { 'err' : string };
export type Result_3 = { 'ok' : string } |
  { 'err' : string };
export type Result_4 = { 'ok' : boolean } |
  { 'err' : string };
export type Result_5 = { 'ok' : Array<ServicePackage> } |
  { 'err' : string };
export type Result_6 = { 'ok' : Array<AvailableSlot> } |
  { 'err' : string };
export type Result_7 = { 'ok' : ServiceCategory } |
  { 'err' : string };
export interface Service {
  'id' : string,
  'status' : ServiceStatus,
  'title' : string,
  'weeklySchedule' : [] | [Array<[DayOfWeek, DayAvailability]>],
  'createdAt' : Time,
  'instantBookingEnabled' : [] | [boolean],
  'description' : string,
  'maxBookingsPerDay' : [] | [bigint],
  'updatedAt' : Time,
  'bookingNoticeHours' : [] | [bigint],
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
export interface ServicePackage {
  'id' : string,
  'title' : string,
  'createdAt' : Time,
  'description' : string,
  'updatedAt' : Time,
  'serviceId' : string,
  'price' : bigint,
}
export type ServiceStatus = { 'Available' : null } |
  { 'Suspended' : null } |
  { 'Unavailable' : null };
export type Time = bigint;
export interface TimeSlot { 'startTime' : string, 'endTime' : string }
export interface _SERVICE {
  'addCategory' : ActorMethod<
    [string, string, [] | [string], string, string],
    Result_7
  >,
  'createService' : ActorMethod<
    [
      string,
      string,
      string,
      bigint,
      Location,
      [] | [Array<[DayOfWeek, DayAvailability]>],
      [] | [boolean],
      [] | [bigint],
      [] | [bigint],
    ],
    Result
  >,
  'createServicePackage' : ActorMethod<
    [string, string, string, bigint],
    Result_1
  >,
  'deleteService' : ActorMethod<[string], Result_3>,
  'deleteServicePackage' : ActorMethod<[string], Result_3>,
  'getAllCategories' : ActorMethod<[], Array<ServiceCategory>>,
  'getAllServices' : ActorMethod<[], Array<Service>>,
  'getAvailableTimeSlots' : ActorMethod<[string, Time], Result_6>,
  'getPackage' : ActorMethod<[string], Result_1>,
  'getProviderAvailability' : ActorMethod<[Principal], Result_2>,
  'getService' : ActorMethod<[string], Result>,
  'getServiceAvailability' : ActorMethod<[string], Result_2>,
  'getServicePackages' : ActorMethod<[string], Result_5>,
  'getServicesByCategory' : ActorMethod<[string], Array<Service>>,
  'getServicesByProvider' : ActorMethod<[Principal], Array<Service>>,
  'isProviderAvailable' : ActorMethod<[Principal, Time], Result_4>,
  'isServiceAvailable' : ActorMethod<[string, Time], Result_4>,
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
    Result_3
  >,
  'setServiceAvailability' : ActorMethod<
    [string, Array<[DayOfWeek, DayAvailability]>, boolean, bigint, bigint],
    Result_2
  >,
  'updateService' : ActorMethod<
    [string, [] | [string], [] | [string], [] | [bigint]],
    Result
  >,
  'updateServicePackage' : ActorMethod<
    [string, [] | [string], [] | [string], [] | [bigint]],
    Result_1
  >,
  'updateServiceRating' : ActorMethod<[string, number, bigint], Result>,
  'updateServiceStatus' : ActorMethod<[string, ServiceStatus], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

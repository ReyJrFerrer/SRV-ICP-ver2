export const idlFactory = ({ IDL }) => {
  const ServiceCategory = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'slug' : IDL.Text,
    'description' : IDL.Text,
    'imageUrl' : IDL.Text,
    'parentId' : IDL.Opt(IDL.Text),
  });
  const Result_7 = IDL.Variant({ 'ok' : ServiceCategory, 'err' : IDL.Text });
  const Time = IDL.Int;
  const VacationPeriod = IDL.Record({
    'id' : IDL.Text,
    'endDate' : Time,
    'createdAt' : Time,
    'startDate' : Time,
    'reason' : IDL.Opt(IDL.Text),
  });
  const DayOfWeek = IDL.Variant({
    'Saturday' : IDL.Null,
    'Thursday' : IDL.Null,
    'Sunday' : IDL.Null,
    'Tuesday' : IDL.Null,
    'Friday' : IDL.Null,
    'Wednesday' : IDL.Null,
    'Monday' : IDL.Null,
  });
  const TimeSlot = IDL.Record({ 'startTime' : IDL.Text, 'endTime' : IDL.Text });
  const DayAvailability = IDL.Record({
    'isAvailable' : IDL.Bool,
    'slots' : IDL.Vec(TimeSlot),
  });
  const ProviderAvailability = IDL.Record({
    'vacationDates' : IDL.Vec(VacationPeriod),
    'weeklySchedule' : IDL.Vec(IDL.Tuple(DayOfWeek, DayAvailability)),
    'createdAt' : Time,
    'instantBookingEnabled' : IDL.Bool,
    'isActive' : IDL.Bool,
    'maxBookingsPerDay' : IDL.Nat,
    'updatedAt' : Time,
    'bookingNoticeHours' : IDL.Nat,
    'providerId' : IDL.Principal,
  });
  const Result_2 = IDL.Variant({
    'ok' : ProviderAvailability,
    'err' : IDL.Text,
  });
  const Location = IDL.Record({
    'latitude' : IDL.Float64,
    'country' : IDL.Text,
    'city' : IDL.Text,
    'postalCode' : IDL.Text,
    'state' : IDL.Text,
    'longitude' : IDL.Float64,
    'address' : IDL.Text,
  });
  const ServiceStatus = IDL.Variant({
    'Available' : IDL.Null,
    'Suspended' : IDL.Null,
    'Unavailable' : IDL.Null,
  });
  const Service = IDL.Record({
    'id' : IDL.Text,
    'status' : ServiceStatus,
    'title' : IDL.Text,
    'weeklySchedule' : IDL.Opt(IDL.Vec(IDL.Tuple(DayOfWeek, DayAvailability))),
    'createdAt' : Time,
    'instantBookingEnabled' : IDL.Opt(IDL.Bool),
    'description' : IDL.Text,
    'maxBookingsPerDay' : IDL.Opt(IDL.Nat),
    'updatedAt' : Time,
    'bookingNoticeHours' : IDL.Opt(IDL.Nat),
    'category' : ServiceCategory,
    'rating' : IDL.Opt(IDL.Float64),
    'price' : IDL.Nat,
    'reviewCount' : IDL.Nat,
    'providerId' : IDL.Principal,
    'location' : Location,
  });
  const Result = IDL.Variant({ 'ok' : Service, 'err' : IDL.Text });
  const ServicePackage = IDL.Record({
    'id' : IDL.Text,
    'title' : IDL.Text,
    'createdAt' : Time,
    'description' : IDL.Text,
    'updatedAt' : Time,
    'serviceId' : IDL.Text,
    'price' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({ 'ok' : ServicePackage, 'err' : IDL.Text });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const AvailableSlot = IDL.Record({
    'date' : Time,
    'isAvailable' : IDL.Bool,
    'conflictingBookings' : IDL.Vec(IDL.Text),
    'timeSlot' : TimeSlot,
  });
  const Result_6 = IDL.Variant({
    'ok' : IDL.Vec(AvailableSlot),
    'err' : IDL.Text,
  });
  const Result_5 = IDL.Variant({
    'ok' : IDL.Vec(ServicePackage),
    'err' : IDL.Text,
  });
  const Result_4 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  return IDL.Service({
    'addCategory' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Opt(IDL.Text), IDL.Text, IDL.Text],
        [Result_7],
        [],
      ),
    'addVacationDates' : IDL.Func(
        [Time, Time, IDL.Opt(IDL.Text)],
        [Result_2],
        [],
      ),
    'createService' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Nat,
          Location,
          IDL.Opt(IDL.Vec(IDL.Tuple(DayOfWeek, DayAvailability))),
          IDL.Opt(IDL.Bool),
          IDL.Opt(IDL.Nat),
          IDL.Opt(IDL.Nat),
        ],
        [Result],
        [],
      ),
    'createServicePackage' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Nat],
        [Result_1],
        [],
      ),
    'deleteServicePackage' : IDL.Func([IDL.Text], [Result_3], []),
    'getAllCategories' : IDL.Func([], [IDL.Vec(ServiceCategory)], ['query']),
    'getAllServices' : IDL.Func([], [IDL.Vec(Service)], ['query']),
    'getAvailableTimeSlots' : IDL.Func([IDL.Principal, Time], [Result_6], []),
    'getPackage' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'getProviderAvailability' : IDL.Func(
        [IDL.Principal],
        [Result_2],
        ['query'],
      ),
    'getService' : IDL.Func([IDL.Text], [Result], ['query']),
    'getServicePackages' : IDL.Func([IDL.Text], [Result_5], ['query']),
    'getServicesByCategory' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Service)],
        ['query'],
      ),
    'getServicesByProvider' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Service)],
        ['query'],
      ),
    'isProviderAvailable' : IDL.Func([IDL.Principal, Time], [Result_4], []),
    'removeVacationDates' : IDL.Func([IDL.Text], [Result_2], []),
    'searchServicesByLocation' : IDL.Func(
        [Location, IDL.Float64, IDL.Opt(IDL.Text)],
        [IDL.Vec(Service)],
        ['query'],
      ),
    'searchServicesWithReputationFilter' : IDL.Func(
        [Location, IDL.Float64, IDL.Opt(IDL.Text), IDL.Opt(IDL.Float64)],
        [IDL.Vec(Service)],
        [],
      ),
    'setCanisterReferences' : IDL.Func(
        [
          IDL.Opt(IDL.Principal),
          IDL.Opt(IDL.Principal),
          IDL.Opt(IDL.Principal),
          IDL.Opt(IDL.Principal),
        ],
        [Result_3],
        [],
      ),
    'setProviderAvailability' : IDL.Func(
        [
          IDL.Vec(IDL.Tuple(DayOfWeek, DayAvailability)),
          IDL.Bool,
          IDL.Nat,
          IDL.Nat,
        ],
        [Result_2],
        [],
      ),
    'updateServicePackage' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Nat)],
        [Result_1],
        [],
      ),
    'updateServiceRating' : IDL.Func(
        [IDL.Text, IDL.Float64, IDL.Nat],
        [Result],
        [],
      ),
    'updateServiceStatus' : IDL.Func([IDL.Text, ServiceStatus], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };

export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const BookingStatus = IDL.Variant({
    'Disputed' : IDL.Null,
    'Accepted' : IDL.Null,
    'Declined' : IDL.Null,
    'Requested' : IDL.Null,
    'Cancelled' : IDL.Null,
    'InProgress' : IDL.Null,
    'Completed' : IDL.Null,
  });
  const Evidence = IDL.Record({
    'id' : IDL.Text,
    'bookingId' : IDL.Text,
    'createdAt' : Time,
    'submitterId' : IDL.Principal,
    'description' : IDL.Text,
    'fileUrls' : IDL.Vec(IDL.Text),
    'qualityScore' : IDL.Opt(IDL.Float64),
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
  const Booking = IDL.Record({
    'id' : IDL.Text,
    'completedDate' : IDL.Opt(Time),
    'status' : BookingStatus,
    'clientId' : IDL.Principal,
    'scheduledDate' : IDL.Opt(Time),
    'createdAt' : Time,
    'servicePackageId' : IDL.Opt(IDL.Text),
    'updatedAt' : Time,
    'evidence' : IDL.Opt(Evidence),
    'requestedDate' : Time,
    'serviceId' : IDL.Text,
    'price' : IDL.Nat,
    'providerId' : IDL.Principal,
    'location' : Location,
  });
  const Result_1 = IDL.Variant({ 'ok' : Booking, 'err' : IDL.Text });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const ProviderAnalytics = IDL.Record({
    'completedJobs' : IDL.Nat,
    'endDate' : IDL.Opt(Time),
    'completionRate' : IDL.Float64,
    'totalJobs' : IDL.Nat,
    'packageBreakdown' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
    'cancelledJobs' : IDL.Nat,
    'totalEarnings' : IDL.Nat,
    'providerId' : IDL.Principal,
    'startDate' : IDL.Opt(Time),
  });
  const Result_6 = IDL.Variant({ 'ok' : ProviderAnalytics, 'err' : IDL.Text });
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
    'weeklySchedule' : IDL.Vec(IDL.Tuple(DayOfWeek, DayAvailability)),
    'createdAt' : Time,
    'instantBookingEnabled' : IDL.Bool,
    'isActive' : IDL.Bool,
    'maxBookingsPerDay' : IDL.Nat,
    'updatedAt' : Time,
    'bookingNoticeHours' : IDL.Nat,
    'providerId' : IDL.Principal,
  });
  const Result_5 = IDL.Variant({
    'ok' : ProviderAvailability,
    'err' : IDL.Text,
  });
  const AvailableSlot = IDL.Record({
    'date' : Time,
    'isAvailable' : IDL.Bool,
    'conflictingBookings' : IDL.Vec(IDL.Text),
    'timeSlot' : TimeSlot,
  });
  const Result_4 = IDL.Variant({
    'ok' : IDL.Vec(AvailableSlot),
    'err' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : Evidence, 'err' : IDL.Text });
  return IDL.Service({
    'acceptBooking' : IDL.Func([IDL.Text, Time], [Result_1], []),
    'cancelBooking' : IDL.Func([IDL.Text], [Result_1], []),
    'checkProviderAvailability' : IDL.Func(
        [IDL.Principal, Time],
        [Result_3],
        [],
      ),
    'checkServiceAvailability' : IDL.Func([IDL.Text, Time], [Result_3], []),
    'completeBooking' : IDL.Func([IDL.Text], [Result_1], []),
    'createBooking' : IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Nat, Location, Time, IDL.Opt(IDL.Text)],
        [Result_1],
        [],
      ),
    'declineBooking' : IDL.Func([IDL.Text], [Result_1], []),
    'disputeBooking' : IDL.Func([IDL.Text], [Result_1], []),
    'getBooking' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'getBookingsByDateRange' : IDL.Func(
        [Time, Time],
        [IDL.Vec(Booking)],
        ['query'],
      ),
    'getBookingsByPackage' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Booking)],
        ['query'],
      ),
    'getBookingsByStatus' : IDL.Func(
        [BookingStatus],
        [IDL.Vec(Booking)],
        ['query'],
      ),
    'getClientActiveBookings' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Booking)],
        ['query'],
      ),
    'getClientAnalytics' : IDL.Func(
        [IDL.Principal, IDL.Opt(Time), IDL.Opt(Time)],
        [Result_6],
        [],
      ),
    'getClientBookings' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Booking)],
        ['query'],
      ),
    'getClientCompletedBookings' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Booking)],
        ['query'],
      ),
    'getDailyBookingCount' : IDL.Func(
        [IDL.Principal, Time],
        [IDL.Nat],
        ['query'],
      ),
    'getDisputedBookings' : IDL.Func([], [IDL.Vec(Booking)], ['query']),
    'getPackageAnalytics' : IDL.Func(
        [IDL.Text, IDL.Opt(Time), IDL.Opt(Time)],
        [Result_6],
        [],
      ),
    'getProviderActiveBookings' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Booking)],
        ['query'],
      ),
    'getProviderAnalytics' : IDL.Func(
        [IDL.Principal, IDL.Opt(Time), IDL.Opt(Time)],
        [Result_6],
        [],
      ),
    'getProviderAvailabilitySettings' : IDL.Func(
        [IDL.Principal],
        [Result_5],
        [],
      ),
    'getProviderAvailableSlots' : IDL.Func(
        [IDL.Principal, Time],
        [Result_4],
        [],
      ),
    'getProviderBookingConflicts' : IDL.Func(
        [IDL.Principal, Time, Time],
        [IDL.Vec(Booking)],
        [],
      ),
    'getProviderBookings' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Booking)],
        ['query'],
      ),
    'getProviderCompletedBookings' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Booking)],
        ['query'],
      ),
    'getServiceAnalytics' : IDL.Func(
        [IDL.Text, IDL.Opt(Time), IDL.Opt(Time)],
        [Result_6],
        [],
      ),
    'getServiceAvailabilitySettings' : IDL.Func([IDL.Text], [Result_5], []),
    'getServiceAvailableSlots' : IDL.Func([IDL.Text, Time], [Result_4], []),
    'getServiceBookingConflicts' : IDL.Func(
        [IDL.Text, Time, Time],
        [IDL.Vec(Booking)],
        [],
      ),
    'getServiceDailyBookingCount' : IDL.Func(
        [IDL.Text, Time],
        [IDL.Nat],
        ['query'],
      ),
    'isEligibleForReview' : IDL.Func(
        [IDL.Text, IDL.Principal],
        [Result_3],
        ['query'],
      ),
    'setCanisterReferences' : IDL.Func(
        [
          IDL.Opt(IDL.Principal),
          IDL.Opt(IDL.Principal),
          IDL.Opt(IDL.Principal),
          IDL.Opt(IDL.Principal),
        ],
        [Result_2],
        [],
      ),
    'startBooking' : IDL.Func([IDL.Text], [Result_1], []),
    'submitEvidence' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Vec(IDL.Text)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };

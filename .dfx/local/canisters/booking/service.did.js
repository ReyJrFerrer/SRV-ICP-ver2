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
    'updatedAt' : Time,
    'evidence' : IDL.Opt(Evidence),
    'requestedDate' : Time,
    'serviceId' : IDL.Text,
    'price' : IDL.Nat,
    'providerId' : IDL.Principal,
    'location' : Location,
  });
  const Result_1 = IDL.Variant({ 'ok' : Booking, 'err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : Evidence, 'err' : IDL.Text });
  return IDL.Service({
    'acceptBooking' : IDL.Func([IDL.Text, Time], [Result_1], []),
    'cancelBooking' : IDL.Func([IDL.Text], [Result_1], []),
    'completeBooking' : IDL.Func([IDL.Text], [Result_1], []),
    'createBooking' : IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Nat, Location, Time],
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
    'getDisputedBookings' : IDL.Func([], [IDL.Vec(Booking)], ['query']),
    'getProviderActiveBookings' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Booking)],
        ['query'],
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
    'isEligibleForReview' : IDL.Func(
        [IDL.Text, IDL.Principal],
        [Result_2],
        ['query'],
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

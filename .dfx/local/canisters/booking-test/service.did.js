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
  const Result_2 = IDL.Variant({ 'ok' : IDL.Vec(Booking), 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : Evidence, 'err' : IDL.Text });
  return IDL.Service({
    'getAllBookings' : IDL.Func([], [IDL.Vec(Booking)], ['query']),
    'getAllEvidences' : IDL.Func([], [IDL.Vec(Evidence)], ['query']),
    'getBooking' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'testAcceptBooking' : IDL.Func([], [Result_1], []),
    'testCompleteBooking' : IDL.Func([], [Result_1], []),
    'testCreateBooking' : IDL.Func([], [Result_1], []),
    'testDisputeBooking' : IDL.Func([], [Result_1], []),
    'testGetClientBookings' : IDL.Func([], [Result_2], []),
    'testGetProviderBookings' : IDL.Func([], [Result_2], []),
    'testStartBooking' : IDL.Func([], [Result_1], []),
    'testSubmitEvidence' : IDL.Func([], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };

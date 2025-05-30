export const idlFactory = ({ IDL }) => {
  const Result_3 = IDL.Variant({ 'ok' : IDL.Float64, 'err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Time = IDL.Int;
  const Review = IDL.Record({
    'id' : IDL.Text,
    'bookingId' : IDL.Text,
    'createdAt' : Time,
    'reviewerId' : IDL.Principal,
    'comment' : IDL.Text,
    'updatedAt' : Time,
    'rating' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'ok' : Review, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'calculateProviderRating' : IDL.Func(
        [IDL.Principal],
        [Result_3],
        ['query'],
      ),
    'calculateServiceRating' : IDL.Func([IDL.Text], [Result_3], ['query']),
    'calculateUserAverageRating' : IDL.Func(
        [IDL.Principal],
        [Result_3],
        ['query'],
      ),
    'deleteReview' : IDL.Func([IDL.Text], [Result_2], []),
    'getBookingReviews' : IDL.Func([IDL.Text], [IDL.Vec(Review)], ['query']),
    'getReview' : IDL.Func([IDL.Text], [Result], ['query']),
    'getUserReviews' : IDL.Func([IDL.Principal], [IDL.Vec(Review)], ['query']),
    'setCanisterReferences' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [Result_1],
        [],
      ),
    'submitReview' : IDL.Func([IDL.Text, IDL.Nat, IDL.Text], [Result], []),
    'updateReview' : IDL.Func([IDL.Text, IDL.Nat, IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };

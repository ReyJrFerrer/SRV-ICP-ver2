export const idlFactory = ({ IDL }) => {
  const Result_4 = IDL.Variant({ 'ok' : IDL.Float64, 'err' : IDL.Text });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const ReviewStatus = IDL.Variant({
    'Visible' : IDL.Null,
    'Hidden' : IDL.Null,
    'Flagged' : IDL.Null,
  });
  const Time = IDL.Int;
  const Review = IDL.Record({
    'id' : IDL.Text,
    'status' : ReviewStatus,
    'clientId' : IDL.Principal,
    'bookingId' : IDL.Text,
    'createdAt' : Time,
    'qualityScore' : IDL.Opt(IDL.Float64),
    'comment' : IDL.Text,
    'updatedAt' : Time,
    'rating' : IDL.Nat,
    'serviceId' : IDL.Text,
    'providerId' : IDL.Principal,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Vec(Review), 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : Review, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'calculateProviderRating' : IDL.Func(
        [IDL.Principal],
        [Result_4],
        ['query'],
      ),
    'calculateServiceRating' : IDL.Func([IDL.Text], [Result_4], ['query']),
    'calculateUserAverageRating' : IDL.Func(
        [IDL.Principal],
        [Result_4],
        ['query'],
      ),
    'deleteReview' : IDL.Func([IDL.Text], [Result_3], []),
    'getBookingReviews' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'getReview' : IDL.Func([IDL.Text], [Result], ['query']),
    'getReviewStatistics' : IDL.Func(
        [],
        [
          IDL.Record({
            'hiddenReviews' : IDL.Nat,
            'flaggedReviews' : IDL.Nat,
            'deletedReviews' : IDL.Nat,
            'totalReviews' : IDL.Nat,
            'activeReviews' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getUserReviews' : IDL.Func([IDL.Principal], [IDL.Vec(Review)], ['query']),
    'setCanisterReferences' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Principal],
        [Result_1],
        [],
      ),
    'submitReview' : IDL.Func([IDL.Text, IDL.Nat, IDL.Text], [Result], []),
    'updateReview' : IDL.Func([IDL.Text, IDL.Nat, IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };

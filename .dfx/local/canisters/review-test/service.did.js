export const idlFactory = ({ IDL }) => {
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
  const Result = IDL.Variant({ 'ok' : Review, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Vec(Review), 'err' : IDL.Text });
  return IDL.Service({
    'getAllReviews' : IDL.Func([], [IDL.Vec(Review)], ['query']),
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
    'testDeleteReview' : IDL.Func([], [Result], []),
    'testGetBookingReviews' : IDL.Func([], [Result_1], []),
    'testGetUserReviews' : IDL.Func([], [Result_1], []),
    'testInvalidComment' : IDL.Func([], [Result], []),
    'testInvalidRating' : IDL.Func([], [Result], []),
    'testSubmitReview' : IDL.Func([], [Result], []),
    'testUpdateReview' : IDL.Func([], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };

export const idlFactory = ({ IDL }) => {
  const DetectionFlag = IDL.Variant({
    'ReviewBomb' : IDL.Null,
    'Other' : IDL.Null,
    'FakeEvidence' : IDL.Null,
    'CompetitiveManipulation' : IDL.Null,
    'IdentityFraud' : IDL.Null,
  });
  const TrustLevel = IDL.Variant({
    'Low' : IDL.Null,
    'New' : IDL.Null,
    'VeryHigh' : IDL.Null,
    'High' : IDL.Null,
    'Medium' : IDL.Null,
  });
  const Time = IDL.Int;
  const ReputationScore = IDL.Record({
    'detectionFlags' : IDL.Vec(DetectionFlag),
    'userId' : IDL.Principal,
    'trustLevel' : TrustLevel,
    'trustScore' : IDL.Float64,
    'lastUpdated' : Time,
    'averageRating' : IDL.Opt(IDL.Float64),
    'completedBookings' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'ok' : ReputationScore, 'err' : IDL.Text });
  const ReviewStatus = IDL.Variant({
    'Visible' : IDL.Null,
    'Hidden' : IDL.Null,
    'Flagged' : IDL.Null,
  });
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
  const Result_2 = IDL.Variant({ 'ok' : Review, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'getReputationScore' : IDL.Func([IDL.Principal], [Result], ['query']),
    'getReputationStatistics' : IDL.Func(
        [],
        [
          IDL.Record({
            'trustLevelDistribution' : IDL.Vec(IDL.Tuple(TrustLevel, IDL.Nat)),
            'totalUsers' : IDL.Nat,
            'averageTrustScore' : IDL.Float64,
          }),
        ],
        ['query'],
      ),
    'initializeReputation' : IDL.Func([IDL.Principal, Time], [Result], []),
    'processReview' : IDL.Func([Review], [Result_2], []),
    'setCanisterReferences' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Principal, IDL.Principal],
        [Result_1],
        [],
      ),
    'updateUserReputation' : IDL.Func([IDL.Principal], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };

export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Result_3 = IDL.Variant({
    'ok' : IDL.Vec(IDL.Tuple(Time, IDL.Float64)),
    'err' : IDL.Text,
  });
  const TrustLevel = IDL.Variant({
    'Low' : IDL.Null,
    'New' : IDL.Null,
    'VeryHigh' : IDL.Null,
    'High' : IDL.Null,
    'Medium' : IDL.Null,
  });
  const DetectionFlag = IDL.Variant({
    'ReviewBomb' : IDL.Null,
    'Other' : IDL.Null,
    'FakeEvidence' : IDL.Null,
    'CompetitiveManipulation' : IDL.Null,
    'IdentityFraud' : IDL.Null,
  });
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
  const Evidence = IDL.Record({
    'id' : IDL.Text,
    'bookingId' : IDL.Text,
    'createdAt' : Time,
    'submitterId' : IDL.Principal,
    'description' : IDL.Text,
    'fileUrls' : IDL.Vec(IDL.Text),
    'qualityScore' : IDL.Opt(IDL.Float64),
  });
  const Result_2 = IDL.Variant({ 'ok' : Evidence, 'err' : IDL.Text });
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
  const Result_1 = IDL.Variant({ 'ok' : Review, 'err' : IDL.Text });
  return IDL.Service({
    'getReputationHistory' : IDL.Func([IDL.Principal], [Result_3], ['query']),
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
    'testAddDetectionFlag' : IDL.Func([], [Result], []),
    'testInitializeReputation' : IDL.Func([], [Result], []),
    'testProcessEvidence' : IDL.Func([], [Result_2], []),
    'testProcessReview' : IDL.Func([], [Result_1], []),
    'testUpdateTrustScore' : IDL.Func([], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };

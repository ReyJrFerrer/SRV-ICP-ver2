export const idlFactory = ({ IDL }) => {
  const UserRole = IDL.Variant({
    'Client' : IDL.Null,
    'ServiceProvider' : IDL.Null,
  });
  const Time = IDL.Int;
  const Profile = IDL.Record({
    'id' : IDL.Principal,
    'name' : IDL.Text,
    'createdAt' : Time,
    'role' : UserRole,
    'email' : IDL.Text,
    'updatedAt' : Time,
    'isVerified' : IDL.Bool,
    'phone' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : Profile, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  return IDL.Service({
    'createProfile' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, UserRole],
        [Result_1],
        [],
      ),
    'getAllServiceProviders' : IDL.Func([], [IDL.Vec(Profile)], ['query']),
    'getMyProfile' : IDL.Func([], [Result_1], ['query']),
    'getProfile' : IDL.Func([IDL.Principal], [Result_1], ['query']),
    'updateProfile' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [Result_1],
        [],
      ),
    'verifyUser' : IDL.Func([IDL.Principal], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };

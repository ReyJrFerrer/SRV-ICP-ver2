export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const UserRole = IDL.Variant({
    'Client' : IDL.Null,
    'ServiceProvider' : IDL.Null,
  });
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
  const Result = IDL.Variant({ 'ok' : Profile, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Vec(Profile), 'err' : IDL.Text });
  return IDL.Service({
    'getAllProfiles' : IDL.Func([], [IDL.Vec(Profile)], ['query']),
    'getAllServiceProviders' : IDL.Func([], [IDL.Vec(Profile)], ['query']),
    'getProfile' : IDL.Func([IDL.Principal], [Result], ['query']),
    'testCreateProfile' : IDL.Func([], [Result], []),
    'testGetAllServiceProviders' : IDL.Func([], [Result_1], []),
    'testInvalidEmail' : IDL.Func([], [Result], []),
    'testInvalidPhone' : IDL.Func([], [Result], []),
    'testUpdateProfile' : IDL.Func([], [Result], []),
    'testVerifyUser' : IDL.Func([], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };

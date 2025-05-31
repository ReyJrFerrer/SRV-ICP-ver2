export const idlFactory = ({ IDL }) => {
  const ServiceCategory = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'slug' : IDL.Text,
    'description' : IDL.Text,
    'imageUrl' : IDL.Text,
    'parentId' : IDL.Opt(IDL.Text),
  });
  const ServiceStatus = IDL.Variant({
    'Available' : IDL.Null,
    'Suspended' : IDL.Null,
    'Unavailable' : IDL.Null,
  });
  const Time = IDL.Int;
  const Location = IDL.Record({
    'latitude' : IDL.Float64,
    'country' : IDL.Text,
    'city' : IDL.Text,
    'postalCode' : IDL.Text,
    'state' : IDL.Text,
    'longitude' : IDL.Float64,
    'address' : IDL.Text,
  });
  const Service = IDL.Record({
    'id' : IDL.Text,
    'status' : ServiceStatus,
    'title' : IDL.Text,
    'createdAt' : Time,
    'description' : IDL.Text,
    'updatedAt' : Time,
    'category' : ServiceCategory,
    'rating' : IDL.Opt(IDL.Float64),
    'price' : IDL.Nat,
    'reviewCount' : IDL.Nat,
    'providerId' : IDL.Principal,
    'location' : Location,
  });
  const Result = IDL.Variant({ 'ok' : Service, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Vec(Service), 'err' : IDL.Text });
  return IDL.Service({
    'getAllCategories' : IDL.Func([], [IDL.Vec(ServiceCategory)], ['query']),
    'getAllServices' : IDL.Func([], [IDL.Vec(Service)], ['query']),
    'getService' : IDL.Func([IDL.Text], [Result], ['query']),
    'testCreateService' : IDL.Func([], [Result], []),
    'testGetServiceByProvider' : IDL.Func([], [Result_1], []),
    'testSearchServicesByLocation' : IDL.Func([], [Result_1], []),
    'testUpdateServiceRating' : IDL.Func([], [Result], []),
    'testUpdateServiceStatus' : IDL.Func([], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };

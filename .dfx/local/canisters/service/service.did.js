export const idlFactory = ({ IDL }) => {
  const Location = IDL.Record({
    'latitude' : IDL.Float64,
    'country' : IDL.Text,
    'city' : IDL.Text,
    'postalCode' : IDL.Text,
    'state' : IDL.Text,
    'longitude' : IDL.Float64,
    'address' : IDL.Text,
  });
  const ServiceStatus = IDL.Variant({
    'Available' : IDL.Null,
    'Suspended' : IDL.Null,
    'Unavailable' : IDL.Null,
  });
  const Time = IDL.Int;
  const ServiceCategory = IDL.Record({
    'id' : IDL.Text,
    'name' : IDL.Text,
    'slug' : IDL.Text,
    'description' : IDL.Text,
    'parentId' : IDL.Opt(IDL.Text),
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
  return IDL.Service({
    'createService' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Nat, Location],
        [Result],
        [],
      ),
    'getAllCategories' : IDL.Func([], [IDL.Vec(ServiceCategory)], ['query']),
    'getService' : IDL.Func([IDL.Text], [Result], ['query']),
    'getServicesByCategory' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Service)],
        ['query'],
      ),
    'getServicesByProvider' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Service)],
        ['query'],
      ),
    'searchServicesByLocation' : IDL.Func(
        [Location, IDL.Float64, IDL.Opt(IDL.Text)],
        [IDL.Vec(Service)],
        ['query'],
      ),
    'updateServiceRating' : IDL.Func(
        [IDL.Text, IDL.Float64, IDL.Nat],
        [Result],
        [],
      ),
    'updateServiceStatus' : IDL.Func([IDL.Text, ServiceStatus], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };

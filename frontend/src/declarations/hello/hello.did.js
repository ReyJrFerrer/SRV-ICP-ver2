export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getProjectInfo' : IDL.Func(
        [],
        [
          IDL.Record({
            'name' : IDL.Text,
            'description' : IDL.Text,
            'version' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'getWelcomeMessage' : IDL.Func([], [IDL.Text], ['query']),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };

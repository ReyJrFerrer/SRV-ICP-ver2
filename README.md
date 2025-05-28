

```bash

#Steps to do to run the project with ICP
- npm install
- create env file in frontend 
cp frontend/.env-example frontend/.env

- start ICP local 
dfx start --background --clean

- Get your canister ids:
# Create canisters
dfx canister create --all

# Get backend canister id
dfx canister id test

# Get internet-identity canister id
dfx canister id internet-identity
```

Replace values in the .env file:

```bash
# Replace port if needed
NEXT_PUBLIC_IC_HOST_URL=http://localhost:4943
# Replace YOUR_TEST_CANISTER_ID with your test canister id
NEXT_PUBLIC_TEST_CANISTER_ID=YOUR_TEST_CANISTER_ID
# Replace YOUR_INTERNET_IDENTITY_CANISTER_ID with your internet-identity canister id
NEXT_PUBLIC_INTERNET_IDENTITY_URL=http://YOUR_INTERNET_IDENTITY_CANISTER_ID.localhost:4943
```

Generate did files:

```bash
dfx generate test
```

Then, navitate to `frontend` folder:

`cd frontend`

Run the following script:

`npm run dev`

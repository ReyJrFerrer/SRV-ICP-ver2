```bash

# Install npm into the project
- npm install

# create env file in frontend 
cp frontend/.env-example frontend/.env

#start ICP local 
dfx start --background --clean

# Create canisters to get the id's
dfx canister create --all

# Stay as is
NEXT_PUBLIC_IC_HOST_URL=http://localhost:4943

# Replace the necesseary canister ids
NEXT_PUBLIC_AUTH_CANISTER_ID=YOUR_TEST_CANISTER_ID
NEXT_PUBLIC_SERVICE_CANISTER_ID=ufxgi-4p777-77774-qaadq-cai
NEXT_PUBLIC_BOOKING_CANISTER_ID=uzt4z-lp777-77774-qaabq-cai
NEXT_PUBLIC_REVIEW_CANISTER_ID=ucwa4-rx777-77774-qaada-cai
NEXT_PUBLIC_REPUTATION_CANISTER_ID= umunu-kh777-77774-qaaca-cai

# Replace YOUR_INTERNET_IDENTITY_CANISTER_ID with your internet-identity canister id
NEXT_PUBLIC_INTERNET_IDENTITY_URL=http://YOUR_INTERNET_IDENTITY_CANISTER_ID.localhost:4943

#deploy the canisters
dfx deploy

# generate the canisters
dfx generate auth
dfx generate service
dfx generate booking
dfx generate review
dfx generate reputation

# Then, navigate to frontend folder:
cd frontend

# Run the following script:

npm run dev

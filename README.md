```bash

# Make sure to install Node Js in your pc
# Also install WSL to access the npm commands
# Access WSL in your VSCode Terminal and to the following:

# Install npm into the project
- npm install

# create env file in frontend (Copy the command)
cp frontend/.env-example frontend/.env

#start ICP local 
dfx start --background --clean

# Create canisters to get the id's
dfx canister create --all

# Stay as is
NEXT_PUBLIC_IC_HOST_URL=http://localhost:4943

# Replace the necesseary canister ids
NEXT_PUBLIC_AUTH_CANISTER_ID=YOUR_TEST_CANISTER_ID
NEXT_PUBLIC_SERVICE_CANISTER_ID=YOUR_SERVICE_CANISTER_ID
NEXT_PUBLIC_BOOKING_CANISTER_ID=YOUR_BOOKING_CANISTER_ID
NEXT_PUBLIC_REVIEW_CANISTER_ID=YOUR_REVIEW_CANISTER_ID
NEXT_PUBLIC_REPUTATION_CANISTER_ID=YOUR_REPUTATION_CANISTER_ID

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

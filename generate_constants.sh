cd server
. ./run.sh --install -gc
cd ..
mkdir -p ./client/generated
mv ./server/backend_constants.json ./client/generated/backend_constants.json
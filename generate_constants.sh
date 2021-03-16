cd server
echo "here1"
sh run.sh --install -gc
echo "here2"
cd ..
mkdir -p ./client/generated
mv ./server/backend_constants.json ./client/generated/backend_constants.json
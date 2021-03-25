# Copy the requirements from the server file
cp ./server/requirements.txt ./requirements.txt

# Install the requirements into the python environment
python3 -m pip install -r requirements.txt

# Setup gfortran
sudo apt-get install gfortran-8
mkdir -p gfortran-symlinks
ln -s /usr/bin/gfortran-8 gfortran-symlinks/gfortran
export PATH=$PWD/gfortran-symlinks:$PATH
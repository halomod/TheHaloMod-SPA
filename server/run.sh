python3 -m venv env
source env/bin/activate
python3 -m pip install -r requirements.txt

for arg in "$@"
do
    case $arg in
        "--lint" )
<<<<<<< HEAD
          flake8 halomod_app;;
        "--test" )
          python -m pytest;;
        "--dev" )
          export FLASK_APP=halomod_app
=======
          flake8 halomod;;
        "--test" )
          python -m pytest;;
        "--dev" )
          export FLASK_APP=halomod
>>>>>>> 7923066d6e8465b05dbffe72a21097024bb6f460
          export FLASK_ENV=development
          flask run;;
   esac
done

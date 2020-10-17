python3 -m venv env
source env/bin/activate
python3 -m pip install -r requirements.txt

for arg in "$@"
do
    case $arg in
        "--lint" )
          flake8 halomod_app;;
        "--test" )
          python -m pytest;;
        "--dev" )
          export FLASK_APP=halomod_app
          export FLASK_ENV=development
          flask run;;
   esac
done

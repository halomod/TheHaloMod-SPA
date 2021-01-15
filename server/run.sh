for arg in "$@"
do 
  case $arg in
    "--ci" )
      python3 -m pip install -r requirements.txt;;
    *)
      python3 -m venv env
      . env/bin/activate
      python3 -m pip install -r requirements.txt;;
  esac
done

for arg in "$@"
do
    case $arg in
        "--lint" )
          flake8 tests halomod_app;;
        "--test" )
          python -m pytest;;
        "--dev" )
          export FLASK_APP=halomod_app
          export FLASK_ENV=development
          flask run;;
   esac
done

import sys
import getopt
import subprocess
import os


def printHelp():
    print("USAGE: dockerStart.py [OPTIONS]\n" +
          "  Running dockerStart.py with no options is equivalent to:\n" +
          "  dockerStart.py -b --port=5000 --url=0.0.0.0\n\nOptions:" +
          "     -h, --help       Show this command list\n" +
          "(Turns on debug mode for Flask, and installs pytest)\n" +
          "     -p, --prod       For production (Enables nginx)\n" +
          "     -b, --base       Base install (No nginx, no pytest, yes debug mode)\n" +
          "     --port=[port]    Set the port for Flask\n" +
          "     --url=[url]      Set the url for Flask\n")

def main(argv):
    #static
    ENV_PROD = "./settings/prod.env"
    ENV_BASE = "./settings/base.env"

    # Default values
    ENV_FILE = ENV_BASE
    FLASK_URL = "127.0.0.1"
    FLASK_PORT = "5000"

    try:
        opts, args = getopt.getopt(
            argv, "hdpb", ["help", "prod", "port=", "url="])
    except getopt.GetoptError:
        print("Not a valid command\nUse 'dockerStart.py -h' for available commands")
        sys.exit(2)
    for opt, arg in opts:
        if opt in ('-h', "--help"):
            printHelp()
            sys.exit()
        elif opt in ("-p", "--prod"):
            ENV_FILE = ENV_PROD
        elif opt in ("-b", "--base"):
            ENV_FILE = ENV_BASE
        elif opt in "--port":
            FLASK_PORT = arg
        elif opt in "--url":
            FLASK_URL = arg
        else:
            printHelp()
            sys.exit()
    # set env vars before calling docker-compose
    my_env = os.environ.copy()
    my_env['FLASK_RUN_HOST'] = FLASK_URL
    my_env['FLASK_RUN_PORT'] = FLASK_PORT
    my_env['ENV_FILE'] = ENV_FILE
    cmd = "docker-compose --env-file " + ENV_FILE + " up"
    print("Command:"+cmd)
    try:
        subprocess.run(cmd, check=True, shell=True, env=my_env)
    except Exception:
        subprocess.run("docker-compose down", check=True, shell=True, env=my_env)

if __name__ == "__main__":
    main(sys.argv[1:])

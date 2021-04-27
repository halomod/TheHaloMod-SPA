import json
from typing import Dict
from io import open
import hmf
import halomod


def generate_version_dict() -> Dict:
    return {
        'hmf': hmf.__version__,
        'halomod': halomod.__version__,
    }


# Ran as a try block to log to the console if the file cannot be written to
try:
    constants_file = open('./library_versions.json', 'w')
    json.dump(generate_version_dict(), constants_file)
except Exception as e:
    print("Couldn't open the versions file to write. Error is as follows:", e)

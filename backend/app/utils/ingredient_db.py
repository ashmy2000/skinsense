import json
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent.parent / "dataset" / "ingredients.json"

with open(DATA_PATH) as f:
    INGREDIENT_DB = json.load(f)
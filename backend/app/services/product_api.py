import requests, os
from app.utils.product_selector import select_best_product
from app.utils.ingredient_translation import normalize_ingredients

OPENFOOD_API = os.getenv("OPENFOOD_API")


def get_product_data(query: str):

    params = {
        "search_terms": query,
        "search_simple": 1,
        "action": "process",
        "json": 1
    }

    response = requests.get(OPENFOOD_API, params=params)

    data = response.json()

    products = data.get("products", [])

    best_product = select_best_product(products, query)

    if not best_product:
        return None

    ingredients_text = best_product.get("ingredients_text", "")

    normalized = normalize_ingredients(ingredients_text)

    return {
        "name": best_product.get("product_name"),
        "image": best_product.get("image_front_url"),
        "ingredients_raw": ingredients_text,
        "ingredients_normalized": normalized
    }
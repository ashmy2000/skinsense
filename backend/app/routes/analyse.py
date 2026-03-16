from fastapi import APIRouter
from app.models.schemas import AnalyseRequest
from app.services.product_api import get_product_data
from app.services.ingredient_analyzer import analyse_ingredients

router = APIRouter()


@router.post("/analyse")
def analyse_product(data: AnalyseRequest):

    product_data = get_product_data(data.product)

    if not product_data:
        return {"error": "Product not found"}

    ingredients = product_data["ingredients_normalized"]
    image = product_data["image"]

    analysis = analyse_ingredients(", ".join(ingredients), data.profile)

    return {
        "product": product_data["name"],
        "ingredients": ingredients,
        "image": image,
        **analysis
    }
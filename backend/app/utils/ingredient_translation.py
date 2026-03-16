TRANSLATIONS = {
    "eau": "water",
    "aqua": "water",
    "glycérine": "glycerin",
    "glycerine": "glycerin",
    "vaseline": "petrolatum",
    "diméthicone": "dimethicone",
    "dimethicone": "dimethicone",
    "céramide": "ceramide",
    "ceramide": "ceramide",
    "hyaluronate de sodium": "hyaluronic acid",
    "sodium hyaluronate": "hyaluronic acid",
    "cholestérol": "cholesterol",
    "tocophérol": "vitamin e",
    "carbomère": "carbomer",
    "gomme xanthane": "xanthan gum",
    "alcool cétylique": "cetyl alcohol",
    "alcool cétéarylique": "cetearyl alcohol",
    "phosphate de potassium": "potassium phosphate",
    "phosphate dipotassique": "dipotassium phosphate",
    "edta disodique": "disodium edta",
    "phénoxyéthanol": "phenoxyethanol",
    "éthylhexylglycérine": "ethylhexylglycerin"
}


def normalize_ingredients(ingredients_text: str):
    """
    Converts ingredient list into normalized English ingredient names
    """

    ingredients = []

    for raw in ingredients_text.split(","):

        item = raw.strip().lower()

        # translate if known
        for key, value in TRANSLATIONS.items():
            if key in item:
                item = value
                break

        ingredients.append(item)

    return ingredients
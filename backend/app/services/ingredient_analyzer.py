from app.utils.ingredient_db import INGREDIENT_DB


def analyse_ingredients(ingredients, profile):

    # convert Pydantic object → dictionary
    profile = profile.model_dump()

    ingredient_list = [i.strip().lower() for i in ingredients.split(",")]

    good = []
    bad = []

    matched = set()  # prevents duplicate matches

    for ingredient in ingredient_list:

        for key, rule in INGREDIENT_DB.items():

            if key in ingredient and key not in matched:

                matched.add(key)

                # GOOD INGREDIENTS
                if profile["skinType"] in rule["good_for"]:
                    good.append({
                        "ingredient": key,
                        "reason": f"Good for {profile['skinType']} skin"
                    })

                # BAD INGREDIENTS
                if profile["skinType"] in rule["avoid_for"]:
                    bad.append({
                        "ingredient": key,
                        "reason": f"Not ideal for {profile['skinType']} skin"
                    })

                # PREGNANCY SAFETY
                if profile["pregnancySafe"] == "yes" and not rule["pregnancy_safe"]:
                    bad.append({
                        "ingredient": key,
                        "reason": "Not pregnancy safe"
                    })

    total_relevant = len(good) + len(bad)

    # avoid divide by zero
    if total_relevant == 0:
        percent = 50
    else:
        percent = int((len(good) / total_relevant) * 100)

    # VERDICT
    if percent >= 70:
        verdict = "good"
        emoji = "🙂"
    elif percent >= 50:
        verdict = "okay"
        emoji = "😐"
    else:
        verdict = "avoid"
        emoji = "☹️"

    return {
        "percent": percent,
        "verdict": verdict,
        "emoji": emoji,
        "good": good,
        "bad": bad
    }
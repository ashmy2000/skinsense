def select_best_product(products, query):
    """
    Choose the best product from API results
    """

    if not products:
        return None

    scored_products = []

    for p in products:

        score = 0

        name = p.get("product_name", "").lower()

        if query.lower() in name:
            score += 5

        if p.get("image_front_url"):
            score += 3

        if p.get("ingredients_text"):
            score += 2

        scored_products.append((score, p))

    scored_products.sort(reverse=True, key=lambda x: x[0])

    return scored_products[0][1]
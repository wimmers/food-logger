import { useState, useEffect } from "react";
import { getProductsUrl } from "./Config";
import { category, ProductDict } from "./Product";

interface incoming_product {
    id: number;
    url: string;
    code: number;
    product_name: string;
    generic_name: string;
    brands: string;
    categories: string;
    categories_tags: string;
    stores: string;
    allergens: string;
    nutriscore_grade: string;
    image_url: string;
    image_small_url: string;
    image_front_url: string;
    image_front_small_url: string;
    image_ingredients_url: string;
    image_ingredients_small_url: string;
    image_nutrition_url: string;
    image_nutrition_small_url: string;
}

type incoming = {
    categories: category[],
    products: incoming_product[]
}

export type products_categories = {
    products: ProductDict;
    categories: category[];
}

async function fetchProducts() {
    const response = await fetch(getProductsUrl)
    const data: incoming = await response.json()
    const products: ProductDict = data.products.reduce(
        (dict: ProductDict, product) => {
            dict[product.id] = {
                name: product.product_name,
                description: product.generic_name,
                image: product.image_small_url,
                code: product.code,
                nutriscore: product.nutriscore_grade,
                brands: product.brands
            }
            return dict
        }, {})
    const categories: category[] = data.categories
    return { products, categories }
}

/*
* Initially load products and categories from REST endpoint.
* As soon as the data is available, the following happens:
* - the data is set as an effect in return value data
* - the callback onData is called
* - loading is set from true to false as an effect
*/
function useFetch(onData: (data: products_categories) => void): [boolean, products_categories] {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<products_categories>({ products: {}, categories: [] });
    async function fetchUrl() {
        const data = await fetchProducts()
        setData(data);
        onData(data);
        setLoading(false);
    }
    useEffect(() => {
        fetchUrl();
    }, []);
    return [loading, data];
}
export { useFetch };
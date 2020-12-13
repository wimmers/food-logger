export type product = {
    name: string,
    description: string,
    image?: string,
    code: number,
    nutriscore: string,
    brands: string
}

export type ProductDict = {
    [index: number]: product;
};

export const exampleProducts: ProductDict = {
    0: {
        name: "Vegan blu",
        description: "A vegan blue cheese",
        code: 0,
        nutriscore: 'c',
        brands: 'Vegan V'
    },
    1: {
        name: "Simply V würzige Genießerscheiben",
        description: "The best",
        image: "https://static.openfoodfacts.org/images/products/426/044/496/0339/front_de.7.full.jpg",
        code: 1,
        nutriscore: 'd',
        brands: 'Vegan V'
    },
    3: {
        name: "Primitivo goes vegan",
        description: "reddish goodness",
        code: 2,
        nutriscore: 'b',
        brands: 'Vegan V'
    },
    4: {
        name: "Chardonnay vegan",
        description: "weird mix of white grapes",
        code: 3,
        nutriscore: 'a',
        brands: 'Vegan V'
    }
}

export type category = { name: string, products: number[] }

export const exampleCategories: category[] = [
    {
        name: 'Cheeses',
        products: [
            0,
            1,
            0,
            1,
            0,
            1
        ]
    },
    {
        name: 'Wines',
        products: [
            3,
            4,
            3,
            4,
            3,
            4
        ]
    }
]
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './ProductView.css';

export type product = { name: string, description: string, image?: string }

export type ProductDict = {
    [index: number]: product;
};

export const exampleProducts: ProductDict = {
    0: {
        name: "Vegan blu",
        description: "A vegan blue cheese"
    },
    1: {
        name: "Simply V würzige Genießerscheiben",
        description: "The best",
        image: "https://static.openfoodfacts.org/images/products/426/044/496/0339/front_de.7.full.jpg"
    },
    3: {
        name: "Primitivo goes vegan",
        description: "reddish goodness"
    },
    4: {
        name: "Chardonnay vegan",
        description: "weird mix of white grapes"
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

type ProductCardProps = {
    product: product;
    onClick: () => void;
    selected: boolean;
};

function ProductCard({ product, onClick, selected }: ProductCardProps) {
    return (
        <Card
            onClick={onClick}
            bg={selected ? 'primary' : undefined}
            text={selected ? 'light' : undefined}
        >
            {product.image ?
                (<Card.Img variant="top" src={product.image} className="product-img" />)
                : (<div className="product-img" />)}
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>
                    {product.description}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

type ProductListProps = {
    categories: category[];
    products: {
        [index: number]: product;
    };
    onSelectProduct: (_: number) => void;
    selectedProduct?: number;
};

function ProductList({ categories, products, onSelectProduct, selectedProduct }: ProductListProps) {

    const productList = (ids: number[]) => {
        return ids.map((id) => {
            if (products[id] === undefined) return null
            return (
                <ProductCard
                    product={products[id]}
                    onClick={() => { onSelectProduct(id) }}
                    selected={selectedProduct === id}
                    key={id}
                />
            )
        })
    }

    const categoryComponents = categories.map((category, index, _array) => {
        return (
            <Card key={index}>
                <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
                    {category.name}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index.toString()}>
                    <Card.Body>
                        <div className="card-columns">
                            {productList(category.products)}
                        </div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    })

    return (
        <Accordion defaultActiveKey="0">
            {categoryComponents}
        </Accordion>
    )
}

export default ProductList
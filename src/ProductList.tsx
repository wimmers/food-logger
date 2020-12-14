import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { category, product } from './Product';
import ProductSearch, { SearchState } from './ProductSearch'
import './ProductView.css';

type ProductCardProps = {
    product: product;
    onClick: () => void;
    selected: boolean;
};

function ProductCard(
    { product, onClick, selected }: ProductCardProps
) {
    return (
        <Card
            onClick={onClick}
            bg={selected ? 'primary' : undefined}
            text={selected ? 'light' : undefined}
        >
            <div className="card-horizontal">
                {product.image ?
                    (<img src={product.image} className="product-img" />)
                    : (<div className="product-img" />)}
                <Card.Body className="pt-1">
                    <Card.Text className="mb-1">{product.name}</Card.Text>
                    <Card.Text className="text-muted list-brand-text">{product.brands}</Card.Text>
                </Card.Body>
            </div>
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
    searchState: string[];
    onChangeSearchState: (values: string[]) => void;
};

function ProductList(
    { categories, products, onSelectProduct, selectedProduct,
        searchState, onChangeSearchState }: ProductListProps
) {

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
            <Card key={index} className="w-100">
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

    // In ES7 we could use products.values() but let us avoid polyfills for now.
    const productNames = Object.keys(products).map(
        (key: string) => products[Number(key)].name
    )

    return (
        <>
            <ProductSearch
                defaultValue={{
                    brands: ["Beda", "Simply V"],
                    categories: categories.map(category => category.name),
                    products: productNames
                }}
                onChange={(values, state) => {
                    onChangeSearchState(values)
                    console.log(state)
                }}
                value={searchState}
            />
            <Accordion defaultActiveKey="0">
                {categoryComponents}
            </Accordion>
        </>
    )
}

export default ProductList
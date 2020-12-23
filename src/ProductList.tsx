import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { category, product } from './Product';
import ProductSearch, { SearchState } from './ProductSearch';
import { useToggle } from './Util';
import './ProductView.css';

type ProductCardProps = {
    product: product;
    onClick: () => void;
    available: boolean;
    tagging: boolean;
    onTag: () => void;
};

function ProductCard(
    { product, onClick, available, tagging, onTag }: ProductCardProps
) {
    const [tagged, toggleTagged] = useToggle(false)

    return (
        <Card
            onClick={onClick}
            bg={available ? undefined : 'light'}
        >
            <div className="card-horizontal">
                {product.image ?
                    (<img src={product.image} className="product-img" />)
                    : (<div className="product-img" />)}
                <Card.Body className="pt-1">
                    <Card.Text className="mb-1">{product.name}</Card.Text>
                    <Card.Text className="text-muted list-brand-text">{product.brands}</Card.Text>
                    {tagging && !available ?
                        <IconButton
                            onClick={e => {
                                e.stopPropagation()
                                if (!tagged) {
                                    toggleTagged()
                                    onTag()
                                }
                            }}
                            style={{ position: 'absolute', right: 0, bottom: 0 }}
                            color={tagged ? 'primary' : 'default'}
                        >
                            <CheckIcon fontSize="inherit" />
                        </IconButton> :
                        null
                    }
                </Card.Body>
            </div>
        </Card >
    )
}

type ProductListProps = {
    categories: category[];
    products: {
        [index: number]: product;
    };
    availableProductIds: Set<number>;
    onSelectProduct: (_: number) => void;
    searchInputState: string[];
    onChangeSearchState: (values: string[], state: SearchState) => void;
    tagging: boolean,
    onTag: (index: number) => void
};

function ProductList(
    {
        categories,
        products,
        availableProductIds,
        onSelectProduct,
        searchInputState,
        onChangeSearchState,
        tagging,
        onTag
    }: ProductListProps
) {

    const productList = (ids: number[]) => {
        return ids.map((id) => {
            if (products[id] === undefined) return null
            const available = availableProductIds.has(id)
            if (!available && !tagging) {
                return null
            }
            return (
                <ProductCard
                    product={products[id]}
                    onClick={() => { onSelectProduct(id) }}
                    available={available}
                    key={id}
                    tagging={tagging}
                    onTag={() => onTag(id)}
                />
            )
        })
    }

    const categoryComponents = categories.map((category, index, _array) => {
        const products = productList(category.products).filter(x => x)
        if (!products.length) {
            return null
        }
        return (
            <Card key={index} className="w-100">
                <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
                    {category.name}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index.toString()}>
                    <Card.Body>
                        <div className="card-columns">
                            {products}
                        </div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }).filter(x => x)

    // In ES7 we could use products.values() but let us avoid polyfills for now.
    const productNames = Object.keys(products).map(
        (key: string) => products[Number(key)].name
    )

    const brands = Array.from(new Set(
        Object.keys(products).map(index => products[Number(index)].brands)
    ))

    const codes = Object.keys(products).map(
        (key: string) => products[Number(key)].code
    )

    return (
        <>
            <ProductSearch
                defaultValue={{
                    brands,
                    categories: categories.map(category => category.name),
                    products: productNames,
                    codes
                }}
                onChange={onChangeSearchState}
                value={searchInputState}
            />
            <Accordion defaultActiveKey="0">
                {categoryComponents}
            </Accordion>
        </>
    )
}

export default ProductList
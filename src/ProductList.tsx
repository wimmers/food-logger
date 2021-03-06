import './ProductView.css';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import React, { useContext, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { category, product } from './Product';
import ProductSearch, { SearchState } from './ProductSearch';
import { useToggle } from './Util';
import Button from 'react-bootstrap/Button';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { incNumCategories, incNumProducts, initNumCategories, initNumProducts } from './Config';
import { useTranslation } from 'react-i18next';

type ProductCardProps = {
    product: product;
    onClick: () => void;
    available: boolean;
    tagged: boolean;
    tagging: boolean;
    onTag: () => void;
    onUntag: () => void;
};

function ProductCard(
    { product, onClick, available, tagged, tagging, onTag, onUntag }: ProductCardProps
) {

    return (
        <Card
            onClick={onClick}
            bg={tagged || available ? undefined : 'light'}
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
                                    onTag()
                                }
                                else {
                                    onUntag()
                                }
                            }}
                            style={{ position: 'absolute', right: 0, bottom: 0 }}
                            className={tagged ? "marked-icon" : undefined}
                            color={'default'}
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
    brands: {
        [index: string]: number[]
    };
    availableProductIds: Set<number>;
    onSelectProduct: (_: number) => void;
    searchInputState: string[];
    onChangeSearchState: (values: string[], state: SearchState) => void;
    tagging: boolean,
    onTag: (index: number) => void,
    onUntag: (index: number) => void,
    visible: boolean
};

// Adopted from https://react-bootstrap.github.io/components/accordion/
function ContextAwareToggle({ children, eventKey, callback }:
    { children: any, eventKey: string, callback: (isOpen: boolean) => void }) {
    const currentEventKey = useContext(AccordionContext);

    const decoratedOnClick = useAccordionToggle(
        eventKey,
        () => callback(currentEventKey !== eventKey),
    );

    return (
        <Card.Header onClick={decoratedOnClick}>
            {children}
        </Card.Header>
    );
}

function ProductList(
    {
        categories,
        products,
        brands,
        availableProductIds,
        onSelectProduct,
        searchInputState,
        onChangeSearchState,
        tagging,
        onTag,
        onUntag,
        visible
    }: ProductListProps
) {

    const [numCategories, setNumCategories] = useState(initNumCategories)
    const [numProducts, setNumProducts] = useState(initNumProducts)
    const [taggedProducts, setTaggedProducts] = useState(new Set())

    const onLoadMoreCategories = () => setNumCategories(x => x + incNumCategories)
    const onLoadMoreProducts = () => setNumProducts(x => x + incNumProducts)
    const onAccordionChange = (isOpen: boolean) => setNumProducts(initNumProducts)

    const t = useTranslation('products').t

    const tagProduct = (id: number) => {
        taggedProducts.add(id)
        // This is to force an update in react.
        // An immutable data structure would be probably be more apt.
        setTaggedProducts(new Set(taggedProducts))
        onTag(id)
    }

    const untagProduct = (id: number) => {
        taggedProducts.delete(id)
        // This is to force an update in react.
        // An immutable data structure would be probably be more apt.
        setTaggedProducts(new Set(taggedProducts))
        onUntag(id)
    }

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
                    tagged={taggedProducts.has(id)}
                    key={id}
                    tagging={tagging}
                    onTag={() => tagProduct(id)}
                    onUntag={() => untagProduct(id)}
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
                <ContextAwareToggle eventKey={index.toString()} callback={onAccordionChange}>
                    {category.name}
                </ContextAwareToggle>
                <Accordion.Collapse eventKey={index.toString()}>
                    <Card.Body>
                        <div className="card-columns">
                            {products.slice(0, numProducts)}
                        </div>
                        {products.length > numProducts ?
                            <Button
                                variant='outline-primary'
                                className='center-horizontal'
                                onClick={onLoadMoreProducts}>
                                {t('Load more')}
                            </Button> :
                            null
                        }
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }).filter(x => x)

    // In ES7 we could use products.values() but let us avoid polyfills for now.
    const productNames = Object.keys(products).map(
        (key: string) => products[Number(key)].name
    )

    const codes = Object.keys(products).map(
        (key: string) => products[Number(key)].code
    )

    return (
        <div style={visible ? { display: 'none' } : undefined}>
            <ProductSearch
                defaultValue={{
                    brands: Object.keys(brands),
                    categories: categories.map(category => category.name),
                    products: productNames,
                    codes
                }}
                onChange={onChangeSearchState}
                value={searchInputState}
            />
            <Accordion defaultActiveKey="0">
                {categoryComponents.slice(0, numCategories)}
            </Accordion>
            {categoryComponents.length > numCategories ?
                <Button
                    variant='outline-primary'
                    className='center-horizontal my-2'
                    onClick={onLoadMoreCategories}
                >
                    {t('Load more')}
                </Button> :
                null
            }
        </div>
    )
}

export default ProductList
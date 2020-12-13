import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Card from 'react-bootstrap/Card';
import { product } from './Product';
import './ProductDetail.css';

type ProductDetailProps = {
    product: product;
    onBack: () => void;
};

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
    const nutriscore_img = `https://static.openfoodfacts.org/images/misc/nutriscore-${product.nutriscore}.svg`
    const offPage = `https://openfoodfacts.org/product/${product.code}/`
    return (
        <Card>
            {product.image ?
                (<Card.Img variant="top" src={product.image} className="product-img-top" />)
                : (<div className="product-img-top" />)}
            <IconButton onClick={onBack} style={{ position: 'absolute' }}>
                <ArrowBackIcon fontSize="inherit" />
            </IconButton>
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Subtitle className="text-muted mb-2">{product.brands}</Card.Subtitle>
                <Card.Text>
                    {product.description}
                </Card.Text>
                {product.nutriscore ? <img className="nutriscore-img" src={nutriscore_img}></img> : null}
                < Card.Text className="text-muted">
                    Data provided by <a href={offPage}>Open Food Facts</a>.
                </Card.Text>
            </Card.Body>
        </Card >
    )
}
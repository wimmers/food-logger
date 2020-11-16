import React, { useEffect, useState } from 'react';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import MapView from './MapView';
import ProductList, { ProductDict, exampleProducts, exampleCategories } from './ProductList'
import { OSMSupermarket } from './OSMData';

function App() {

  const [products, setProducts] = useState(exampleProducts)
  const [selectedProduct, setSelectedProduct] = useState<number | undefined>(undefined)
  const [supermarkets, setSupermarkets] = useState<OSMSupermarket[] | null>(null)
  const [selectedMarkets, setSelectedMarkets] = useState<number[]>([])

  const filterProductsByMarkets = (markets: OSMSupermarket[]) => {
    const ids = Object.keys(exampleProducts).map(x => Number(x))
    const filteredIds = ids.filter(_ => Math.random() >= 0.5)
    const filteredProducts = filteredIds.reduce(
      (acc: ProductDict, id) => {
        acc[id] = exampleProducts[id];
        return acc
      },
      {})
    if (selectedProduct !== undefined && !filteredIds.includes(selectedProduct)) {
      setSelectedProduct(undefined)
    }
    setProducts(filteredProducts)
  }

  const updateMarkets = (markets: OSMSupermarket[]) => {
    setSupermarkets(markets)
    filterProductsByMarkets(markets)
  }

  const updateSelected = (id: number) => {
    if (id === selectedProduct) {
      // deselect product
      setSelectedProduct(undefined)
    }
    else {
      setSelectedProduct(id)
    }
  }

  const filterMarketsByProduct = () => {
    if (supermarkets === null) return
    if (selectedProduct === undefined) {
      setSelectedMarkets([])
    }
    else {
      const ids = supermarkets.map(market => market.id)
      const selected = ids.filter(_ => Math.random() >= 0.5)
      setSelectedMarkets(selected)
    }
  }

  useEffect(filterMarketsByProduct, [selectedProduct, supermarkets])

  return (
    <Container fluid>
      <Row>
        <Col xs={12} md={9} lg={6}>
          <MapView
            supermarkets={supermarkets}
            onUpdateMarkets={updateMarkets}
            selectedMarkets={selectedMarkets}
          />
        </Col>
        <Col>
          <ProductList
            products={products} categories={exampleCategories}
            selectedProduct={selectedProduct} onSelectProduct={updateSelected}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;

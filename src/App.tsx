import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import MapView from './MapView';
import ProductList, { ProductDict, exampleProducts, exampleCategories } from './ProductList'
import { OSMSupermarket } from './OSMData';
import Split from 'react-split'
import { Map } from 'leaflet';

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

  // Used to refocus the map when its size changes
  const mapRef = useRef<Map | null>(null);

  // Horizontal or vertical layout?
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  const horizontal = vw >= vh

  return (
    <Container fluid style={{ height: vh }}>
      <Split
        sizes={[50, 50]}
        className='full-size'
        onDragEnd={(_sizes: any) => {
          const map = mapRef.current
          if (map === null) return
          map.invalidateSize()
        }}
        direction={horizontal ? 'horizontal' : 'vertical'}
        gutterSize={20}
      >
        <div className='split full-size'>
          <MapView
            supermarkets={supermarkets}
            onUpdateMarkets={updateMarkets}
            selectedMarkets={selectedMarkets}
            setMap={(map: Map) => mapRef.current = map}
          />
        </div>
        <div className='split'>
          <ProductList
            products={products}
            categories={exampleCategories}
            selectedProduct={selectedProduct}
            onSelectProduct={updateSelected}
          />
        </div>
      </Split>
    </Container>
  );
}

export default App;

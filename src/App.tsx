import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Menu from './Menu';
import MapView from './MapView';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import { ProductDict } from './Product';
import { OSMSupermarket } from './OSMData';
import Split from './Split';
import { Map } from 'leaflet';
import { useFetch, products_categories } from './FetchData'
import { filterProductsUrl, filterShopsUrl } from './Config';

function App() {

  const [products, setProducts] = useState<ProductDict>([])
  const [selectedProduct, setSelectedProduct] = useState<number | undefined>(undefined)
  const [supermarkets, setSupermarkets] = useState<OSMSupermarket[] | null>(null)
  const [selectedMarkets, setSelectedMarkets] = useState<number[]>([])
  const [menuVisible, setMenuVisible] = useState(false)

  const setData = (data: products_categories) => {
    setProducts(data.products)
    console.log("Set data!")
  }

  const [loading, data] = useFetch(setData)

  async function filterProductsByMarkets(markets: OSMSupermarket[]) {
    const ids = Object.keys(products)
    const node_ids = markets.map(market => market.id).join()
    console.log(node_ids)
    const result = await fetch(filterProductsUrl + new URLSearchParams({
      nodes: node_ids
    }))
    const result_data: { products: number[] } = await result.json()
    const filteredIds = result_data.products
    console.log(filteredIds)
    const filteredProducts = filteredIds.reduce(
      (acc: ProductDict, id) => {
        acc[id] = data.products[id];
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

  async function filterMarketsByProduct() {
    if (supermarkets === null) return
    if (selectedProduct === undefined) {
      setSelectedMarkets([])
    }
    else {
      const ids = supermarkets.map(market => market.id).join()
      const result = await fetch(filterShopsUrl + new URLSearchParams({
        nodes: ids,
        product: selectedProduct.toString()
      }))
      const result_data: { nodes: number[] } = await result.json()
      const selected = result_data.nodes
      setSelectedMarkets(selected)
    }
  }

  useEffect(() => { filterMarketsByProduct() }, [selectedProduct, supermarkets])

  // Used to refocus the map when its size changes
  const mapRef = useRef<Map | null>(null);

  // Horizontal or vertical layout?
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  const horizontal = vw >= vh

  const onDrag = () => {
    const map = mapRef.current
    if (map === null) return
    map.invalidateSize()
  }

  return (
    <>
      <Menu open={menuVisible} onClose={() => setMenuVisible(false)} />
      <Container fluid style={{ height: vh }}>
        <Split
          onDrag={onDrag}
          direction={horizontal ? 'horizontal' : 'vertical'}
          gutterSize={20}
          totalSize={horizontal ? vw : vh}
          minSize={0}
        >
          <MapView
            onUpdateMarkets={updateMarkets}
            onOpenMenu={() => setMenuVisible(true)}
            supermarkets={supermarkets}
            selectedMarkets={selectedMarkets}
            setMap={(map: Map) => mapRef.current = map}
          />
          {selectedProduct ?
            <ProductDetail
              onBack={() => setSelectedProduct(undefined)}
              product={products[selectedProduct]}
            /> :
            <ProductList
              products={products}
              categories={data.categories}
              selectedProduct={selectedProduct}
              onSelectProduct={updateSelected}
            />}
        </Split>
      </Container >
    </>
  );
}

export default App;

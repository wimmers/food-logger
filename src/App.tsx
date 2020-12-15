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
import { SearchState, emptySearchState } from './ProductSearch';
import { useToggle } from './Util'
import { SnackbarProvider, useSnackbar } from 'notistack';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

function App() {

  const [products, setProducts] = useState<ProductDict>({})
  const [selectedProduct, setSelectedProduct] = useState<number | undefined>(undefined)
  const [supermarkets, setSupermarkets] = useState<OSMSupermarket[] | null>(null)
  const [selectedMarkets, setSelectedMarkets] = useState<number[]>([])
  const [menuVisible, toggleMenuVisible] = useToggle(false)
  const [searchInputState, setSearchInputState] = useState<string[]>([])
  const [searchState, setSearchState] = useState<SearchState>(emptySearchState)
  const [tagging, toggleTagging] = useToggle(false)
  const [availableProductIds, setAvailableProductIds] = useState<number[]>([])

  const setData = (data: products_categories) => {
    setProducts(data.products)
    setAvailableProductIds(Object.keys(data.products).map(x => +x))
  }

  const onChangeSearchState = (values: string[], state: SearchState) => {
    setSearchInputState(values)
    setSearchState(state)
  }

  const [loading, data] = useFetch(setData)

  const { enqueueSnackbar } = useSnackbar();

  const onTagProducts = () => {
    if (supermarkets === null || supermarkets.length !== 1) {
      enqueueSnackbar("Please select a shop first!")
    }
    else {
      if (!tagging) {
        enqueueSnackbar(<span>Press <CheckIcon /> to mark a product as available</span>)
      }
      toggleTagging();
    }
    toggleMenuVisible();
  }

  async function filterProductsByMarkets(markets: OSMSupermarket[]) {
    const ids = Object.keys(products)
    const nodeIds = markets.map(market => market.id).join()
    const result = await fetch(filterProductsUrl + new URLSearchParams({
      nodes: nodeIds
    }))
    const resultData: { products: number[] } = await result.json()
    const filteredIds = resultData.products
    if (selectedProduct !== undefined && !filteredIds.includes(selectedProduct)) {
      setSelectedProduct(undefined)
    }
    setAvailableProductIds(filteredIds)
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
      const resultData: { nodes: number[] } = await result.json()
      const selected = resultData.nodes
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

  const productIndices = Object.keys(products).map(x => Number(x))
  const filteredProducts = productIndices.reduce(
    (acc: ProductDict, index: number) => {
      const product = products[index]
      const isInProducts = !searchState.products.length || searchState.products.includes(product.name)
      const isInBrands = !searchState.brands.length || searchState.brands.includes(product.brands)
      const isInCodes = !searchState.codes.length || searchState.codes.includes(product.code)
      if (isInProducts && isInBrands && isInCodes) {
        acc[index] = product
      }
      return acc
    },
    {}
  )
  const filteredCategories =
    searchState.categories.length === 0 ?
      data.categories :
      data.categories.filter(category => searchState.categories.includes(category.name))

  return (
    <>
      <Menu
        open={menuVisible}
        onClose={toggleMenuVisible}
        onTagProducts={onTagProducts}
      />
      <Container fluid style={{ height: vh }}>
        <Split
          onDrag={onDrag}
          direction={horizontal ? 'horizontal' : 'vertical'}
          gutterSize={20}
          totalSize={horizontal ? vw : vh}
          minSize={0}
          collapsed={supermarkets !== null && supermarkets.length === 1}
        >
          <MapView
            onUpdateMarkets={updateMarkets}
            onOpenMenu={() => toggleMenuVisible()}
            supermarkets={supermarkets}
            selectedMarkets={selectedMarkets}
            setMap={(map: Map) => mapRef.current = map}
          />
          {selectedProduct ?
            <ProductDetail
              onBack={() => setSelectedProduct(undefined)}
              onConfirm={() => console.log('Confirmed product')}
              onUnconfirm={() => console.log('Unconfirmed product')}
              product={products[selectedProduct]}
              showConfirm={supermarkets !== null && supermarkets.length === 1}
            /> :
            <ProductList
              products={filteredProducts}
              categories={filteredCategories}
              availableProductIds={new Set(availableProductIds)}
              onSelectProduct={updateSelected}
              searchInputState={searchInputState}
              onChangeSearchState={onChangeSearchState}
              tagging={tagging}
              onTag={id => console.log(`Tagged: ${id}`)}
            />}
        </Split>
      </Container >
    </>
  );
}

export default function IntegrationNotistack() {
  const notistackRef: any = React.createRef();
  const onClickDismiss = (key: React.ReactText) => () => {
    notistackRef.current.closeSnackbar(key);
  }
  return (
    <SnackbarProvider
      maxSnack={3}
      ref={notistackRef}
      action={(key) => (
        <IconButton size="small" aria-label="close" color="inherit" onClick={onClickDismiss(key)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    >
      <App />
    </SnackbarProvider>
  );
}
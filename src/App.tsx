import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Menu from './Menu';
import MapView from './MapView';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import { ProductDict } from './Product';
import { OSMSupermarket } from './OSMData';
import Split from './Split';
import { Map } from 'leaflet';
import { useFetch, products_categories } from './FetchData';
import { filterProductsUrl, filterShopsUrl } from './Config';
import { sendAddProduct, sendConfirmProduct, sendUnconfirmProduct } from './Endpoints';
import { SearchState, emptySearchState } from './ProductSearch';
import { useToggle } from './Util';
import { SnackbarProvider, useSnackbar } from 'notistack';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Spinner from 'react-bootstrap/Spinner';
import { useI18N } from './i18n';
import { useTranslation } from 'react-i18next';

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

  const [loadingData, data] = useFetch(setData)
  const loadingI18N = useI18N()

  const { enqueueSnackbar } = useSnackbar();

  const onConfirmProduct = () => {
    if (!supermarkets || supermarkets.length !== 1 || !selectedProduct) {
      // should not be reached
      return
    }
    sendConfirmProduct(selectedProduct, supermarkets[0].id)
  }

  const onUnconfirmProduct = () => {
    if (!supermarkets || supermarkets.length !== 1 || !selectedProduct) {
      // should not be reached
      return
    }
    sendUnconfirmProduct(selectedProduct, supermarkets[0].id)
  }

  const onTagProduct = (id: number) => {
    if (!supermarkets || supermarkets.length !== 1) {
      // should not be reached
      return
    }
    sendAddProduct(id, supermarkets[0].id)
  }

  const taggingSnackBar = <span>Press <CheckIcon /> to mark a product as available</span>

  const onTagProducts = (isMenu: boolean) => () => {
    if (supermarkets === null || supermarkets.length !== 1) {
      enqueueSnackbar("Please select a shop first!")
    }
    else {
      if (!tagging) {
        enqueueSnackbar(taggingSnackBar)
      }
      toggleTagging();
    }
    if (isMenu)
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

  const onStartTagging = (market: OSMSupermarket) => {
    if (!tagging) {
      updateMarkets([market])
      toggleTagging()
      enqueueSnackbar(taggingSnackBar)
    }
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
      const isInBrands = !searchState.brands.length ||
        searchState.brands.some(brand => data.brands[brand].includes(index))
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

  const tt = useTranslation('common', { useSuspense: false }).t

  useEffect(() => {
    if (!loadingI18N)
      enqueueSnackbar(tt("Click anywhere on the map to find shops!"), { autoHideDuration: 50000 })
  }, [loadingI18N])

  return (
    loadingData || loadingI18N ?
      <div style={{ margin: 'auto', display: 'table' }} className="my-3">
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="mr-2"
        />
        {loadingI18N ? 'Loading...' : tt('Loading...')}
      </div > :
      <>
        <Menu
          open={menuVisible}
          onClose={toggleMenuVisible}
          onTagProducts={onTagProducts(true)}
          tagging={tagging}
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
              onStartTagging={onStartTagging}
              onStopTagging={onTagProducts(false)}
              tagging={tagging}
              onOpenMenu={() => toggleMenuVisible()}
              supermarkets={supermarkets}
              selectedMarkets={selectedMarkets}
              setMap={(map: Map) => mapRef.current = map}
            />
            <>
              {selectedProduct ?
                <ProductDetail
                  onBack={() => setSelectedProduct(undefined)}
                  onConfirm={onConfirmProduct}
                  onUnconfirm={onUnconfirmProduct}
                  product={products[selectedProduct]}
                  showConfirm={supermarkets !== null && supermarkets.length === 1}

                /> : null
              }
              <ProductList
                products={filteredProducts}
                categories={filteredCategories}
                brands={data.brands}
                availableProductIds={new Set(availableProductIds)}
                onSelectProduct={updateSelected}
                searchInputState={searchInputState}
                onChangeSearchState={onChangeSearchState}
                tagging={tagging}
                onTag={onTagProduct}
                visible={selectedProduct !== undefined}
              />
            </>
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
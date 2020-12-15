import React from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

export type SearchState = {
    categories: string[],
    brands: string[],
    products: string[],
    codes: number[],
}
export const emptySearchState: SearchState = {
    categories: [],
    brands: [],
    products: [],
    codes: [],
}

const reCode = /[0-9]+/

const stateToSuggestions = ({ categories, brands, products, codes }: SearchState) => {
    const empty: string[] = []
    const suggestions = empty.concat(
        categories.map(category => `Category: ${category}`),
        brands.map(brand => `Brand: ${brand}`),
        products,
        codes.map(n => n.toString())
    )
    return suggestions
}

const convertValues = (marker: string, values: string[]) => {
    const start = `${marker}: `
    const filtered = values.filter(s => s.startsWith(start))
    const result = filtered.map(s => s.substr(start.length))
    return result
}

function ProductSearch(
    { defaultValue, value, onChange }:
        {
            defaultValue: SearchState,
            value: string[],
            onChange: (values: string[], state: SearchState) => void,
        }
) {

    const handleChange = (values: string[]) => {
        const brands = convertValues('Brand', values)
        const categories = convertValues('Category', values)
        const markers = ['Brand', 'Category'].map(marker => `${marker}: `)
        const regexString = markers.join('|')
        const regex = RegExp(regexString)
        const products = values.filter(s => !s.match(regex) && !s.match(reCode))
        const codes = values.filter(s => s.match(reCode)).map(s => +s)
        const newState = {
            brands,
            categories,
            products,
            codes
        }
        onChange(values, newState)
    }

    return (
        <Autocomplete
            multiple
            id="tags-filled"
            value={value}
            options={stateToSuggestions(defaultValue)}
            freeSolo
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
            }
            onChange={(_event, newValue) => handleChange(newValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="filled"
                    label={<span><SearchIcon /> Filter products</span>}
                    placeholder="Products, categories, or brands"
                />
            )}
        />)
}

export default ProductSearch
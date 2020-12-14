import React from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

function ProductSearch({ categories, brands, products }: { categories: string[], brands: string[], products: string[] }) {
    const empty: string[] = []
    const suggestions = empty.concat(
        categories.map(category => `Category: ${category}`),
        brands.map(brand => `Brand: ${brand}`),
        products
    )
    return (
        <Autocomplete
            multiple
            id="tags-filled"
            options={suggestions}
            defaultValue={[]}
            freeSolo
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={<span><SearchIcon /> Filter products</span>}
                    placeholder="Products, categories, or brands"
                />
            )}
        />)
}

export default ProductSearch
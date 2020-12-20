import { addProductUrl, confirmProductUrl, unconfirmProductUrl } from './Config'

const sendProduct = (url: string) => (id: number, node: number) => {
    const data = { product: id, node }
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .catch((error) => {
            console.error('Error:', error);
        });
}

export const sendAddProduct = sendProduct(addProductUrl)

export const sendConfirmProduct = sendProduct(confirmProductUrl)

export const sendUnconfirmProduct = sendProduct(unconfirmProductUrl)
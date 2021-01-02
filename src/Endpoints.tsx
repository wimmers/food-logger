import { addProductUrl, removeProductUrl, confirmProductUrl, unconfirmProductUrl }
    from './Config'

const sendProduct = (url: string, method = 'POST') => (id: number, node: number) => {
    const data = { product: id, node }
    fetch(url, {
        method,
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

export const sendRemoveProduct = sendProduct(removeProductUrl, 'DELETE')

export const sendConfirmProduct = sendProduct(confirmProductUrl)

export const sendUnconfirmProduct = sendProduct(unconfirmProductUrl)
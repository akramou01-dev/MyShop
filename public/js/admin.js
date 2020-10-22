const deleteProduct = (btn) => {
    const productId = btn.parentNode.querySelector('[name=productId]').value;
    const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value;

    const productElement = btn.closest('article'); // it will gives us the closest article
    fetch(`/admin/product/${productId}`, {
            method: 'DELETE', // ecrit en maj juste psk c une bonne convention
            headers: {
                'csrf-token': csrfToken,
            }
        })
        .then(result => {
            productElement.parentNode.removeChild(productElement);
        })
        .catch(err => {
            console.log(err);
        });
};
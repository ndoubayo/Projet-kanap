//URL de l'API
const urlApi = 'http://localhost:3000/api/products'

/*--------------Récuperation des produits de l'API---------------*/

fetch(urlApi)
    .then(res => res.json())
    .then(function handleProducts(data) {
        let productList = []
        for (let i of data) {
            productList = productList + `
        <a href="./product.html?id=${i._id}">
        <article>
          <img src="${i.imageUrl}" alt= "${i.altTxt}">
          <h3 class="productName">${i.name}</h3>
          <p class="productDescription">${i.description}.</p>
        </article>
        </a>
        `;
        }
        const itemsContainer = document.querySelector('#items');
        itemsContainer.innerHTML = productList;
    })
    .catch(error => {
        alert('Erreur survenu lors de la connection à l\'API' + error)
    })



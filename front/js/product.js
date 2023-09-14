/*-------Liaison du produit avec celui de la page d'accueil--------*/
const queryString = window.location.search;
console.log(queryString)

const urlParams = new URLSearchParams(queryString)
const productId = urlParams.get("id")
console.log(productId)

//----Liste des prosuits-------------
const urlAllProducts = await fetch('http://localhost:3000/api/products');
const productList = await urlAllProducts.json();
console.log(productList.length)

const elById = productList.find(el => el._id === productId)
console.log(elById);

//------Rattachement des elemnts du produit-----------

const imgContainer = document.querySelector(".item__img");
imgContainer.innerHTML = `<img src="${elById.imageUrl}" alt="${elById.altTxt}">`;

const nameContainer = document.querySelector("#title");
nameContainer.innerText = elById.name;

const priceContainer = document.querySelector("#price");
priceContainer.innerText = elById.price;

const descriptionContainer = document.querySelector("#description");
descriptionContainer.innerText =elById.description;


const optonsContainer = document.querySelector("#colors");
const colors = elById['colors']
console.log(colors)

function makeOptionsOfColor(){
    for (let color of colors){
        const option = document.createElement('option');
        option.setAttribute('value', `${color}`);
        option.innerText = `${color}`
        optonsContainer.appendChild(option)
    }
}
makeOptionsOfColor();

//Envoyer les elements dans le panier 

const envoiPanier = document.querySelector("#addToCart");

envoiPanier.addEventListener('click', e => {
    e.preventDefault();
    const qtiteChoosed = document.querySelector('#quantity').value;
    let productInfos = {
        productName: elById.name,
        productImag: elById.imageUrl,
        idProduct: elById._id,
        qtityOption: Number(qtiteChoosed),
        prix: elById.price,
        colorChoosed: optonsContainer.value
    }
    console.log(productInfos.colorChoosed)
    if(qtiteChoosed != 0 && optonsContainer.value != ""){
       console.log("Choix de :", productInfos)
    //-----LocalStorage Management----------
    let productInLS = JSON.parse(localStorage.getItem("product"));
    console.log(productInLS)
   

    function popuConfirmation(){
        if(window.confirm(`Produit: ${elById.name} de couleur ${optonsContainer.value}, Quanité: ${qtiteChoosed}, ajouté au panier!
        Voulez-vous consulter le panier?`)){
            window.location.href =`cart.html`
            console.log("Bien")
        }else{
            window.location.href = "index.html"
        }
    }

    //---Fonction ajoutant des produits au panier----

    function addProduct (){
        const elInLSByColor = productInLS.find(el => el.colorChoosed === optonsContainer.value);
        const elInLSById = productInLS.find(el => el.idProduct === elById._id);
     
        if(elInLSByColor && elInLSById ){
            console.log(elInLSByColor )
            // window.localStorage.removeItem(elInLSByColor);
            alert(`Le Produit: ${elById.name} de couleur ${optonsContainer.value} existe déjà et sera ajouté de nouveau dans le panier!
            Rendez-vous dans le panier si voulez modifier la qunatité.`)
            let newQtity = productInfos.qtityOption + elInLSByColor.qtityOption ;
            console.log(newQtity)
            elInLSByColor.qtityOption = newQtity;
            localStorage.setItem("product", JSON.stringify(productInLS));
            console.log("Bien")
            

            // elInLSByColor.qtityOption = elInLSByColor.qtityOption + productInfos.qtityOption;
            // console.log(elInLSByColor)
            // productInLS.push(newproductInfos);
            // console.log(productInLS)
            // localStorage.setItem("product", JSON.stringify(deleted));
            // console.log(typeof elInLSByColor)
            // console.log(productInfos)
            // 
            // productInLS.push(elInLSByColor);
            // console.log(elInLSByColor)
        }else{
            productInLS.push(productInfos);
            localStorage.setItem("product", JSON.stringify(productInLS));
        }
        
    }
    if(productInLS){
        addProduct()
        popuConfirmation();
    }else{
        productInLS = [];
        addProduct()
        popuConfirmation()
    }
    }else{
        alert("Veillez renseigner les couleurs et quantités valides SVP!")
    }
})

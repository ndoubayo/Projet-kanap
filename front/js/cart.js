// console.log("cart")
let productInLS = JSON.parse(localStorage.getItem("product"));
console.log(productInLS)

const cartItmes = document.querySelector("#cart__items");

if(productInLS == null || productInLS == 0){
    console.log("Je suis vide");
    cartItmes.innerHTML = `
    <div class="panier-vide"> Le panier est vide... <div>
    `
}else{
    console.log("Je suis pas vide!")
    let productStruct = [];
    for(let i = 0; i<productInLS.length; i++){
        productStruct = productStruct + `
        <article class="cart__item" data-id="${productInLS[i].idProduct}" data-color="${productInLS[i].colorChoosed}">
        <div class="cart__item__img">
          <img src="${productInLS[i].productImag}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${productInLS[i].productName}</h2>
            <p>${productInLS[i].colorChoosed}</p>
            <p>${productInLS[i].prix} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInLS[i].qtityOption}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
        </article>
        `
    }
    cartItmes.innerHTML = productStruct
}

//-----------Suppression des produits--------------

const deleteBtn = document.querySelectorAll('.deleteItem')

deleteBtn.forEach(element => {
  element.addEventListener('click', (e)=>{
    e.preventDefault();
    const articleToDelete = e.target.closest('article');
    const paraDataId = articleToDelete.getAttribute('data-id');

    let  deleted = productInLS.filter(pdct => pdct.idProduct !== paraDataId);
    console.log(deleted)

    localStorage.setItem("product", JSON.stringify(deleted));
    alert("Ce produit a été  supprimé du panier.")
    location.reload(true)
  })
});

// Modification d'une quantité de produit
function modifQtity() {
  let qtityToModif = document.querySelectorAll(".itemQuantity");
  console.log(qtityToModif.length)
  for (let j = 0; j < qtityToModif.length; j++) {
    qtityToModif[j].addEventListener("change", (e) => {
      e.preventDefault();
      let qtitiesInInputs = qtityToModif[j].valueAsNumber;

      productInLS[j].qtityOption = qtitiesInInputs;

      localStorage.setItem("product", JSON.stringify(productInLS));

      location.reload();
    });


  }
}
modifQtity();

////----------Gestion de la quantité total-----------
let qtityList  = []

for (let k = 0; k < productInLS.length; k++){
    qtityList.push(productInLS[k].qtityOption)

}
const reducer = (accumulator, currentValue) => accumulator + currentValue;

let totalQtity = qtityList.reduce(reducer,0)

const totalQtityShow = document.querySelector('#totalQuantity')
totalQtityShow.innerText = `${totalQtity}`;

////----------Gestion du prix total----------------

let priceList  = []

for (let k = 0; k < productInLS.length; k++){
    priceList.push(productInLS[k].prix * productInLS[k].qtityOption)
    
}
const reducerPrice = (accumulator, currentValue) => accumulator + currentValue;

let totalPrice = priceList.reduce(reducerPrice,0)

const totalShow = document.querySelector('#totalPrice')
totalShow.innerText = `${totalPrice}`


/****************Gestion de la coimmande *******************/

//Controle des champs du formulaire

const stringRegex = (value) =>{
  return /^[A-Za-z\s]{3,25}$/.test(value)
}
const integerRegex = (value) =>{
  return /^[0-9]{5,10}$/.test(value)
}
const mixRegex = (value) =>{
  return /^[A-Za-z0-9\s]{5,10}$/.test(value)
}
const emailRegex = (value) =>{
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
}

function validFirstName(){
  const firstName = document.querySelector('#firstName').value;
  if(stringRegex(firstName)){
    console.log(firstName)
    return true
  }else{
    document.querySelector('#firstNameErrorMsg').innerText = `Le Prénom: ${firstName} est invalide`;
    return false
  }
}
function validName(){
  const lastName = document.querySelector('#lastName').value;
  if(stringRegex(lastName)){
    return true
  }else{
    document.querySelector('#lastNameErrorMsg').innerText = `Le Nom: ${lastName} est invalide`
    return false
  }
}
function validAdress(){  
  const adress = document.querySelector('#address').value;
  if(mixRegex(adress)){
    return true
  }else{
    document.querySelector('#addressErrorMsg').innerText = `L'Adresse: ${adress} est invalide`
    return false
  }
}
function validVille(){ 
  const city = document.querySelector('#city').value;
  if(stringRegex(city)){
    return true
  }else{
    document.querySelector('#cityErrorMsg').innerText = `La Ville: ${city} est invalide`
    return false
  }
}
function validEmail(){
  const email = document.querySelector('#email').value;
  if(emailRegex(email)){
    return true
  }else{
    document.querySelector('#emailErrorMsg').innerText = `L'Email: ${firstName} est invalide`
    return false
  }
}
const commandeBtn = document.querySelector('#order')

commandeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (validFirstName() && validName() && validAdress() && validVille() && validEmail()) {
    //--------Gestion de l'envoi pour commande------------
    
    let allProducts = [];
    for (let i = 0; i < productInLS.length; i++) {
      allProducts.push(productInLS[i].idProduct);
    }
    console.log(allProducts);
    const order = {
      contact : {
        firstName: document.querySelector('#firstName').value,
        lastName: document.querySelector('#lastName').value,
        city: document.querySelector('#city').value,
        address: document.querySelector('#address').value,
        email: document.querySelector('#email').value
      },
      products : allProducts
    }
    // const contact = {
    //   firstName: document.querySelector('#firstName').value,
    //   lastName: document.querySelector('#lastName').value,
    //   address: document.querySelector('#address').value,
    //   city: document.querySelector('#city').value,
    //   email: document.querySelector('#email').value
    // }
    console.log(typeof productInLS)
    fetch("http://localhost:3000/api/products/order", {
      method: 'POST',
      body: JSON.stringify(order),
      headers: {
        "Content-Type": "application/json",
        'Accept': "application/json"
      }
    }
    )
    .then(res => res.json())
      .then((data) =>{
        localStorage.clear();
        localStorage.setItem("orderId", data.orderId);
        document.location.href = "confirmation.html";
      })
    .catch(error => alert(error))
  } else {
    alert('SVP veillez bien remplir les champs du formulaire!')
  }
})


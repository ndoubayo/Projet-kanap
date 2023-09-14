function main(){
    const idNode = document.querySelector("#orderId");
    idNode.innerText = localStorage.getItem("orderId");
    console.log(localStorage.getItem("orderId"))
    localStorage.clear();
}

main();
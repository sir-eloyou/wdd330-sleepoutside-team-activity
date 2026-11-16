import { getLocalStorage, loadHeaderFooter, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function getCartItemsNumber() {
  const products = getLocalStorage("so-cart") || [];
  const counts = products.length;

  document.querySelector(".count-items").textContent = counts;
}

function removeItemFromTheCart() {
  const cart = document.querySelector(".product-list")
  cart.addEventListener("click", (event) => {

    if (event.target.classList.contains("cart-card__close"))
    {
      const item = event.target.closest(".cart-card")
      const id = item.dataset.id

      let cartItems = getLocalStorage("so-cart");

      cartItems = cartItems.filter(product => product.Id !== id);

      setLocalStorage("so-cart", cartItems)

      item.remove()
      renderCartContents()
      getCartItemsNumber()
    }

    
  })

  

}

function cartItemTemplate(item) {
  const newItem = `<li data-id="${item.Id}" class="cart-card divider">
  <span class="cart-card__close" >x</span>
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

await loadHeaderFooter();

removeItemFromTheCart()
renderCartContents();
getCartItemsNumber();

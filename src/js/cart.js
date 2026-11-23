import { getLocalStorage, loadHeaderFooter, setLocalStorage, getCartItemsTotal } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
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
      getCartItemsTotal()
      getTotalPrice()
    }

    
  })

  

}

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;

  const newItem = `<li data-id="${item.Id}" class="cart-card divider">
  <span class="cart-card__close">x</span>
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
    <p class="cart-card__quantity">qty: ${quantity}</p>
    <p class="cart-card__price">${item.FinalPrice} x ${quantity} = $${(item.FinalPrice * quantity).toFixed(2)}</p>
  </li>`;

  return newItem;
}

function getTotalPrice() {
  const cartItems = getLocalStorage("so-cart") || [];

  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.FinalPrice * (item.quantity || 1)),
    0
  );

  document.querySelector(".order-summary__total").textContent =
    `Total: $${totalPrice.toFixed(2)}`;
}

await loadHeaderFooter();

removeItemFromTheCart()
renderCartContents();
getCartItemsTotal();
getTotalPrice();


const checkoutButton = document.querySelector(
    ".order-summary__checkout"
);

function checkCartBeforeCheckout() {
    const cartItems = getLocalStorage("so-cart") || [];

    checkoutButton.disabled = cartItems.length === 0;
}

checkoutButton.addEventListener("click", () => {getCartItemsTotal();
    const cartItems = getLocalStorage("so-cart") || [];

    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    window.location.href = "/checkout/index.html";
});

checkCartBeforeCheckout();
import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";
import CheckoutProcess from "./checkoutProcess.js";
import ExternalServices from "./ExternalServices.mjs";

await loadHeaderFooter();

const externalServices = new ExternalServices();

const checkout = new CheckoutProcess(
    "so-cart",
    ".checkout-container",
    externalServices
);

checkout.init();

const checkoutButton = document.querySelector(
    ".checkout-action button"
);

const cartItemsNumber = getLocalStorage("so-cart") || [];

checkoutButton.disabled = cartItemsNumber.length === 0;

const getCartItemsNumber = () => {
    const cartItems = getLocalStorage("so-cart") || [];

    document.querySelector(".count-items").textContent =
        cartItems.length;
};

getCartItemsNumber();

const form = document.querySelector("#payment-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cartItems = getLocalStorage("so-cart") || [];

    // Prevent checkout if cart is empty
    if (cartItems.length === 0) {
        alert("Your shopping cart is empty. Please add products before checking out.");
        return;
    }


    try {
        const response = await checkout.checkout(form);


        form.reset();

        // Empty the shopping cart
        localStorage.removeItem("so-cart");

        // Update cart item count
        document.querySelector(".count-items").textContent = "0";
        document.querySelector("#subtotal").textContent = "0.00";
        document.querySelector("#tax").textContent = "0.00";
        document.querySelector("#shipping").textContent = "0.00";
        document.querySelector("#total").textContent = "0.00";

        alert("Order placed successfully!" + (response ? ` Order ID: ${response.orderId}` : ""));

    } catch (error) {
        alert("Checkout error: " + error.message);
    }
});
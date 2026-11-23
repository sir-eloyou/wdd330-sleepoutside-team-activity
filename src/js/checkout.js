
import { loadHeaderFooter, getLocalStorage, alertMessage } from "./utils.mjs";
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
        alertMessage(
            "Your shopping cart is empty. Please add products before checking out."
        );
        return;
    }

    // Validate the form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Submit checkout
    await checkout.checkout(form);
});


import { getLocalStorage, alertMessage } from "./utils.mjs";

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    return Object.fromEntries(formData.entries());
}

export default class CheckoutProcess {
    constructor(key, outputSelector, externalServices) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.externalServices = externalServices;

        this.list = [];
        this.itemTotal = 0;
        this.itemCount = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSummary();
    }

    calculateItemSummary() {
        this.calculateItemSubTotal();
        this.calculateOrderTotal();
    }

    calculateItemSubTotal() {
        // Calculate total quantity
        this.itemCount = this.list.reduce(
            (total, item) => total + (Number(item.quantity) || 1),
            0
        );

        // Calculate subtotal including quantities
        this.itemTotal = this.list.reduce(
            (total, item) =>
                total +
                (Number(item.FinalPrice) || 0) *
                (Number(item.quantity) || 1),
            0
        );

        const subtotal = document.querySelector(
            `${this.outputSelector} #subtotal`
        );

        if (subtotal) {
            subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
        }

        const count = document.querySelector(
            `${this.outputSelector} .count-items`
        );

        if (count) {
            count.innerText = this.itemCount;
        }
    }

    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;

        // Shipping based on total item quantity
        this.shipping = this.itemCount === 0
            ? 0
            : 10 + (this.itemCount - 1) * 2;

        this.orderTotal =
            this.itemTotal + this.tax + this.shipping;

        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const tax = document.querySelector(
            `${this.outputSelector} #tax`
        );

        const shipping = document.querySelector(
            `${this.outputSelector} #shipping`
        );

        const total = document.querySelector(
            `${this.outputSelector} #total`
        );

        if (tax) {
            tax.innerText = `$${this.tax.toFixed(2)}`;
        }

        if (shipping) {
            shipping.innerText = `$${this.shipping.toFixed(2)}`;
        }

        if (total) {
            total.innerText = `$${this.orderTotal.toFixed(2)}`;
        }
    }

    packageItems(items) {
        return items.map((item) => ({
            id: item.Id,
            name: item.Name,
            price: Number(item.FinalPrice),
            quantity: Number(item.quantity) || 1
        }));
    }

    async checkout(form) {
        try {
            const order = formDataToJSON(form);

            order.orderDate = new Date().toISOString();
            order.orderTotal = this.orderTotal.toFixed(2);
            order.tax = this.tax.toFixed(2);
            order.shipping = this.shipping;
            order.items = this.packageItems(this.list);

            const response = await this.externalServices.checkout(order);

            localStorage.removeItem(this.key);

            window.location.href = "/checkout/success.html";

            return response;

        } catch (err) {
            console.error("Checkout failed:", err);

            if (err.name === "servicesError") {
                const message =
                    err.message?.message ||
                    err.message?.error ||
                    "Please check your information and try again.";

                alertMessage(message);
            } else {
                alertMessage(
                    "Something went wrong while processing your order. Please try again."
                );
            }
        }
    }
}

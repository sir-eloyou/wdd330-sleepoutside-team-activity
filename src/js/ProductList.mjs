import { renderListWithTemplate, getLocalStorage } from "./utils.mjs";



function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <img src="${product.Image}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}


export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category
        this.dataSource = dataSource
        this.listElement = listElement
    }

    async init() {
        const list = await this.dataSource.getData()
        this.renderList(list);
        this.getCartItemsNumber()

        
    }

    getCartItemsNumber() {
      const products = getLocalStorage("so-cart")  || []
      const counts = products.length;

      document.querySelector(".count-items").textContent = counts

    }

    renderList(list) {

        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}
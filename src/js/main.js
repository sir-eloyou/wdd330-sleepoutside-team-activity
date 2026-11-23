import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { getCartItemsTotal, loadHeaderFooter } from "./utils.mjs";


await loadHeaderFooter()
getCartItemsTotal()
const dataSource = new ExternalServices();

const element = document.querySelector(".product-list");

const productList = new ProductList("Tents", dataSource, element);



productList.init();


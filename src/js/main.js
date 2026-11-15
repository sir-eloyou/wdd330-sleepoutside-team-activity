import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getCartItemsTotal, loadHeaderFooter } from "./utils.mjs";


await loadHeaderFooter()
getCartItemsTotal()
const dataSource = new ProductData();

const element = document.querySelector(".product-list");

const productList = new ProductList("Tents", dataSource, element);



productList.init();


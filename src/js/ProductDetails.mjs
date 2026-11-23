
import { getLocalStorage, setLocalStorage, getCartItemsTotal} from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {} ;
        this.dataSource = dataSource;

    }

    async init() {

        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails()
        getCartItemsTotal()

        

        document.getElementById("addToCart")
            .addEventListener("click", this.addProductToCart.bind(this));


    }



    addProductToCart() {
        let products = getLocalStorage("so-cart") || [];

        const existingProduct = products.find(
            item => item.Id === this.product.Id
        );

        if (existingProduct) {
        
            existingProduct.quantity = (existingProduct.quantity || 1) + 1;
        } else {
            
            this.product.quantity = 1;
            products.push(this.product);
        }

        
        setLocalStorage("so-cart", products);

        
        getCartItemsTotal();
    }

    renderProductDetails() {
        productDetailsTemplate(this.product)
    }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Images.PrimaryLarge;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = product.FinalPrice;
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}
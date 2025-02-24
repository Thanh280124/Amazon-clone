import { cart, removeCart,calculateCartQuantity, updataQuantity, updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { deleiveryOptions } from "../data/deliveryOption.js";
const today = dayjs();
const deleiveryDate = today.add(7,'days');

console.log(deleiveryDate.format('dddd, MMMM D'));


let cartSummaryHTML = '';
cart.forEach((cartItem) =>{
    const productId = cartItem.productId;
    let matchingProduct;
    products.forEach((product) => {
        if(product.id === productId){
            matchingProduct = product
        }
    })

    const deliveryOptionsId = cartItem.deleiveryOptionsId;
    console.log(deliveryOptionsId);
    

    let deliveryOption;
    deleiveryOptions.forEach((option)=>{
      if(option.id === deliveryOptionsId){
        deliveryOption = option;
      }
    });

    
    const today = dayjs();
    const deleiveryDate = today.add(deliveryOption.deleiveryDays,'days')
    const dateString = deleiveryDate.format('dddd, MMMM D');

  cartSummaryHTML +=  `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  ${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link"
                  data-product-id = "${matchingProduct.id}">
                    Update
                  </span>
                  <input type="number" class="quantity-input js-quantity-input-${matchingProduct.id}">
                  <span class="save-quantity-link link-primary" data-product-id = "${matchingProduct.id}">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" 
                  data-product-id = "${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deleiveryOptionsHTML(matchingProduct,cartItem)}
              </div>
            </div>
          </div>
          `
});

function deleiveryOptionsHTML(matchingProduct,cartItem){
  let html ='';
  deleiveryOptions.forEach((deleiveryOption) =>{
    const today = dayjs();
    const deleiveryDate = today.add(deleiveryOption.deleiveryDays,'days');
    const dateString = deleiveryDate.format('dddd, MMMM D');
    const priceString = deleiveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deleiveryOption.priceCents)}`
    const isChecked = deleiveryOption.id === cartItem.deleiveryOptionsId;
    html +=  `        <div class="delivery-option js-delivery-option"
                        data-product-id = "${matchingProduct.id}" data-delivery-option-id = "${deleiveryOption.id}">
                  <input type="radio"
                    ${isChecked ? 'checked': ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      ${priceString} - Shipping
                    </div>
                  </div>
                </div>`
  })
  return html;
}

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link').forEach((links) =>{
links.addEventListener('click', () =>{
  const productId = links.dataset.productId;
  removeCart(productId);
 const container = document.querySelector(`.js-cart-item-container-${productId}`)
  container.remove()
 updateCartQuantity();
})
})

document.querySelectorAll('.js-delivery-option').forEach((element) =>{
  element.addEventListener('click',() =>{
    const {productId,deliveryOptionId} = element.dataset
updateDeliveryOption(productId,deliveryOptionId);
  })
})

function updateCartQuantity(){
  let cartQuantity = calculateCartQuantity();
  document.querySelector('.js-quantity-link').innerHTML = `${cartQuantity} items`
}
updateCartQuantity();


document.querySelectorAll('.js-update-link').forEach((updateBtn) =>{
updateBtn.addEventListener('click',() =>{
   const productId = updateBtn.dataset.productId;
   const container = document.querySelector(
    `.js-cart-item-container-${productId}`
  );
  container.classList.add('is-editing-quantity');
})
})


document.querySelectorAll('.save-quantity-link').forEach((saveBtn) =>{
  saveBtn.addEventListener('click',() =>{
    const productId = saveBtn.dataset.productId;
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.classList.remove('is-editing-quantity');
   const input = document.querySelector(`.js-quantity-input-${productId}`);
    const newQuantity = Number(input.value);
    if (newQuantity < 0 || newQuantity >= 1000) {
      alert('Quantity must be at least 0 and less than 1000');
      return;
    }
    updataQuantity(productId,newQuantity);
    const quantityLabel = document.querySelector(
      `.js-quantity-label-${productId}`
    );
    quantityLabel.innerHTML = newQuantity;
    updateCartQuantity();
  })
  })
  
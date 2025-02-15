export const cart = []

export function addtoCart(productId){
    let matchingItem;
    cart.forEach((cartItem) => {
        if(productId === cartItem.productId){
            matchingItem = cartItem
        }
    });
  
    if(matchingItem){
        matchingItem.quantity++
    }else{
        cart.push({
            productId: productId,
            quantity : 1
        })
    }
  
  }
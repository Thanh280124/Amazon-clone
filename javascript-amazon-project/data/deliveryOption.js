export const deleiveryOptions = [
    {
        id: '1',
        deleiveryDays: 7,
        priceCents: 0
    },{
        id: '2',
        deleiveryDays: 3,
        priceCents: 499
    },
    {
        id: '3',
        deleiveryDays: 1,
        priceCents: 999
    }
]

export function getDeliveryOption(deliveryOptionsId){
    let deliveryOption;
    deleiveryOptions.forEach((option)=>{
      if(option.id === deliveryOptionsId){
        deliveryOption = option;
      }
    });

    return deliveryOption || deleiveryOptions[0]
}
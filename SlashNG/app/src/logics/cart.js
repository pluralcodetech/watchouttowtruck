import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../redux/store';
import {updateCartAction} from '../redux/actions/index';

const updateProductQuantity = async (data) => {
  let cart = await AsyncStorage.getItem('userCart');
  let totalQuantity = 0;
  let updatedProducts = [];

  if (cart) {
    let foundProduct = false;
    cart = JSON.parse(cart);
    await cart.products.forEach((item) => {
      if (item.category == data.category && item.id == data.id) {
        totalQuantity = totalQuantity + parseInt(data.quantity);
        updatedProducts = [
          ...updatedProducts,
          {...item, quantity: data.quantity, price: data.price},
        ];
      } else {
        totalQuantity = totalQuantity + parseInt(item.quantity);
        updatedProducts = [...updatedProducts, item];
      }
      if (item.id == data.id) {
        foundProduct = true;
      }
    });

    cart = {totalQuantity, products: updatedProducts};
    //add the product to cart if not found
    if (foundProduct == false) {
      cart = {
        totalQuantity: totalQuantity + parseInt(data.quantity),
        products: [...updatedProducts, data],
      };
    }

    await AsyncStorage.setItem('userCart', JSON.stringify(cart));
    store.dispatch(updateCartAction(cart));
  }
};
//clear all products from cart
const clearCart = async () => {
  const cart = {totalQuantity: 0, products: []};
  await AsyncStorage.setItem('userCart', JSON.stringify(cart));
  store.dispatch(updateCartAction(cart));
};

//remove products from cart
const removeFromCart = async (data) => {
  let cart = await AsyncStorage.getItem('userCart');
  if (cart) {
    cart = JSON.parse(cart);
    let totalQuantity = 0;

    let updatedProducts = cart.products.filter((item) => {
      //filter the product out
      if (item.id != data.id) {
        return (totalQuantity = totalQuantity + parseInt(item.quantity));
      }
    });
    cart = {totalQuantity, products: updatedProducts};
    //save to user device
    await AsyncStorage.setItem('userCart', JSON.stringify(cart));

    store.dispatch(updateCartAction(cart));
  }
};

const addToCart = async (data) => {
  //get the cart from the user device
  let cart = await AsyncStorage.getItem('userCart');

  if (cart) {
    cart = JSON.parse(cart);
    let totalQuantity = 0;
    //check if the products already exist
    let duplicateProducts = false;
    let updatedProducts = [];
    if (cart.products.length > 0) {
      await cart.products.forEach((item) => {
        if (item.category == data.category && item.id == data.id) {
          duplicateProducts = true;
          //check if total quantity is up to 10
          let checkedQuatity =
            item.quantity + parseInt(data.quantity) > 10
              ? 10
              : item.quantity + parseInt(data.quantity);

          totalQuantity = totalQuantity + checkedQuatity;
          const price = parseInt(item.mainPrice * checkedQuatity);
          console.log(price);
          updatedProducts = [
            ...updatedProducts,
            {
              ...item,
              quantity: checkedQuatity,
              price,
            },
          ];
        } else {
          // check the quanity for the product
          totalQuantity = totalQuantity + parseInt(item.quantity);
          updatedProducts = [...updatedProducts, item];
        }
      });

      //add to the product array if there is no duplicate product
      if (!duplicateProducts) {
        totalQuantity = totalQuantity + parseInt(data.quantity);
        updatedProducts = [...updatedProducts, data];
      }
      cart = {totalQuantity, products: updatedProducts};
    } else {
      cart = {totalQuantity: data.quantity, products: [data]};
    }
    //save to user device
    await AsyncStorage.setItem('userCart', JSON.stringify(cart));

    store.dispatch(updateCartAction(cart));
  }
};

//get cart for user device and dispatch the data
const getCart = async () => {
  let cart = await AsyncStorage.getItem('userCart');
  //check if they are some items
  if (!cart) {
    cart = {totalQuantity: 0, products: []};
    //save and dispatch an empty array
    await AsyncStorage.setItem('userCart', JSON.stringify(cart));
  } else {
    //parse it to json
    cart = JSON.parse(cart);
  }

  store.dispatch(updateCartAction(cart));
};

const getCartTotalAmount = async () => {
  let cart = await AsyncStorage.getItem('userCart');
  cart = JSON.parse(cart);

  let price = 0;
  cart.products.forEach((product) => {
    price = parseInt(price) + parseInt(product.price);
  });

  return price;
};

export {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateProductQuantity,
  getCartTotalAmount,
};

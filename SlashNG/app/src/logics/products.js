import axios from 'axios';
import qs from 'query-string';
import {Alert} from 'react-native';
import {SHOP_MART_API} from '../const/api';
import {updateSavedItems} from '../redux/actions';
import store from '../redux/store';

const saveOrRemoveProducts = async ({
  id,
  token,
  productId,
  state,
  setState,
}) => {
  //showloading
  setState({...state, showPreloader: true});

  try {
    let res = await axios({
      url: SHOP_MART_API,
      method: 'POST',
      data: qs.stringify({
        user: id,
        token: token,
        cmd: 'save-item',
        pid: productId,
      }),
    });

    const resData = res.data;

    if (resData.status === '200') {
      //close loading and update state
      let product = state.product;

      //interchange the is_saved
      const is_saved = state.product.is_saved == '1' ? '0' : '1';
      product = {...product, is_saved};

      setState({...state, showPreloader: false, product});
      Alert.alert('Success', resData.message);

      //get product from store
      const productFrmStore = store.getState().savedItems.products;

      const newProducts = productFrmStore.filter(
        (product) => product.id != productId,
      );

      dispatchItemsTostore({products: newProducts});
    } else {
      //hide loader
      setState({...state, showPreloader: false});

      //how error message
      Alert.alert('Error', 'Something went wrong.');
    }
  } catch (error) {
    //hide loader
    setState({...state, showPreloader: false});
    //show error alert
    Alert.alert('Error', 'Something went wrong.');
  }
};

const dispatchItemsTostore = (products) => {
  store.dispatch(updateSavedItems(products));
};

export {saveOrRemoveProducts, dispatchItemsTostore};

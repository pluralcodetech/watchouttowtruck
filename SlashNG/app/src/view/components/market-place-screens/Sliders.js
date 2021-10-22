import React from 'react';
import axios from 'axios';
import qs from 'query-string';
import {SliderBox} from 'react-native-image-slider-box';
import {View} from 'react-native';
import {LIGHT, SECONDARY_COLOR} from '../../../styles/colors';
import {SHOP_MART_API} from '../../../const/api';

const Sliders = () => {
  const getSlider = async () => {
    try {
      let res = await axios({
        url: SHOP_MART_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'fetch',
          type: 'sliders',
        }),
      });

      let resData = res.data;
      if (resData.status == '200') {
        let images = resData.sliders.map((item) => item.img);
        setState({...state, sliders: images, loading: false});
      } else {
        //rerun after 5sec
        setTimeout(getSlider, 5000);
      }
    } catch (error) {
      //rerun after 5sec
      setTimeout(getSlider, 5000);
    }
  };
  const [state, setState] = React.useState({
    loading: true,
    sliders: [],
  });

  React.useEffect(() => {
    getSlider();
  }, [0]);
  return (
    <View style={{marginBottom: 13}}>
      <SliderBox
        circleLoop={true}
        autoplay={true}
        dotStyle={{display: 'none'}}
        sliderBoxHeight={150}
        images={state.sliders}
      />
    </View>
  );
};

export default Sliders;

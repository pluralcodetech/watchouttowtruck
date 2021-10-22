const formatPrice = price => {
  if (price) {
    return '$' + price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  } else {
    return '$0';
  }
};

export default formatPrice;

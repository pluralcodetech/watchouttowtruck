const FormatNumber = (num) => {
  if (!num) {
    return '';
  } else {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
};

const Formatcurrency = (num = '') => {
  if (!num) {
    return '';
  } else {
    return num?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
};

export {Formatcurrency, FormatNumber};

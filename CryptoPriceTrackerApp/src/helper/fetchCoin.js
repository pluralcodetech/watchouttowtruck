const fetchCoin = async () => {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=true',
    );
    const resData = await res.json();
    return resData;
  } catch (error) {
    throw error;
  }
};

export default fetchCoin;

const SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/alwaysbegrowing/arbor-v1";

//Make POST request to GraphQL to obtain collateral token info
async function bondGraph(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

//GraphQL query
bondGraph(SUBGRAPH_URL, {
  query: `{
    bonds {
      id
      collateralToken {
        id
        decimals
      }
      collateralTokenAmount
    }
  }`,
}).then(async (data) => {
  let collateral = 0;
  //Loop through each bond to calculate the collateral amount for each bond individually
  const getTokenPrice = async (element) => {
    //Contract address of the collateral token used
    const collateralToken = element.collateralToken.id;
    //Amount of tokens of the collateral token
    const collateralAmount = element.collateralTokenAmount;
    //Number of decimals for collateral token
    const decimals = element.collateralToken.decimals;
    //Correct the collateral amount based on the number of decimals
    const updatedCollateralAmount = collateralAmount / 10 ** decimals;
    //Make GET request to CoinGecko to get the current price of the collateral token
    const COINGECKO_TOKEN_PRICE_URL = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?vs_currencies=usd&contract_addresses=${collateralToken}`;
    const tokenPrice = await fetch(COINGECKO_TOKEN_PRICE_URL);
    const tokenPriceResponse = await tokenPrice.json();
    //USD for 1 collateral token
    const usd = tokenPriceResponse?.[collateralToken].usd;
    //Price of the total collateral for one bond
    const collateralUsd = usd * updatedCollateralAmount;

    return collateralUsd;
  };
  for (let i = 0; i < data.data.bonds.length; i++) {
    collateral += await getTokenPrice(data.data.bonds[i]);
  }
  //Add element to DOM
  const tvl = document.getElementById("tvl");
  tvl.innerHTML = "$" + collateral.toLocaleString();
});

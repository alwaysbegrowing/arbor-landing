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
bondGraph("https://api.thegraph.com/subgraphs/name/alwaysbegrowing/arbor-v1", {
  query:
    "{\n  bonds {\n    id\n    collateralToken {\n      id\n      decimals\n    }\n    collateralTokenAmount\n  }\n}",
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
    const tokenPrice = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/ethereum?vs_currencies=usd&contract_addresses=${collateralToken}`
    );
    const tokenPriceResponse = await tokenPrice.json();
    //USD for 1 collateral token
    const usd = tokenPriceResponse?.[collateralToken].usd;
    //Price of the total collateral for one bond
    const collateralUsd = usd * updatedCollateralAmount;
    collateral += collateralUsd;

    return collateral;
  };
  for (let i = 0; i < data.data.bonds.length; i++) {
    collateral += await getTokenPrice(data.data.bonds[i]);
  }
  //Add element to DOM
  const ddUpdate = document.getElementById("collateral");
  ddUpdate.appendChild(
    document.createTextNode("$" + collateral.toLocaleString())
  );
});

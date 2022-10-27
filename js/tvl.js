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
bondGraph("https://api.thegraph.com/subgraphs/name/alwaysbegrowing/arbor-v1", {
  query:
    "{\n  bonds {\n    id\n    collateralToken {\n      id\n      decimals\n    }\n    collateralTokenAmount\n  }\n}",
}).then(async (data) => {
  let collateral = 0;
  //Loop through each bond to calculate the collateral amount for each bond individually

  const balances = data.data.bonds.forEach(async (element) => {
    //Contract address of the collateral token used
    const collateralToken = element.collateralToken.id;
    //Amount of tokens of the collateral token
    const collateralAmount = element.collateralTokenAmount;
    //Number of decimals for collateral token
    const decimals = element.collateralToken.decimals;
    //Correct the collateral amount based on the number of decimals
    const updatedCollateralAmount = collateralAmount / 10 ** decimals;
    //Make GET request to CoinGecko to get the current price of the collateral token
    const tokenPrice = async () => {
      await fetch(
        `https://api.coingecko.com/api/v3/simple/token_price/ethereum?vs_currencies=usd&contract_addresses=${collateralToken}`
      )
        .then((response) => response.json())
        //Pull out the price in USD
        .then((data) => {
          const usd = data?.[collateralToken].usd;
          //Price of the total collateral for one bond
          const collateralUsd = usd * updatedCollateralAmount;
          console.log({ collateralUsd });
          //Increment the total collateral by the current bond collateral amount
          collateral += collateralUSD;
          return {
            collateral,
          };
        });
    };
    tokenPrice();
  });

  //Manually make promise and wait for it
  console.log(collateral);
});

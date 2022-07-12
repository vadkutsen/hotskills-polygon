const networks = {
  testnet: {
    chainId: "0x13881",
    chainName: "Polygon Mumbai Testnet",
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    nativeCurrency: {
      name: "Mumbai Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
};

export { networks };

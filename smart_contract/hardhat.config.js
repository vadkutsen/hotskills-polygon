require('@nomiclabs/hardhat-waffle');
require('dotenv').config();
require('solidity-coverage');

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: '0.8.17',
  // defaultNetwork: "matic",
  networks: {
    hardhat: {},
    // ropsten: {
    //   url: 'https://eth-ropsten.alchemyapi.io/v2/z4WpA8UKgqnwbTYmrZu15yCOiijBKaRv',
    //   accounts: ['2f99db8cdb04655028eee1dc98230925202f6b3e010e43fad2883b4bea90a1a3'],
    // },
    // goerli: {
    //   url: 'https://eth-goerli.alchemyapi.io/v2/h8ZOsayZE45iyO5Diz3U-Y66wMkYAlRL',
    //   accounts: ['6f7da570952554e686c9785a7c66ba85588ed59f45b953183f7da87b1fc2317e'],
    //   gasPrice: 2100000000,
    // },
    // mumbai: {
    //   url: process.env.STAGING_ALCHEMY_KEY,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
    matic: {
      url: "https://rpc-mumbai.matic.today/",
      accounts: [process.env.PRIVATE_KEY],
      maxPriorityFeePerGas: 40000000000
    }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    viaIR: true,
  },
};
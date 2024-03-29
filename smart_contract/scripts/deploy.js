const main = async () => {
  const platformFactory = await hre.ethers.getContractFactory("PlatformFactory");
  const platformContract = await platformFactory.deploy();

  await platformContract.deployed();

  console.log("Platform address: ", platformContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

runMain();
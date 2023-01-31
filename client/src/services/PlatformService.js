import { ethers } from "ethers";
import { contract } from "./Web3Service";

const { ethereum } = window;

export const getBalance = async ({ address }) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const fetchedBalance = await provider.getBalance(address);
  ethers.utils.formatEther(fetchedBalance);
};

export const getPlatformFee = async () => {
  if (ethereum) {
    try {
      const fetchedFee = await contract.platformFeePercentage();
      return fetchedFee;
    } catch (error) {
      console.log(error);
      // alert(error.message);
    }
  } else {
    console.log("Ethereum is not present");
  }
};

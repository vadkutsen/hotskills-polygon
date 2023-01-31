import { ethers } from "ethers";
import { contractAddress } from "../utils/constants";
import contractABI from "../utils/contractABI.json";

const { ethereum } = window;

export const contract = () => {
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const platformContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    return platformContract;
  }
};

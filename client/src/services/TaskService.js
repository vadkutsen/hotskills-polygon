import { createContext, useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import contractABI from "../utils/contractABI.json";
import {
  TaskTypes,
  address0,
  TaskStatuses,
  Categories,
  contractAddress,
} from "../utils/constants";
import { PlatformContext } from "../context/PlatformContext";

const { ethereum } = window;
const createEthereumContract = () => {
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

const contract = createEthereumContract();

export const getTask = async (id) => {
  // const { notify, fee, setIsLoading, setNotifications } =
  //   useContext(PlatformContext);
  if (ethereum) {
    try {
      // setIsLoading(true);
      const fetchedTask = await contract.getTask(id);
      // setIsLoading(false);
      return fetchedTask;
    } catch (error) {
      console.log(error);
      alert(error.message);
      // setIsLoading(false);
    }
  } else {
    console.log("Ethereum is not present");
  }
};

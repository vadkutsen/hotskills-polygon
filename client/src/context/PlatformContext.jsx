import { createContext, useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";
import { address0, contractAddress } from "../utils/constants";
import contractABI from "../utils/contractABI.json";
import { networks } from "../utils/networks";

export const PlatformContext = createContext();

const MessageDisplay = ({ message, hash }) => (
  <div className="w-full">
    <p>{message}</p>
    {hash && (
      <a
        className="text-[#6366f1]"
        href={`${networks.testnet.blockExplorerUrls[0]}/tx/${hash}`}
        target="_blank"
        rel="noreferrer"
      >
        Check in etherscan
      </a>
    )}
  </div>
);
const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const platformContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return platformContract;
};

export const PlatformProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [fee, setFee] = useState(0);
  const [fetchedRating, setFetchedRating] = useState(0);
  // const [contract, setContract] = useState(undefined);
  const { currentAccount, networkId } = useContext(AuthContext);

  const notify = (message, hash) => toast.success(<MessageDisplay message={message} hash={hash} />, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  const getBalance = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const fetchedBalance = await provider.getBalance(currentAccount);
    const balanceInEth = ethers.utils.formatEther(fetchedBalance);
    setBalance(balanceInEth);
  };

  const getPlatformFee = async () => {
    if (ethereum) {
      try {
        const contract = createEthereumContract();
        const fetchedFee = await contract.platformFeePercentage();
        setFee(fetchedFee);
      } catch (error) {
        console.log(error);
        // alert(error.message);
      }
    } else {
      console.log("Ethereum is not present");
    }
  };

  const rateUser = async (address, rating) => {
    if (ethereum && address) {
      try {
        setIsLoading(true);
        const contract = createEthereumContract();
        const transaction = await contract.rateUser(address, rating);
        console.log(`Success - ${transaction.hash}`);
        setIsLoading(false);
        // window.location.reload();
        notify("Rating saved successfully.");
      } catch (error) {
        console.log(error.message);
        // alert(
        //   "Oops! Something went wrong. See the browser console for details."
        // );
        setIsLoading(false);
      }
    } else {
      console.log("No Tron object");
    }
  };

  const getRating = async (address) => {
    if (ethereum && address) {
      try {
        const contract = createEthereumContract();
        const r = await contract.getRating(address);
        setFetchedRating(r);
      } catch (error) {
        console.log(error);
        // alert(error.message);
      }
    } else {
      console.log("Ethereum is not present");
    }
  };

  useEffect(() => {
    if (networkId === networks.testnet.chainId) {
      getPlatformFee();
      getRating(currentAccount);
      getBalance();
    }
  }, [currentAccount, networkId]);

  // Event listeners

  useEffect(() => {
    const contract = createEthereumContract();
    const onFeeUpdated = (newFee) => {
      setFee(newFee.toNumber());
    };
    if (ethereum) {
      contract.on("FeeUpdated", onFeeUpdated);
    }
    return () => {
      if (contract) {
        contract.off("FeeUpdated", onFeeUpdated);
      }
    };
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        MessageDisplay,
        notify,
        fee,
        isLoading,
        setIsLoading,
        rateUser,
        getRating,
        fetchedRating,
        address0,
        balance
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

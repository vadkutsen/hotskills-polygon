import { createContext, useState, useEffect } from "react";
import { networks } from "../utils/networks";

export const AuthContext = createContext();
const { ethereum } = window;

export const AuthProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [networkId, setNetworkId] = useState("");

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== currentAccount) {
      setCurrentAccount(accounts[0]);
    }
  }

  const checkIfWalletIsConnected = () => {
    if (!ethereum) {
      alert("MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html");
      return;
    }

    ethereum
      .request({ method: "eth_accounts" })
      .then(handleAccountsChanged)
      .catch((err) => {
        // Some unexpected error.
        // For backwards compatibility reasons, if no accounts are available,
        // eth_accounts will return an empty array.
        console.error(err);
      });
    ethereum.request({ method: "eth_chainId" }).then((c) => setNetworkId(c));
    // Reload the page when they change networks
    ethereum.on("chainChanged", () => window.location.replace("/"));
    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("disconnect", () => window.location.replace("/"));
  };

  const connectWallet = () => {
    try {
      if (!ethereum) {
        alert("MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html");
        return;
      }
      // Fancy method to request access to account.
      ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then(handleAccountsChanged)
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log("Please connect to MetaMask.");
          } else {
            console.error(err);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const switchNetwork = async () => {
    if (ethereum) {
      try {
        // Try to switch to the Aurora testnet
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: networks.testnet.chainId }], // Check networks.js for hexadecimal network ids
        });
      } catch (error) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [networks.testnet],
            });
          } catch (err) {
            console.log(err);
          }
        }
        console.log(error);
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert(
        "MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html"
      );
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        connectWallet,
        switchNetwork,
        networkId,
        currentAccount,
        setCurrentAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

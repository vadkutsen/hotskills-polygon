import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import { networks } from "../utils/networks";

import { contractABI, contractAddress } from "../utils/constants";

export const PlatformContext = React.createContext();

const { ethereum } = window;
const address0 = "0x0000000000000000000000000000000000000000";

const ProjectType = {
  0: "First Come First Serve",
  1: "Author Selected",
};

function MessageDisplay({ message, hash }) {
  return (
    <div className="w-full">
      <p>{message}</p>
      {hash && (
        <a
          className="text-[#6366f1]"
          href={`${networks.testnet.blockExplorerUrls[0]}/tx/${hash}`}
          target="_blank"
          rel="noreferrer"
        >
          Check on polygonscan
        </a>
      )}
    </div>
  );
}

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
  const [formData, setformData] = useState({
    title: "",
    description: "",
    projectType: "0",
    reward: 0,
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [networkId, setNetworkId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState([]);
  const [fee, setFee] = useState(0);
  const [balance, setBalance] = useState(0);
  const [fetchedRating, setFetchedRating] = useState(0);
  const [ipfsUrl, setIpfsUrl] = useState("");

  const notify = (message, hash) =>
    toast.success(<MessageDisplay message={message} hash={hash} />, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const onUploadHandler = async (event) => {
    const client = new Web3Storage({ token: import.meta.env.VITE_WEB3_STORAGE_TOKEN });
    event.preventDefault();
    const form = event.target;
    const { files } = form[0];
    if (!files || files.length === 0) {
      return alert("No files selected");
    }
    setIsLoading(true);
    const rootCid = await client.put(files);
    const info = await client.status(rootCid);
    // const res = await client.get(rootCid);
    const url = `https://${info.cid}.ipfs.w3s.link`;
    form.reset();
    setIpfsUrl(url);
    setIsLoading(false);
    notify("File successfully uploaded to IPFS.");
  };

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) {
      alert("Make sure you have MetaMask! -> https://metamask.io/");
      return;
    }
    // Check if we're authorized to access the user's wallet
    const accounts = await ethereum.request({ method: "eth_accounts" });
    // Users can have multiple authorized accounts, we grab the first one if its there!
    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
    } else {
      console.log("No authorized accounts found");
    }
    const chainId = await ethereum.request({ method: "eth_chainId" });
    setNetworkId(chainId);
    // Reload the page when they change networks
    function handleChainChanged() {
      window.location.reload();
    }
    ethereum.on("chainChanged", handleChainChanged);
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }
      // Fancy method to request access to account.
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const switchNetwork = async () => {
    if (ethereum) {
      try {
        // Try to switch to the Mumbai testnet
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

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getBalance = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const fetchedBalance = await provider.getBalance(currentAccount);
    const balanceInEth = ethers.utils.formatEther(fetchedBalance);
    setBalance(balanceInEth);
  };

  const getAllProjects = async () => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const availableProjects = await platformContract.getAllProjects();
        const structuredProjects = availableProjects
          .filter((item) => item.title && item.title !== "")
          .map((item) => ({
            id: item.id.toNumber(),
            title: item.title,
            description: item.description,
            projectType: ProjectType[item.projectType],
            createdAt: new Date(
              item.createdAt.toNumber() * 1000
            ).toLocaleString(),
            author: item.author,
            candidates: item.candidates,
            assignee: item.assignee === address0 ? "Unassigned" : item.assignee,
            completedAt:
              item.completedAt > 0
                ? new Date(item.completedAt.toNumber() * 1000).toLocaleString()
                : "Not completed yet",
            reward: parseInt(item.reward, 10) / 10 ** 18,
            result: item.result,
          }));
        setProjects(structuredProjects);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const getPlatformFee = async () => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const fetchedFee = await platformContract.platformFeePercentage();
        setFee(fetchedFee);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const getRating = async (address) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const r = await platformContract.getRating(address);
        setFetchedRating(r);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const getProject = async (id) => {
    setIsLoading(true);
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const fetchedProject = await platformContract.getProject(id);
        const structuredProject = {
          id: fetchedProject.id.toNumber(),
          title: fetchedProject.title,
          description: fetchedProject.description,
          projectType: ProjectType[fetchedProject.projectType],
          createdAt: new Date(
            fetchedProject.createdAt.toNumber() * 1000
          ).toLocaleString(),
          author: fetchedProject.author.toString().toLowerCase(),
          candidates: fetchedProject.candidates,
          assignee:
            fetchedProject.assignee === address0
              ? "Unassigned"
              : fetchedProject.assignee.toString().toLowerCase(),
          completedAt:
            fetchedProject.completedAt > 0
              ? new Date(
                  fetchedProject.completedAt.toNumber() * 1000
                ).toLocaleString()
              : "Not completed yet",
          reward: parseInt(fetchedProject.reward, 10) / 10 ** 18,
          result: fetchedProject.result,
        };
        setProject(structuredProject);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
    setIsLoading(false);
  };

  const addProject = async () => {
    try {
      if (ethereum) {
        const { title, description, projectType, reward } = formData;
        const platformContract = createEthereumContract();
        const feeAmount = (reward / 100) * fee;
        const totalAmount = parseFloat(reward) + parseFloat(feeAmount);
        const transactionHash = await platformContract.addProject(
          {
            title,
            description,
            projectType,
            reward: ethers.utils.parseEther(reward),
          },
          {
            value: ethers.utils.parseEther(totalAmount.toString()),
          }
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        window.location.replace("/");
        notify("New task added.", transactionHash.hash);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const applyForProject = async (id) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const transactionHash = await platformContract.applyForProject(
          ethers.BigNumber.from(id)
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        await getAllProjects();
        await getProject(id);
        notify("Successfully applied.", transactionHash.hash);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const submitResult = async (id, result) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const transactionHash = await platformContract.submitResult(
          ethers.BigNumber.from(id),
          result
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        await getAllProjects();
        await getProject(id);
        notify("Result submitted.", transactionHash.hash);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const deleteProject = async (id) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const transactionHash = await platformContract.deleteProject(
          ethers.BigNumber.from(id)
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        await getAllProjects();
        notify("Task deleted.", transactionHash.hash);
        window.location.replace("/");
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const assignProject = async (id, candidate) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const transactionHash = await platformContract.assignProject(
          ethers.BigNumber.from(id),
          candidate
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        await getAllProjects();
        await getProject(id);
        notify("Task assigned.", transactionHash.hash);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const unassignProject = async (id) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const transactionHash = await platformContract.unassignProject(
          ethers.BigNumber.from(id)
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        await getAllProjects();
        await getProject(id);
        notify("Task unassigned.", transactionHash.hash);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  const completeProject = async (id, newRating) => {
    try {
      if (ethereum) {
        const platformContract = createEthereumContract();
        const transactionHash = await platformContract.completeProject(
          ethers.BigNumber.from(id),
          newRating
        );
        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);
        await getAllProjects();
        await getProject(id);
        notify("Task completed.", transactionHash.hash);
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert("Oops! Something went wrong. See the browser console for details.");
    }
  };

  // This will run any time currentAccount or network are changed
  useEffect(() => {
    checkIfWalletIsConnected();
    if (networkId === networks.testnet.chainId) {
      getBalance();
      getPlatformFee();
      getRating(currentAccount);
      getAllProjects();
    }
  }, [currentAccount, networkId]);

  // Events listeners

  useEffect(() => {
    const platformContract = createEthereumContract();
    const onTaskUpdated = (p) => {
      const structuredProject = {
        id: p.id.toNumber(),
        title: p.title,
        description: p.description,
        projectType: ProjectType[p.projectType],
        createdAt: new Date(p.createdAt.toNumber() * 1000).toLocaleString(),
        author: p.author.toString().toLowerCase(),
        candidates: p.candidates,
        assignee:
          p.assignee === address0
            ? "Unassigned"
            : p.assignee.toString().toLowerCase(),
        completedAt:
          p.completedAt > 0
            ? new Date(p.completedAt.toNumber() * 1000).toLocaleString()
            : "Not completed yet",
        reward: parseInt(p.reward, 10) / 10 ** 18,
        result: p.result,
      };
      setProject(structuredProject);
    };
    if (ethereum) {
      platformContract.on("ProjectUpdated", onTaskUpdated);
    }
    return () => {
      if (platformContract) {
        platformContract.off("ProjectUpdated", onTaskUpdated);
      }
    };
  }, []);

  useEffect(() => {
    const platformContract = createEthereumContract();
    const onNewTask = (task) => {
      setProjects((prevState) => [
        ...prevState,
        {
          id: task.id.toNumber(),
          title: task.title,
          description: task.description,
          projectType: ProjectType[task.projectType],
          createdAt: new Date(
            task.createdAt.toNumber() * 1000
          ).toLocaleString(),
          author: task.author,
          candidates: task.candidates,
          assignee: task.assignee === address0 ? "Unassigned" : task.assignee,
          completedAt:
            task.completedAt > 0
              ? new Date(task.completedAt.toNumber() * 1000).toLocaleString()
              : "Not completed yet",
          reward: parseInt(task.reward, 10) / 10 ** 18,
          result: task.result,
        },
      ]);
    };
    if (ethereum) {
      platformContract.on("ProjectAdded", onNewTask);
    }
    return () => {
      if (platformContract) {
        platformContract.off("ProjectAdded", onNewTask);
      }
    };
  }, []);

  useEffect(() => {
    const platformContract = createEthereumContract();
    const onTaskDeleted = (id) => {
      setProjects((current) => current.filter((p) => p.id !== id.toNumber()));
    };
    if (ethereum) {
      platformContract.on("ProjectDeleted", onTaskDeleted);
    }
    return () => {
      if (platformContract) {
        platformContract.off("ProjectDeleted", onTaskDeleted);
      }
    };
  }, []);

  useEffect(() => {
    const platformContract = createEthereumContract();
    const onFeeUpdated = (newFee) => {
      setFee(newFee.toNumber());
    };
    if (ethereum) {
      platformContract.on("FeeUpdated", onFeeUpdated);
    }
    return () => {
      if (platformContract) {
        platformContract.off("FeeUpdated", onFeeUpdated);
      }
    };
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        connectWallet,
        switchNetwork,
        networkId,
        fee,
        projects,
        project,
        currentAccount,
        balance,
        isLoading,
        getAllProjects,
        getProject,
        addProject,
        applyForProject,
        submitResult,
        deleteProject,
        assignProject,
        unassignProject,
        completeProject,
        handleChange,
        getRating,
        fetchedRating,
        formData,
        address0,
        onUploadHandler,
        ipfsUrl,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

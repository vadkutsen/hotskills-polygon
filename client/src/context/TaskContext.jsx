import { createContext, useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import contractABI from "../utils/contractABI.json";
import { TaskTypes, address0, TaskStatuses, Categories, contractAddress } from "../utils/constants";
import { PlatformContext } from "./PlatformContext";
import { AuthContext } from "./AuthContext";
import { networks } from "../utils/networks";

export const TaskContext = createContext();

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

export const TaskProvider = ({ children }) => {
  const [formData, setformData] = useState({
    category: Categories[0],
    title: "",
    description: "",
    taskType: 0,
    reward: 0,
    assignee: address0
  });

  const [tasks, setTasks] = useState("");
  const [task, setTask] = useState([]);
  const { notify, fee, setIsLoading } = useContext(PlatformContext);
  const { currentAccount, networkId } = useContext(AuthContext);
  const [ipfsUrl, setIpfsUrl] = useState("");

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
    const url = `https://${info.cid}.ipfs.w3s.link/${files[0].name}`;
    form.reset();
    setIpfsUrl(url);
    setIsLoading(false);
    notify("File successfully uploaded to IPFS.");
  };

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  function formatTask(t) {
    return ({
      id: t.id.toNumber(),
      category: t.category,
      title: t.title,
      description: t.description,
      taskType: TaskTypes[t.taskType],
      createdAt: new Date(
        t.createdAt.toNumber() * 1000
      ).toLocaleDateString(),
      author: t.author,
      candidates:
        t.candidates.map((c) => c.toLowerCase()),
      assignee:
        t.assignee === address0
          ? "Unassigned"
          : t.assignee,
      completedAt:
        t.completedAt > 0
          ? new Date(
            t.completedAt.toNumber() * 1000
          ).toLocaleDateString()
          : "Not completed yet",
      reward: parseInt(t.reward, 10) / 10 ** 18,
      result: t.result,
      status: TaskStatuses[t.status],
      lastStatusChangeAt: new Date(
        t.lastStatusChangeAt.toNumber() * 1000
      ).toLocaleDateString(),
      changeRequests: t.changeRequests,
    });
  }

  const formatUser = async (address) => {
    if (ethereum && address) {
      try {
        const user = {};
        const contract = createEthereumContract();
        const fetchedProfile = await contract.getProfile(address);
        user.profile = fetchedProfile;
        user.address = address;
        const fetchedRating = await contract.getRating(address);
        user.rating = fetchedRating;
        return user;
      } catch (error) {
        console.log(error);
        // alert(error.message);
      }
    } else {
      console.log("Ethereum is not present");
    }
  };

  const composeCandidateProfiles = async (candidates) => {
    const p = [];
    if (candidates) {
      for (let i = 0; i < candidates.candidates.length; i += 1) {
        const c = await formatUser(candidates.candidates[i]);
        p.push(c);
      }
      return p;
    }
  };

  const composeAuthorProfile = async (address) => {
    const p = await formatUser(address);
    return p;
  };

  const getAllTasks = async () => {
    try {
      if (ethereum) {
        setIsLoading(true);
        const contract = createEthereumContract();
        const availableTasks = await contract.getAllTasks();
        const structuredTasks = availableTasks
          .filter((item) => item.title && item.title !== "")
          .map((item) => (formatTask(item)));
        setTasks(structuredTasks);
        setIsLoading(false);
      } else {
        console.log("Ehtereum is not present");
      }
    } catch (error) {
      console.log(error);
      // alert(error.message);
      setIsLoading(false);
    }
  };

  const getTask = async (id) => {
    if (ethereum) {
      try {
        setIsLoading(true);
        const contract = createEthereumContract();
        const fetchedTask = await contract.getTask(id);
        // setTask(formatTask(fetchedTask));
        setIsLoading(false);
        return fetchedTask;
      } catch (error) {
        console.log(error);
        // alert(error.message);
        setIsLoading(false);
      }
    } else {
      console.log("Ethereum is not present");
    }
  };

  const calculateTotalAmount = (amount, feePercent) => {
    if (feePercent && amount) {
      const feeAmount = parseFloat((amount / 100) * feePercent);
      return parseFloat(amount) + feeAmount;
    }
    return 0;
  };

  const addTask = async () => {
    if (ethereum) {
      try {
        const { category, title, description, taskType, reward, assignee } = formData;
        // const feeAmount = (ethers.utils.parseEther(reward) / 100) * fee;
        // const totalAmount = ethers.utils.formatEther(ethers.utils.parseEther(reward) + feeAmount);
        const taskToSend = [
          category,
          title,
          description,
          taskType,
          ethers.utils.parseEther(reward),
          assignee
        ];
        setIsLoading(true);
        const contract = createEthereumContract();
        const transaction = await contract.addTask(taskToSend, {
          value: ethers.utils.parseEther(calculateTotalAmount(reward, fee).toString()),
        });
        console.log(`Success - ${transaction.hash}`);
        setIsLoading(false);
        window.location.replace("/tasks");
        notify("New task added successfully.");
      } catch (error) {
        console.log(error);
        // alert(
        //   "Oops! Something went wrong. See the browser console for details."
        // );
        setIsLoading(false);
      }
    } else {
      console.log("No Ehtereum object");
    }
  };

  const applyForTask = async (id) => {
    if (ethereum) {
      try {
        setIsLoading(true);
        const bnId = ethers.BigNumber.from(id);
        const contract = createEthereumContract();
        const transaction = await contract.applyForTask(bnId);
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Successfully applied.");
      } catch (error) {
        console.log(error);
        // alert(
        //   "Oops! Something went wrong. See the browser console for details."
        // );
        setIsLoading(false);
      }
    } else {
      console.log("No Ethereum object");
    }
  };

  const submitResult = async (id, result) => {
    if (ethereum) {
      try {
        setIsLoading(true);
        const contract = createEthereumContract();
        const transaction = await contract
          .submitResult(ethers.BigNumber.from(id), result);
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Result submitted successfully.");
      } catch (error) {
        console.log(error);
        // alert(
        //   "Oops! Something went wrong. See the browser console for details."
        // );
        setIsLoading(false);
      }
    } else {
      console.log("No Ehtereum object");
    }
  };

  const deleteTask = async (id) => {
    if (ethereum) {
      try {
        setIsLoading(true);
        const contract = createEthereumContract();
        const transaction = await contract
          .deleteTask(ethers.BigNumber.from(id));
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        notify("Task deleted successfully.");
        window.location.replace("/tasks");
      } catch (error) {
        console.log(error);
        // alert(
        //   "Oops! Something went wrong. See the browser console for details."
        // );
        setIsLoading(false);
      }
    } else {
      console.log("No Ehtereum object");
    }
  };

  const assignTask = async (id, candidate) => {
    if (ethereum) {
      try {
        setIsLoading(true);
        const contract = createEthereumContract();
        const transaction = await contract
          .assignTask(ethers.BigNumber.from(id), candidate);
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Task assigned.");
      } catch (error) {
        console.log(error);
        // alert(
        //   "Oops! Something went wrong. See the browser console for details."
        // );
        setIsLoading(false);
      }
    } else {
      console.log("No Ethereum object");
    }
  };

  const unassignTask = async (id) => {
    if (ethereum) {
      try {
        setIsLoading(true);
        const contract = createEthereumContract();
        const transaction = await contract
          .unassignTask(ethers.BigNumber.from(id));
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Task unassigned.");
      } catch (error) {
        console.log(error);
        // alert(
        //   "Oops! Something went wrong. See the browser console for details."
        // );
        setIsLoading(false);
      }
    } else {
      console.log("No Ethereum object");
    }
  };

  const requestChange = async (id, message) => {
    if (message.length === 0) return;
    if (ethereum) {
      try {
        setIsLoading(true);
        const contract = createEthereumContract();
        const transaction = await contract
          .requestChange(ethers.BigNumber.from(id), message);
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Change reaquest submitted.");
      } catch (error) {
        console.log(error);
        // alert(
        //   "Oops! Something went wrong. See the browser console for details."
        // );
        setIsLoading(false);
      }
    } else {
      console.log("No Ethereum object");
    }
  };

  const completeTask = async (id, newRating) => {
    try {
      if (ethereum) {
        setIsLoading(true);
        const contract = createEthereumContract();
        const transaction = await contract
          .completeTask(ethers.BigNumber.from(id), newRating);
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Task completed.");
      } else {
        console.log("No Ethereum object");
      }
    } catch (error) {
      console.log(error);
      // alert("Oops! Something went wrong. See the browser console for details.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (networkId === networks.testnet.chainId) {
      getAllTasks();
    }
  }, [currentAccount, networkId]);

  // Event listeners
  useEffect(() => {
    const contract = createEthereumContract();
    const onNewTask = (t) => {
      setTasks((prevState) => [
        ...prevState,
        formatTask(t)
      ]);
    };
    if (ethereum) {
      contract.on("TaskAdded", onNewTask);
    }
    return () => {
      if (contract) {
        contract.off("TaskAdded", onNewTask);
      }
    };
  }, []);

  useEffect(() => {
    const contract = createEthereumContract();
    const onTaskUpdated = (t) => {
      setTask(formatTask(t));
    };
    if (ethereum) {
      contract.on("TaskUpdated", onTaskUpdated);
    }
    return () => {
      if (contract) {
        contract.off("TaskUpdated", onTaskUpdated);
      }
    };
  }, []);

  useEffect(() => {
    const contract = createEthereumContract();
    const onTaskDeleted = (id) => {
      setTasks((current) => current.filter((p) => p.id !== id.toNumber()));
    };
    if (ethereum) {
      contract.on("TaskDeleted", onTaskDeleted);
    }
    return () => {
      if (contract) {
        contract.off("TaskDeleted", onTaskDeleted);
      }
    };
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        TaskTypes,
        task,
        getAllTasks,
        getTask,
        setTask,
        addTask,
        applyForTask,
        submitResult,
        deleteTask,
        assignTask,
        unassignTask,
        requestChange,
        completeTask,
        handleChange,
        formData,
        onUploadHandler,
        ipfsUrl,
        composeCandidateProfiles,
        composeAuthorProfile,
        calculateTotalAmount,
        formatTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

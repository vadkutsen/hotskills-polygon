import { createContext, useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { Web3Storage } from "web3.storage";
import contractABI from "../utils/contractABI.json";
import {
  TaskTypes,
  address0,
  TaskStatuses,
  Categories,
  contractAddress,
} from "../utils/constants";
import { PlatformContext } from "./PlatformContext";
import { AuthContext } from "./AuthContext";
import { networks } from "../utils/networks";

export const TaskContext = createContext();

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

export const TaskProvider = ({ children }) => {
  const [formData, setformData] = useState({
    category: Categories[0],
    title: "",
    description: "",
    taskType: 0,
    reward: 0,
    assignee: address0,
    dueDate: new Date(),
  });

  const [tasks, setTasks] = useState("");
  // const [task, setTask] = useState([]);
  const { notify, fee, setIsLoading, setNotifications } =
    useContext(PlatformContext);
  const { currentAccount, networkId } = useContext(AuthContext);
  const [ipfsUrl, setIpfsUrl] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onUploadHandler = async (files) => {
    const client = new Web3Storage({
      token: import.meta.env.VITE_WEB3_STORAGE_TOKEN,
    });
    if (!files || files.length === 0) {
      return;
    }
    const rootCid = await client.put(files);
    const info = await client.status(rootCid);
    // const res = await client.get(rootCid);
    const url = `https://${info.cid}.ipfs.w3s.link/`;
    // notify("File(s) successfully uploaded to IPFS.");
    return url;
  };

  const handleChange = (e, name) => {
    if (name === "dueDate") {
      setformData((prevState) => ({ ...prevState, [name]: e }));
    } else {
      setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }
  };

  function formatTask(t) {
    return {
      id: t.id.toNumber(),
      category: t.category,
      title: t.title,
      description: t.description,
      taskType: TaskTypes[t.taskType],
      dueDate: new Date(t.dueDate.toNumber()).toLocaleDateString(),
      createdAt: new Date(t.createdAt.toNumber() * 1000).toLocaleDateString(),
      author: t.author,
      candidates: t.candidates.map((c) => c.toLowerCase()),
      assignee: t.assignee === address0 ? "Unassigned" : t.assignee,
      completedAt:
        t.completedAt > 0
          ? new Date(t.completedAt.toNumber() * 1000).toLocaleDateString()
          : "Not completed yet",
      reward: parseInt(t.reward, 10) / 10 ** 18,
      result: t.result,
      status: TaskStatuses[t.status],
      lastStatusChangeAt: new Date(
        t.lastStatusChangeAt.toNumber() * 1000
      ).toLocaleDateString(),
      changeRequests: t.changeRequests,
    };
  }

  const formatUser = async (address) => {
    if (ethereum && address) {
      try {
        const user = {};
        const fetchedProfile = await contract.getProfile(address);
        user.profile = fetchedProfile;
        user.address = address;
        const fetchedRating = await contract.getRating(address);
        user.rating = fetchedRating;
        return user;
      } catch (error) {
        console.log(error);
        alert(error.message);
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
    if (ethereum) {
      try {
        setIsLoading(true);
        const availableTasks = await contract.getAllTasks();
        const structuredTasks = availableTasks
          .filter((item) => item.title && item.title !== "")
          .map((item) => formatTask(item));
        setTasks(structuredTasks);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        alert(error.message);
        setIsLoading(false);
      }
    } else {
      console.log("Ehtereum is not present");
    }
  };

  // const getTask = async (id) => {
  //   if (ethereum) {
  //     try {
  //       setIsLoading(true);
  //       const fetchedTask = await contract.getTask(id);
  //       setIsLoading(false);
  //       return fetchedTask;
  //     } catch (error) {
  //       console.log(error);
  //       alert(error.message);
  //       setIsLoading(false);
  //     }
  //   } else {
  //     console.log("Ethereum is not present");
  //   }
  // };

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
        const {
          category,
          title,
          description,
          taskType,
          reward,
          assignee,
          dueDate,
        } = formData;
        // const feeAmount = (ethers.utils.parseEther(reward) / 100) * fee;
        // const totalAmount = ethers.utils.formatEther(ethers.utils.parseEther(reward) + feeAmount);
        const taskToSend = [
          category,
          title,
          description,
          taskType,
          ethers.utils.parseEther(reward),
          assignee,
          dueDate.getTime(),
        ];
        console.log(taskToSend);
        setIsLoading(true);
        const transaction = await contract.addTask(taskToSend, {
          value: ethers.utils.parseEther(
            calculateTotalAmount(reward, fee).toString()
          ),
        });
        console.log(`Success - ${transaction.hash}`);
        setIsLoading(false);
        window.location.replace("/tasks");
        notify("New task added successfully.");
      } catch (error) {
        console.log(error);
        alert(error.message);
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
        const transaction = await contract.applyForTask(bnId);
        console.log(`Success - ${transaction.hash}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Successfully applied.");
        window.location.reload();
      } catch (error) {
        console.log(error);
        alert(error.message);
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
        let res;
        if (!result && selectedFiles.length > 0) {
          res = await onUploadHandler(selectedFiles);
        } else if (result && selectedFiles.length === 0) {
          res = result;
        } else {
          alert(
            "Plese select files for uploading or enter a link to your result."
          );
          return;
        }
        console.log("result: ", res);
        const transaction = await contract.submitResult(
          ethers.BigNumber.from(id),
          res
        );
        console.log(`Success - ${transaction.hash}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Result submitted successfully.");
      } catch (error) {
        console.log(error);
        alert(error.message);
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
        const transaction = await contract.deleteTask(
          ethers.BigNumber.from(id)
        );
        console.log(`Success - ${transaction.hash}`);
        setIsLoading(false);
        await getAllTasks();
        notify("Task deleted successfully.");
        window.location.replace("/tasks");
      } catch (error) {
        console.log(error);
        alert(error.message);
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
        const transaction = await contract.assignTask(
          ethers.BigNumber.from(id),
          candidate
        );
        console.log(`Success - ${transaction.hash}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Task assigned.");
      } catch (error) {
        console.log(error);
        alert(error.message);
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
        const transaction = await contract.unassignTask(
          ethers.BigNumber.from(id)
        );
        console.log(`Success - ${transaction.hash}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Task unassigned.");
      } catch (error) {
        console.log(error);
        alert(error.message);
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
        const transaction = await contract.requestChange(
          ethers.BigNumber.from(id),
          message
        );
        console.log(`Success - ${transaction.hash}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Change reaquest submitted.");
      } catch (error) {
        console.log(error);
        alert(error.message);
        setIsLoading(false);
      }
    } else {
      console.log("No Ethereum object");
    }
  };

  const openDispute = async (id) => {
    if (ethereum) {
      try {
        setIsLoading(true);
        const transaction = await contract.openDispute(
          ethers.BigNumber.from(id)
        );
        console.log(`Success - ${transaction.hash}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Dispute opened successfuly.");
      } catch (error) {
        console.log(error);
        alert(error.message);
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
        const transaction = await contract.completeTask(
          ethers.BigNumber.from(id),
          newRating
        );
        console.log(`Success - ${transaction.hash}`);
        setIsLoading(false);
        await getAllTasks();
        await getTask(id);
        notify("Task completed.");
      } else {
        console.log("No Ethereum object");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
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
    const onNewTask = (t) => {
      setTasks((prevState) => [...prevState, formatTask(t)]);
      setNotifications((prevState) => [
        ...prevState,
        <Link to={`/tasks/${t.id}`} onClick={setNotifications([])}>
          New task added
        </Link>,
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
    const onTaskUpdated = (t) => {
      setTask(formatTask(t));
      setNotifications((prevState) => [
        ...prevState,
        <Link to={`/tasks/${t.id}`} onClick={setNotifications([])}>
          Task updated
        </Link>,
      ]);
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
        // task,
        getAllTasks,
        // getTask,
        // setTask,
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
        formatTask,
        selectedFiles,
        setSelectedFiles,
        openDispute,
        contract,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

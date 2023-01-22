// import { createContext, useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import contractABI from "../utils/contractABI.json";
import {
  TaskTypes,
  address0,
  TaskStatuses,
  // Categories,
  contractAddress,
} from "../utils/constants";
// import { PlatformContext } from "../context/PlatformContext";

import { onUploadHandler } from "./IpfsUploadHandler";

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

export const contract = createEthereumContract();

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

const calculateTotalAmount = (amount, feePercent) => {
  if (feePercent && amount) {
    const feeAmount = parseFloat((amount / 100) * feePercent);
    return parseFloat(amount) + feeAmount;
  }
  return 0;
};

export function formatTask(t) {
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

export const getTask = async (id) => {
  if (ethereum) {
    try {
      const fetchedTask = await contract.getTask(id);
      return fetchedTask;
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  } else {
    console.log("Ethereum is not present");
  }
};

export const composeCandidateProfiles = async (candidates) => {
  const p = [];
  if (candidates) {
    for (let i = 0; i < candidates.candidates.length; i += 1) {
      const c = await formatUser(candidates.candidates[i]);
      p.push(c);
    }
    return p;
  }
};

export const composeAuthorProfile = async (address) => {
  const p = await formatUser(address);
  return p;
};

export const getAllTasks = async () => {
  if (ethereum) {
    try {
      const availableTasks = await contract.getAllTasks();
      const structuredTasks = availableTasks
        .filter((item) => item.title && item.title !== "")
        .map((item) => formatTask(item));
      return structuredTasks;
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  } else {
    console.log("Ehtereum is not present");
  }
};

export const addTask = async (formData, fee) => {
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
      const transaction = await contract.addTask(taskToSend, {
        value: ethers.utils.parseEther(
          calculateTotalAmount(reward, fee).toString()
        ),
      });
      console.log(`Success - ${transaction.hash}`);
      window.location.replace("/tasks");
      // notify("New task added successfully.");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  } else {
    console.log("No Ehtereum object");
  }
};

export const applyForTask = async (id) => {
  if (ethereum) {
    try {
      const bnId = ethers.BigNumber.from(id);
      const transaction = await contract.applyForTask(bnId);
      console.log(`Success - ${transaction.hash}`);
      // notify("Successfully applied.");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  } else {
    console.log("No Ethereum object");
  }
};

export const submitResult = async (id, result, selectedFiles) => {
  if (ethereum) {
    try {
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
      await getAllTasks();
      await getTask(id);
      // notify("Result submitted successfully.");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  } else {
    console.log("No Ehtereum object");
  }
};

export const deleteTask = async (id) => {
  if (ethereum) {
    try {
      const transaction = await contract.deleteTask(
        ethers.BigNumber.from(id)
      );
      console.log(`Success - ${transaction.hash}`);
      await getAllTasks();
      // notify("Task deleted successfully.");
      window.location.replace("/tasks");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  } else {
    console.log("No Ehtereum object");
  }
};

export const assignTask = async (id, candidate) => {
  if (ethereum) {
    try {
      const transaction = await contract.assignTask(
        ethers.BigNumber.from(id),
        candidate
      );
      console.log(`Success - ${transaction.hash}`);
      // await getAllTasks();
      // await getTask(id);
      // notify("Task assigned.");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  } else {
    console.log("No Ethereum object");
  }
};

export const unassignTask = async (id) => {
  if (ethereum) {
    try {
      const transaction = await contract.unassignTask(
        ethers.BigNumber.from(id)
      );
      console.log(`Success - ${transaction.hash}`);
      // notify("Task unassigned.");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  } else {
    console.log("No Ethereum object");
  }
};

export const requestChange = async (id, message) => {
  if (message.length === 0) return;
  if (ethereum) {
    try {
      const transaction = await contract.requestChange(
        ethers.BigNumber.from(id),
        message
      );
      console.log(`Success - ${transaction.hash}`);
      // await getAllTasks();
      // await getTask(id);
      // notify("Change reaquest submitted.");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  } else {
    console.log("No Ethereum object");
  }
};

export const openDispute = async (id) => {
  if (ethereum) {
    try {
      const transaction = await contract.openDispute(
        ethers.BigNumber.from(id)
      );
      console.log(`Success - ${transaction.hash}`);
      // await getAllTasks();
      // await getTask(id);
      // notify("Dispute opened successfuly.");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  } else {
    console.log("No Ethereum object");
  }
};

export const completeTask = async (id, newRating) => {
  try {
    if (ethereum) {
      const transaction = await contract.completeTask(
        ethers.BigNumber.from(id),
        newRating
      );
      console.log(`Success - ${transaction.hash}`);
      // await getAllTasks();
      // await getTask(id);
      // notify("Task completed.");
    } else {
      console.log("No Ethereum object");
    }
  } catch (error) {
    console.log(error);
    alert(error.message);
  }
};


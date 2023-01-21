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

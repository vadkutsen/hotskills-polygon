// import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { ServiceStatuses, Categories } from "../utils/constants";
import { networks } from "../utils/networks";
import { contract } from "./Web3Service";

const { ethereum } = window;

//   const { currentAccount, networkId } = useContext(AuthContext);
// const [formData, setformData] = useState({
//   category: Categories[0],
//   image: "",
//   title: "",
//   description: "",
//   address: window.ethereum.selectedAccount,
//   price: 0,
//   deliveryTime: 0,
// });
// const [services, setServices] = useState([]);
// const [service, setService] = useState([]);
// const [ipfsUrl, setIpfsUrl] = useState(null);
// const [selectedFiles, setSelectedFiles] = useState([]);
//   const { notify, setIsLoading, setNotifications } =
//     useContext(PlatformContext);

//   const onUploadHandler = async (files) => {
//     const client = new Web3Storage({
//       token: import.meta.env.VITE_WEB3_STORAGE_TOKEN,
//     });
//     if (!files || files.length === 0) {
//       return alert("No files selected");
//     }
//     const rootCid = await client.put(files);
//     const info = await client.status(rootCid);
//     // const res = await client.get(rootCid);
//     const urls = files.map((f) => `https://${info.cid}.ipfs.w3s.link/${f.name}`);
//     // const url = `https://${info.cid}.ipfs.w3s.link/${files[0].name}`;
//     console.log(urls);
//     return urls;
//   };

// const handleChange = (e, name) => {
//   setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
// };

export function formatService(t) {
  return {
    id: t._id,
    images: t.images,
    category: t.category,
    title: t.title,
    description: t.description,
    createdAt: new Date(t.createdAt.toNumber() * 1000).toLocaleDateString(),
    author: t.author,
    price: parseInt(t.price, 10) / 10 ** 18,
    deliveryTime: t.deliveryTime,
    status: ServiceStatuses[t.status],
    lastStatusChangeAt: new Date(
      t.lastStatusChangeAt.toNumber() * 1000
    ).toLocaleDateString(),
  };
}

// const getAllServices = async () => {
//   try {
//     const availableServices = await contract.getAllServices();
//     availableServices.map((item) => formatService(item));
//   } catch (error) {
//     console.log(error);
//   }
// };

// const getService = async (id) => {
//     try {
//       setIsLoading(true);
//       const fetchedService = await contract.getService(id);
//       // setService(formatService(fetchedService));
//       setIsLoading(false);
//       return fetchedService;
//     } catch (error) {
//       console.log(error);
//       // alert(error.message);
//       setIsLoading(false);
//     }
//   } else {
//     console.log("Ethereum is not present");
//   }
// };

// const addService = async () => {
//   if (ethereum) {
//     try {
//       setIsLoading(true);
//       const { category, title, description, price, deliveryTime } = formData;
//       const images = await onUploadHandler(selectedFiles);
//       const serviceToSend = [
//         images,
//         category,
//         title,
//         description,
//         ethers.utils.parseEther(price),
//         deliveryTime,
//       ];
//       console.log(serviceToSend);
//       const transaction = await contract.addService(serviceToSend);
//       console.log(`Success - ${transaction.hash}`);
//       setIsLoading(false);
//       window.location.replace("/services");
//       notify("Service added successfully.");
//     } catch (error) {
//       console.log(error);
//       alert(error.message);
//       setIsLoading(false);
//     }
//   } else {
//     console.log("No Ethereum object");
//   }
// };

// const updateService = async () => {
//   if (ethereum) {
//     try {
//       const { category, title, description, price, deliveryTime } = formData;
//       const images = ipfsUrl || "";
//       const serviceToSend = [
//         images,
//         category,
//         title,
//         description,
//         ethers.utils.parseEther(price),
//         deliveryTime,
//       ];
//       setIsLoading(true);
//       const transaction = await contract.updateService(serviceToSend);
//       console.log(`Success - ${transaction.hash}`);
//       setIsLoading(false);
//       window.location.reload();
//       notify("Service updated successfully.");
//     } catch (error) {
//       console.log(error);
//       // alert(
//       //   "Oops! Something went wrong. See the browser console for details."
//       // );
//       setIsLoading(false);
//     }
//   } else {
//     console.log("No Ethereum object");
//   }
// };

export const pauseService = async (id) => {
  if (ethereum) {
    try {
      const transaction = await contract.pauseService(
        ethers.BigNumber.from(id)
      );
      console.log(`Success - ${transaction.hash}`);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  } else {
    console.log("No Ethereum object");
  }
};

export const resumeService = async (id) => {
  if (ethereum) {
    try {
      //   setIsLoading(true);
      const transaction = await contract.resumeService(
        ethers.BigNumber.from(id)
      );
      console.log(`Success - ${transaction}`);
      //   setIsLoading(false);
      //   await getAllServices();
      //   notify("Service resumed successfully.");
      window.location.reload();
      //   getAllServices();
      //   getService();
    } catch (error) {
      console.log(error);
      alert(error.message);
      //   setIsLoading(false);
    }
  } else {
    console.log("No Ethereum object");
  }
};

export const deleteService = async (id) => {
  // const dispatch = useDispatch();
  // try {
  //   dispatch(deleteService(id));
  // } catch (error) {
  //   console.log(error);
  // }
};

export const editService = async (id) => {
  try {
    
  } catch (error) {
    console.log(error);
  }
};

export const calculateTotalAmount = (amount, feePercent) => {
  if (feePercent && amount) {
    const feeAmount = parseFloat((amount / 100) * feePercent);
    return parseFloat(amount) + feeAmount;
  }
  return 0;
};

export const requestService = async (data) => {
  if (ethereum) {
    try {
      const {
        category,
        title,
        description,
        taskType,
        assignee,
        dueDate,
        reward,
        fee,
      } = data;
      const taskToSend = [
        category,
        title,
        description,
        taskType,
        ethers.utils.parseEther(reward.toString()),
        assignee,
        dueDate,
      ];
      console.log(taskToSend);
      //   setIsLoading(true);
      const transaction = await contract.addTask(taskToSend, {
        value: ethers.utils.parseEther(
          calculateTotalAmount(reward, fee).toString()
        ),
      });
      console.log(`Success - ${transaction}`);
      //   setIsLoading(false);
      window.location.replace("/tasks");
      //   notify("New task added successfully.");
    } catch (error) {
      console.log(error);
      alert(error.message);
      //   setIsLoading(false);
    }
  } else {
    console.log("No Ethereum object");
  }
};

// useEffect(() => {
//   if (networkId === networks.testnet.chainId) {
//     getAllServices();
//   }
// }, [currentAccount, networkId]);

// Event listeners

// useEffect(() => {
//   const onNewService = (s) => {
//     setServices((prevState) => [...prevState, formatService(s)]);
//     setNotifications((prevState) => [
//       ...prevState,
//       <Link to={`/services/${s.id}`}>New service added</Link>,
//     ]);
//   };
//   if (ethereum) {
//     contract.on("ServiceAdded", onNewService);
//   }
//   return () => {
//     if (contract) {
//       contract.off("ServiceAdded", onNewService);
//     }
//   };
// }, []);

// useEffect(() => {
//   const onServiceUpdated = (s) => {
//     setService(formatService(s));
//   };
//   if (ethereum) {
//     contract.on("ServiceUpdated", onServiceUpdated);
//   }
//   return () => {
//     if (contract) {
//       contract.off("ServiceUpdated", onServiceUpdated);
//     }
//   };
// }, []);

// useEffect(() => {
//   const onServiceDeleted = (id) => {
//     setServices((current) => current.filter((s) => s.id !== id.toNumber()));
//   };
//   if (ethereum) {
//     contract.on("ServiceDeleted", onServiceDeleted);
//   }
//   return () => {
//     if (contract) {
//       contract.off("ServiceDeleted", onServiceDeleted);
//     }
//   };
// }, []);

import { createContext, useEffect, useState, useContext } from "react";
import { Web3Storage } from "web3.storage";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { ServiceStatuses, Categories, contractAddress } from "../utils/constants";
import contractABI from "../utils/contractABI.json";
import { PlatformContext } from "./PlatformContext";
import { networks } from "../utils/networks";
import { AuthContext } from "./AuthContext";

export const ServiceContext = createContext();

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

const contract = createEthereumContract();

export const ServiceProvider = ({ children }) => {
  const [formData, setformData] = useState({
    category: Categories[0],
    image: "",
    title: "",
    description: "",
    price: 0,
    deliveryTime: 0
  });
  const [services, setServices] = useState([]);
  const [service, setService] = useState([]);
  const [ipfsUrl, setIpfsUrl] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { notify, setIsLoading, setNotifications } = useContext(PlatformContext);
  const { currentAccount, networkId } = useContext(AuthContext);

  const onUploadHandler = async (files) => {
    const client = new Web3Storage({ token: import.meta.env.VITE_WEB3_STORAGE_TOKEN });
    if (!files || files.length === 0) {
      return alert("No files selected");
    }
    const rootCid = await client.put(files);
    const info = await client.status(rootCid);
    // const res = await client.get(rootCid);
    const url = `https://${info.cid}.ipfs.w3s.link/${files[0].name}`;
    // notify("File successfully uploaded to IPFS.");
    return url;
  };

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  function formatService(t) {
    return {
      id: t.id.toNumber(),
      image: t.image,
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

  const getAllServices = async () => {
    if (ethereum) {
      try {
        setIsLoading(true);
        const availableServices = await contract.getAllServices();
        const structuredServices = availableServices.map((item) => formatService(item));
        setServices(structuredServices);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        // alert(error.message);
        setIsLoading(false);
      }
    } else {
      console.log("Ethereum is not present");
    }
  };

  const getService = async (id) => {
    if (ethereum) {
      try {
        setIsLoading(true);
        const fetchedService = await contract.getService(id);
        // setService(formatService(fetchedService));
        setIsLoading(false);
        return fetchedService;
      } catch (error) {
        console.log(error);
        // alert(error.message);
        setIsLoading(false);
      }
    } else {
      console.log("Ethereum is not present");
    }
  };

  const addService = async () => {
    if (ethereum) {
      try {
        setIsLoading(true);
        const { category, title, description, price, deliveryTime } = formData;
        const image = await onUploadHandler(selectedFiles);
        const serviceToSend = [
          image,
          category,
          title,
          description,
          ethers.utils.parseEther(price),
          deliveryTime
        ];
        const transaction = await contract.addService(serviceToSend);
        console.log(`Success - ${transaction.hash}`);
        setIsLoading(false);
        window.location.replace("/services");
        notify("Service added successfully.");
      } catch (error) {
        console.log(error);
        alert(error.message);
        setIsLoading(false);
      }
    } else {
      console.log("No Ethereum object");
    }
  };

  const updateService = async () => {
    if (ethereum) {
      try {
        const { category, title, description, price, deliveryTime } = formData;
        const image = ipfsUrl || "";
        const serviceToSend = [
          image,
          category,
          title,
          description,
          ethers.utils.parseEther(price),
          deliveryTime
        ];
        setIsLoading(true);
        const transaction = await contract.updateService(serviceToSend);
        console.log(`Success - ${transaction.hash}`);
        setIsLoading(false);
        window.location.reload();
        notify("Service updated successfully.");
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

  const pauseService = async (id) => {
    if (ethereum) {
      try {
        setIsLoading(true);
        // const contract = createEthereumContract();
        const transaction = await contract
          .pauseService(ethers.BigNumber.from(id));
        console.log(`Success - ${transaction.hash}`);
        setIsLoading(false);
        await getAllServices();
        notify("Service paused successfully.");
        // window.location.reload();
        // getAllServices();
        // getService();
      } catch (error) {
        console.log(error);
        alert(error.message);
        setIsLoading(false);
      }
    } else {
      console.log("No Ethereum object");
    }
  };

  const resumeService = async (id) => {
    if (ethereum) {
      try {
        setIsLoading(true);
        const transaction = await contract
          .resumeService(ethers.BigNumber.from(id));
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllServices();
        notify("Service resumed successfully.");
        window.location.reload();
        getAllServices();
        getService();
      } catch (error) {
        console.log(error);
        alert(error.message);
        setIsLoading(false);
      }
    } else {
      console.log("No Ethereum object");
    }
  };

  const deleteService = async (id) => {
    if (ethereum) {
      try {
        setIsLoading(true);
        const transaction = await contract
          .deleteService(ethers.BigNumber.from(id));
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        await getAllServices();
        notify("service deleted successfully.");
        window.location.replace("/services");
      } catch (error) {
        console.log(error);
        alert(error.message);
        setIsLoading(false);
      }
    } else {
      console.log("No Ethereum object");
    }
  };

  const calculateTotalAmount = (amount, feePercent) => {
    if (feePercent && amount) {
      const feeAmount = parseFloat((amount / 100) * feePercent);
      return parseFloat(amount) + feeAmount;
    }
    return 0;
  };

  const requestService = async (data) => {
    if (ethereum) {
      try {
        const { category, title, description, taskType, assignee, reward, fee } = data;
        const taskToSend = [
          category,
          title,
          description,
          taskType,
          ethers.utils.parseEther(reward.toString()),
          assignee,
        ];
        console.log(taskToSend);
        setIsLoading(true);
        const transaction = await contract.addTask(taskToSend, {
          value: ethers.utils.parseEther(calculateTotalAmount(reward, fee).toString())
        });
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        window.location.replace("/tasks");
        notify("New task added successfully.");
      } catch (error) {
        console.log(error);
        alert(error.message);
        setIsLoading(false);
      }
    } else {
      console.log("No Ethereum object");
    }
  };

  useEffect(() => {
    if (networkId === networks.testnet.chainId) {
      getAllServices();
    }
  }, [currentAccount, networkId]);

  // Event listeners

  useEffect(() => {
    const onNewService = (s) => {
      setServices((prevState) => [
        ...prevState,
        formatService(s)
      ]);
      setNotifications((prevState) => [...prevState, <Link to={`/services/${s.id}`}>New service added</Link>]);
    };
    if (ethereum) {
      contract.on("ServiceAdded", onNewService);
    }
    return () => {
      if (contract) {
        contract.off("ServiceAdded", onNewService);
      }
    };
  }, []);

  useEffect(() => {
    const onServiceUpdated = (s) => {
      setService(formatService(s));
    };
    if (ethereum) {
      contract.on("ServiceUpdated", onServiceUpdated);
    }
    return () => {
      if (contract) {
        contract.off("ServiceUpdated", onServiceUpdated);
      }
    };
  }, []);

  useEffect(() => {
    const onServiceDeleted = (id) => {
      setServices((current) => current.filter((s) => s.id !== id.toNumber()));
    };
    if (ethereum) {
      contract.on("ServiceDeleted", onServiceDeleted);
    }
    return () => {
      if (contract) {
        contract.off("ServiceDeleted", onServiceDeleted);
      }
    };
  }, []);

  return (
    <ServiceContext.Provider
      value={{
        services,
        service,
        getAllServices,
        getService,
        addService,
        updateService,
        deleteService,
        pauseService,
        resumeService,
        requestService,
        handleChange,
        formData,
        onUploadHandler,
        ipfsUrl,
        calculateTotalAmount,
        formatService,
        selectedFiles,
        setSelectedFiles,
        contract
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

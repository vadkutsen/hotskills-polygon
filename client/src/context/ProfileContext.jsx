import { createContext, useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import { AuthContext } from "./AuthContext";
import { contractAddress } from "../utils/constants";
import contractABI from "../utils/contractABI.json";
import { PlatformContext } from "./PlatformContext";
import { networks } from "../utils/networks";

export const ProfileContext = createContext();

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

export const ProfileProvider = ({ children }) => {
  const [ipfsUrl, setIpfsUrl] = useState(null);
  const [profile, setProfile] = useState([]);
  const [formData, setformData] = useState({
    avatar: "",
    username: "",
    skills: "",
    languages: [],
    rate: 0,
    availability: 0
  });
  const { currentAccount, networkId } = useContext(AuthContext);
  const { notify, setIsLoading } = useContext(PlatformContext);

  const handleChange = (e, name) => {
    if (name === "languages") {
      setformData((prevState) => ({ ...prevState, [name]: e.map((item) => item.value) }));
    } else setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const onUploadHandler = async (files) => {
    const client = new Web3Storage({
      token: import.meta.env.VITE_WEB3_STORAGE_TOKEN,
    });
    if (!files || files.length === 0) {
      return alert("No files selected");
    }
    setIsLoading(true);
    const rootCid = await client.put(files);
    const info = await client.status(rootCid);
    // const res = await client.get(rootCid);
    const url = `https://${info.cid}.ipfs.w3s.link/${files[0].name}`;
    setIpfsUrl(url);
    setIsLoading(false);
    notify("File successfully uploaded to IPFS.");
  };

  const getProfile = async (address) => {
    if (ethereum && address) {
      try {
        setIsLoading(true);
        const contract = createEthereumContract();
        const fetchedProfile = await contract.getProfile(address);
        setProfile(fetchedProfile);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      console.log("Ethereum is not present");
    }
  };

  const getUserProfile = async (address) => {
    if (ethereum && address) {
      try {
        setIsLoading(true);
        const contract = createEthereumContract();
        const fetchedProfile = await contract.getProfile(address);
        setIsLoading(false);
        return fetchedProfile;
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      console.log("Ethereum is not present");
    }
  };

  const addProfile = async () => {
    if (ethereum) {
      try {
        const { username, skills, languages, rate, availability } = formData;
        setIsLoading(true);
        const contract = createEthereumContract();
        const avatar = ipfsUrl || "";
        const profileToSend = [avatar, username, skills, languages, rate, availability];
        const transaction = await contract.addProfile(profileToSend);
        console.log(`Success - ${transaction}`);
        setIsLoading(false);
        notify("Profile saved successfully.");
        window.location.reload();
      } catch (error) {
        console.log(error);
        alert(
          "Oops! Something went wrong. See the browser console for details."
        );
        setIsLoading(false);
      }
    } else {
      console.log("No Ethereum object");
    }
  };

  useEffect(() => {
    if (networkId === networks.testnet.chainId) {
      getProfile(currentAccount);
    }
  }, [currentAccount, networkId]);

  return (
    <ProfileContext.Provider
      value={{
        addProfile,
        getProfile,
        getUserProfile,
        handleChange,
        profile,
        formData,
        onUploadHandler,
        ipfsUrl,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

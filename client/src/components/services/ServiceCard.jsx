import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { shortenAddress } from "../../utils/shortenAddress";
import AutoAvatar from "../AutoAvatar";
import { contractAddress } from "../../utils/constants";
import contractABI from "../../utils/contractABI.json";
import { AuthContext } from "../../context/AuthContext";
import { networks } from "../../utils/networks";

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

const ServiceCard = ({
  id,
  image,
  title,
  createdAt,
  author,
  price,
  status,
  category,
}) => {
  const [profile, setProfile] = useState(null);
  // const { currentAccount, networkId } = useContext(AuthContext);

  const getProfile = async (address) => {
    if (ethereum && address) {
      try {
        const contract = createEthereumContract();
        const r = await contract.getProfile(address);
        setProfile(r);
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    } else {
      console.log("Tron is not present");
    }
  };
  useEffect(() => {
    getProfile(author);
  }, []);

  return (
    <Link to={`/services/${id}`}>
      <div className="w-[20rem] h-[30rem] flex flex-col justify-between text-white white-glassmorphism p-3 m-2 cursor-pointer transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-104 duration-300">
        <img alt="Service" className="max-h-[12rem] self-center rounded-md" src={image} />
        <div className="flex flex-col w-full">
          <div className="mt-2 flex flex-row justify-between">
            <p className="text-xl truncate ...">{title}</p>
          </div>
          <div className="flex flex-row mt-2 mb-2 items-center">
            {profile && profile.avatar ? (
              <img alt="Avatar" className="w-[2.5rem] mr-1 rounded-full border" src={profile.avatar} />
            ) : (
              <AutoAvatar userId={author} size={36} />
            )}
            {profile && profile.username ? <span>{profile.username} ({shortenAddress(author)})</span> : shortenAddress(author)}
          </div>
          {createdAt}
          <div className="flex flex-row gap-2 items-center">
            <div className="mt-2 pl-2 pr-2 text-center white-glassmorphism">
              {category}
            </div>
            <div className="mt-2 pl-2 pr-2 text-center white-glassmorphism">
              {status}
            </div>
          </div>
        </div>
        <p className="text-xl mt-20 self-end">{price} {networks.testnet.nativeCurrency.symbol}</p>
      </div>
    </Link>
  );
};

export default ServiceCard;

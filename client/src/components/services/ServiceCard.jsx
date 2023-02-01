import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Moment from "react-moment";
import { shortenAddress } from "../../utils/shortenAddress";
import AutoAvatar from "../AutoAvatar";
import { ServiceStatuses } from "../../utils/constants";
import { networks } from "../../utils/networks";
import noImage from "../../../images/no-image.png";

const ServiceCard = ({
  _id,
  images,
  title,
  createdAt,
  author,
  authorAddress,
  price,
  status,
  category,
}) => {
  const [profile, setProfile] = useState(null);
  // const { currentAccount, networkId } = useContext(AuthContext);
  const [usdPrice, setUsdPrice] = useState(0);
  // const getProfile = async (address) => {
  //   if (address) {
  //     try {
  //       // const contract = createEthereumContract();
  //       // const r = await contract.getProfile(address);
  //       // setProfile(r);
  //     } catch (error) {
  //       console.log(error);
  //       alert(error.message);
  //     }
  //   } else {
  //     console.log("Ethereum is not present");
  //   }
  // };
  // useEffect(() => {
  //   getProfile(author);
  // }, []);

  const getPriceData = async () => {
    try {
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/simple/token_price/polygon-pos?contract_addresses=0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270&vs_currencies=usd"
      );
      setUsdPrice(res.data["0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"]?.usd);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPriceData();
  }, []);

  const calculatePrice = (amount, priceInUsd) => amount * priceInUsd;

  return (
    <Link to={`/services/${_id}`}>
      <div className="w-[20rem] h-[30rem] flex flex-col justify-between text-white white-glassmorphism p-3 m-2 cursor-pointer transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-104 duration-300">
        {images?.length > 0 ? (
          <img
            alt="Service"
            className="max-h-[10rem] self-center rounded-md white-glassmorphism"
            src={images[0]}
          />
        ) : (
          <img
            alt="Service"
            className="max-h-[10rem] self-center rounded-md opacity-25"
            src={noImage}
          />
        )}
        <div className="flex flex-col w-full">
          <div className="flex flex-row gap-2 items-center">
            <div className="mt-2 pl-2 pr-2 text-center w-2/3 white-glassmorphism">
              {category}
            </div>
            <div className="mt-2 pl-2 pr-2 text-center w-1/3 white-glassmorphism">
              {ServiceStatuses[status]}
            </div>
          </div>
          <div className="mt-2 flex flex-row justify-between">
            <p className="text-xl truncate ...">{title}</p>
          </div>
          <div className="flex flex-row mt-2 mb-2 items-center">
            {profile?.avatar ? (
              <img
                alt="Avatar"
                className="w-[2.5rem] mr-1 rounded-full border"
                src={profile.avatar}
              />
            ) : (
              <AutoAvatar userId={author} size={36} />
            )}
            {profile?.username ? (
              <span>
                {profile.username} ({shortenAddress(authorAddress)})
              </span>
            ) : (
              shortenAddress(authorAddress)
            )}
          </div>
          <p className="text-xs italic pt-2">
            <Moment fromNow>{createdAt}</Moment>
          </p>
        </div>
        <p className="text-xl mt-20 self-end">
          {price} {networks.testnet.nativeCurrency.symbol} ($
          {calculatePrice(price, usdPrice)})
        </p>
      </div>
    </Link>
  );
};

export default ServiceCard;

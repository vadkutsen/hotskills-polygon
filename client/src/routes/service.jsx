import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
// import { ServiceContext } from "../context/ServiceContext";
// import { PlatformContext } from "../context/PlatformContext";
import ActionControls from "../components/services/ActionControls";
import { Loader } from "../components";
import AutoAvatar from "../components/AutoAvatar";
import { shortenAddress } from "../utils/shortenAddress";
import { networks } from "../utils/networks";
import Gallery from "../components/services/Gallery";
import noImage from "../../images/no-image.png";
import { ServiceStatuses } from "../utils/constants";

const { ethereum } = window;

export default function Service() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  // const { formatService, contract } = useContext(ServiceContext);
  // const { isLoading, setIsLoading, getRating } = useContext(PlatformContext);
  const serviceId = params.id;
  const [service, setService] = useState([]);
  const [rating, setRating] = useState(0);
  const [profile, setProfile] = useState(null);
  const [usdPrice, setUsdPrice] = useState(0);

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

  const getProfile = async (address) => {
    if (address) {
      try {
        // const r = await contract.getProfile(address);
        // setProfile(r);
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    } else {
      console.log("Ehtereum is not present");
    }
  };

  const getService = async (id) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/services/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
      // alert(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getService(serviceId).then((s) => {
      setService(s);
      // getRating(s.author).then((r) => setRating(r));
      // getProfile(s.author);
    });
  }, []);

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

  if (service) {
    return (
      <div className="min-h-screen text-white">
        <div className="container mx-auto flex flex-col self-center items-center white-glassmorphism p-3">
          <div className="flex flex-col w-full">
            {service.images?.length > 0 ? (
              <Gallery images={service.images} />
            ) : (
              <img
                alt="Service"
                className="max-h-[12rem] self-center rounded-md opacity-25"
                src={noImage}
              />
            )}

            <div className="flex flex-col ">
              <div className="mt-2 text-center white-glassmorphism">
                {service.category}
              </div>
              <div className="mt-2 text-center white-glassmorphism">
                {ServiceStatuses[service.status]}
              </div>
              <div className="flex flex-row justify-between w-full">
                <p className="mt-2 text-4xl text-left">{service.title}</p>
                <p className="mt-2 text-3xl text-right">
                  {service.price} {networks.testnet.nativeCurrency.symbol}
                  {" "}
                  (${calculatePrice(service.price, usdPrice)})
                </p>
              </div>
              <p className="mt-1 text-2xl">{service.description}</p>
              <p className="mt-1 text-xl">
                Delivery Time: {service.deliveryTime} days
              </p>
              <div className="pt-4 flex flex-row gap-2 items-center italic">
                <div className="flex flex-row items-center">
                  {/* {profile && profile.avatar ? (
                    <img
                      alt="Avatar"
                      className="w-[2.5rem] mr-1 rounded-full border"
                      src={profile.avatar}
                    />
                  ) : (
                    <AutoAvatar userId={service.author} size={36} />
                  )}
                  {profile && profile.username ? (
                    <span>
                      {profile.username} ({shortenAddress(service.author)}){" "}
                    </span>
                  ) : (
                    service.author && shortenAddress(service.author)
                  )} */}
                </div>
                <div className="flex flex-row justify-center items-center">
                  <FaStar color="#ffc107" />
                  {rating ? rating.toFixed(1) : 0} (0)
                </div>
              </div>
              {service.createdAt}
            </div>
            {isLoading ? <Loader /> : <ActionControls service={service} />}
          </div>
        </div>
      </div>
    );
  }

  return <p className="text-white text-center">Fetching data. Please wait.</p>;
}

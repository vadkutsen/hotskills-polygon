import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { ServiceContext } from "../context/ServiceContext";
import { PlatformContext } from "../context/PlatformContext";
import ActionControls from "../components/services/ActionControls";
import { Loader } from "../components";
import AutoAvatar from "../components/AutoAvatar";
import { shortenAddress } from "../utils/shortenAddress";
import { networks } from "../utils/networks";
// import Gallery from "../components/services/Gallery";

const { ethereum } = window;

export default function Service() {
  const params = useParams();
  const { getService, formatService, contract } = useContext(ServiceContext);
  const { isLoading, getRating } = useContext(PlatformContext);
  const serviceId = params.id;
  const [service, setService] = useState([]);
  const [rating, setRating] = useState(0);
  const [profile, setProfile] = useState(null);

  const getProfile = async (address) => {
    if (ethereum && address) {
      try {
        const r = await contract.getProfile(address);
        setProfile(r);
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    } else {
      console.log("Ehtereum is not present");
    }
  };

  useEffect(() => {
    getService(serviceId).then((s) => {
      setService(formatService(s));
      getRating(s.author).then((r) => setRating(r));
      getProfile(s.author);
    });
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

  if (service) {
    return (
      <div className="min-h-screen text-white">
        <div className="container mx-auto flex flex-col self-center items-center white-glassmorphism p-3">
          <div className="flex flex-col w-full">
            <img
              alt="Service"
              className="self-center rounded-md"
              src={service.image}
            />
            {/* <Gallery images={[service.image]} /> */}
            <div className="flex flex-col ">
              <div className="mt-2 text-center white-glassmorphism">
                {service.category}
              </div>
              <div className="mt-2 text-center white-glassmorphism">
                {service.status}
              </div>
              <div className="flex flex-row justify-between w-full">
                <p className="mt-2 text-4xl text-left">{service.title}</p>
                <p className="mt-2 text-3xl text-right">
                  {service.price} {networks.testnet.nativeCurrency.symbol}
                </p>
              </div>
              <p className="mt-1 text-2xl">{service.description}</p>
              <p className="mt-1 text-xl">
                Delivery Time: {service.deliveryTime} days
              </p>
              <div className="pt-4 flex flex-row gap-2 items-center italic">
                <div className="flex flex-row items-center">
                  {profile && profile.avatar ? (
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
                  )}
                </div>
                <div className="flex flex-row justify-center items-center">
                  <FaStar color="#ffc107" />
                  {rating.toFixed(1)}
                </div>
              </div>
              {service.createdAt}
            </div>
            {isLoading ? <Loader /> : <ActionControls service={service} />}
          </div>
        </div>

        <ToastContainer />
      </div>
    );
  }

  return <p className="text-white text-center">Fetching data. Please wait.</p>;
}

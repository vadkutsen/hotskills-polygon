import React, { useContext, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { PlatformContext } from "../context/PlatformContext";
import { ServiceContext } from "../context/ServiceContext";
import { AuthContext } from "../context/AuthContext";
import { ConnectWalletButton, Loader } from "../components";
import { Categories } from "../utils/constants";
import { networks } from "../utils/networks";
import IpfsForm from "../components/services/IpfsForm";
import { onGalleryUploadHandler } from "../services/IpfsUploadHandler";

const FormField = ({ placeholder, name, type, value, handleChange }) => {
  if (name === "category") {
    return (
      <select
        className="appearance-none w-full bg-transparent border text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 light:text-gray-800"
        value={value}
        type={type}
        onChange={(e) => handleChange(e, name)}
      >
        {Categories.map((c, i) => (
          <option className="white-glassmorphism" key={i} value={c}>
            {c}
          </option>
        ))}
      </select>
    );
  }
  if (name === "description") {
    return (
      <textarea
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => handleChange(e, name)}
        className="my-2 w-full rounded-sm p-2 min-h-[12rem] outline-none bg-transparent text-white white-glassmorphism"
      />
    );
  }
  if (name === "address") {
    return (
      <input
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => handleChange(e, name)}
        className="my-2 w-9/12 rounded-sm p-2 outline-none bg-transparent text-white white-glassmorphism"
      />
    );
  }
  return (
    <input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(e) => handleChange(e, name)}
      className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white white-glassmorphism"
    />
  );
};

export default function NewService() {
  const { notify } = useContext(PlatformContext);
  const [isLoading, setIsLoading] = useState(false);
  const { currentAccount } = useContext(AuthContext);
  const { selectedFiles } = useContext(ServiceContext);

  const [formData, setformData] = useState({
    category: Categories[0],
    image: "",
    title: "",
    description: "",
    address: currentAccount,
    price: 0,
    deliveryTime: 0,
  });

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { category, title, description, price, address, deliveryTime } = formData;
    const images = await onGalleryUploadHandler(selectedFiles);
    if (!title || !description || !price || !address) return;
    setIsLoading(true);
    try {
      const serviceData = {
        category,
        images,
        title,
        description,
        author: address,
        price,
        deliveryTime
      };
      console.log(serviceData);
      // const dataHash = hash(serviceData);
      await axios.post("/api/services/new", serviceData);
      window.location.replace("/services");
      notify("Service added successfully.");
    } catch (error) {
      console.log(error.message);
    }
    setIsLoading(false);
  };
  console.log(formData);
  return (
    <div className="flex w-full justify-center items-start min-h-screen">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white py-1">Add Service</h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Tell the world what you&apos;re good at.
          </p>
        </div>

        <div className="flex flex-col flex-2 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-5 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white text-sm">
              <span
                className="block tracking-wide text-gray-200 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Category
              </span>
              <div className="relative">
                <FormField
                  name="category"
                  type="select"
                  handleChange={handleChange}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  />
                </div>
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white text-sm">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Gallery
              </span>
              <div className="relative">
                <IpfsForm />
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white text-sm">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Title
              </span>
              <FormField
                placeholder="title..."
                name="title"
                type="text"
                handleChange={handleChange}
              />
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white text-sm">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Description
              </span>
              <FormField
                placeholder="Describe your services (e.g. I will...)"
                name="description"
                type="text"
                handleChange={handleChange}
              />
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white text-sm">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Price
              </span>
              <div className="flex flex-row gap-2">
                <FormField
                  placeholder="0"
                  name="price"
                  min="0"
                  type="number"
                  handleChange={handleChange}
                />
                <span className="text-white self-center">
                  {networks.testnet.nativeCurrency.symbol}
                </span>
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white text-sm">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Wallet Address
              </span>
              <div className="flex gap-2">
                <FormField
                  placeholder="address..."
                  name="address"
                  type="text"
                  value={formData.address}
                  handleChange={handleChange}
                />
                {!currentAccount && <ConnectWalletButton /> }
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white text-sm">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Delivery Time
              </span>
              <div className="flex flex-row gap-2">
                <FormField
                  placeholder="0"
                  step="1"
                  min="0"
                  name="deliveryTime"
                  type="number"
                  handleChange={handleChange}
                />
                <span className="text-white self-center">days</span>
              </div>
            </div>
            <div className="h-[1px] w-full bg-gray-400 my-2" />
            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-2xl cursor-pointer"
              >
                Add Service
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

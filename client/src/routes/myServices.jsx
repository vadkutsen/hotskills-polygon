import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { ServiceCard } from "../components";
import axios from "../utils/axios";
import { loginUser } from "../redux/features/auth/authSlice";
import { notify } from "../services/ToastService";

const MyServices = () => {
  const [services, setServices] = useState([]);
  const address = window.ethereum?.selectedAddress;
  const dispatch = useDispatch();

  const fetchtMyServices = async () => {
    if (address) {
      try {
        const { data } = await axios.get("/api/services/user/me");
        setServices(data);
      } catch (error) {
        console.log(error.message);
        notify(error.message, null, "error");
      }
    }
  };

  useEffect(() => {
    if (address) {
      try {
        dispatch(loginUser({ address }));
        fetchtMyServices();
      } catch (error) {
        console.log(error.message);
        notify(error.message, null, "error");
      }
    }
  }, [address]);

  // useEffect(() => {
  //   fetchtMyServices();
  // }, [fetchtMyServices]);
  console.log(services);
  return (
    <>
      <div className="flex w-full justify-center items-start 2xl:px-20 gradient-bg-welcome min-h-screen">
        <div className="flex flex-col w-9/12 md:p-12 py-12 px-4">
          <h3 className="text-white text-3xl text-center my-2">
            Your Services
          </h3>
          {!address && (
            <h3 className="text-white text-3xl text-center my-2">
              Connect your account to see the latest services
            </h3>
          )}

          <div className="flex flex-wrap justify-center items-center mt-10">
            {services?.map((service, i) => (
              <ServiceCard key={i} {...service} />
            ))}
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default MyServices;

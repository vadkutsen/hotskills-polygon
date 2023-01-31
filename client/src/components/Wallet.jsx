import { Fragment, useContext, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { FaStar } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PlatformContext } from "../context/PlatformContext";
import { ProfileContext } from "../context/ProfileContext";
import { shortenAddress } from "../utils/shortenAddress";
import AutoAvatar from "./AutoAvatar";
import { networks } from "../utils/networks";
import { getBalance } from "../services/PlatformService";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Wallet({ address }) {
  // const { ethereum } = window;
  // const { currentAccount, setCurrentAccount } = useContext(AuthContext);
  // const [profile, setProfile] = useState(null);
  // const { balance, fetchedRating } = useContext(PlatformContext);
  // const { profile } = useContext(ProfileContext);
  const profile = null;
  const fetchedRating = null;
  const [balance, setBalance] = useState(0);
  // const handleDisconnect = async () => {
  //   setCurrentAccount(null);
  //   try {
  //     await ethereum.request({ method: "disconnect" });
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   window.location.replace("/");
  // };
  useEffect(() => {
    getBalance(address).then((b) => setBalance(b));
  }, []);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center items-center w-full px-4 py-2 font-medium text-white bg-transparent rounded-md shadow-sm focus:outline-none">
          {profile?.avatar
            ?
              <img alt="Avatar" className="w-[2.5rem] mr-1 rounded-full border" src={profile?.avatar} />
            :
              <AutoAvatar userId={address} size={36} />}
          {profile?.username ? <span>{profile.username} ({shortenAddress(address)})</span> : shortenAddress(address)}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 ml-2 -mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 w-64 mt-2 origin-top-right text-white bg-transparent white-glassmorphism rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <div
                  className={classNames(
                    active
                      ? "bg-[#2546bd] text-white cursor-not-allowed"
                      : "text-white",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Balance: {balance} {networks.testnet.nativeCurrency.symbol}
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  className={classNames(
                    active
                      ? "bg-[#2546bd] text-white cursor-not-allowed"
                      : "text-white",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  <div className="flex flex-row gap-1">
                    <span>Rating:</span>
                    <span className="flex flex-row justify-center items-center mr-4">
                      {fetchedRating === 0
                        ? "unrated"
                        : [...Array(fetchedRating)].map((star, index) => (
                          <FaStar key={index} color="#ffc107" size={20} />
                        ))}
                    </span>
                  </div>
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  to="/profile"
                  className={classNames(
                    active
                      ? "bg-blue-700 text-white cursor-pointer"
                      : "text-white cursor-pointer",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  My Profile
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  to="/mytasks"
                  className={classNames(
                    active
                      ? "bg-blue-700 text-white cursor-pointer"
                      : "text-white cursor-pointer",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  My Tasks
                </NavLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NavLink
                  to="/myservices"
                  className={classNames(
                    active
                      ? "bg-blue-700 text-white cursor-pointer"
                      : "text-white cursor-pointer",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  My Services
                </NavLink>
              )}
            </Menu.Item>
            {/* <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  className={classNames(
                    active ? "bg-[#2546bd] text-white" : "text-white",
                    "block w-full text-left px-4 py-2 text-sm"
                  )}
                  onClick={handleDisconnect}
                >
                  Disconnect Wallet
                </button>
              )}
            </Menu.Item> */}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getProfile } from "../services/ProfileService";
import { Loader } from "../components";
import "cropperjs/dist/cropper.css";
import "./roundedCropper.css";
import AutoAvatar from "../components/AutoAvatar";
import languages from "../utils/languages.json";
import skills from "../utils/skills.json";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getProfile(window.ethereum.selectedAddress).then((p) => {
      setProfile(p);
    });
    setIsLoading(false);
    return () => {
      // this now gets called when the component unmounts
      setProfile(null);
    };
  }, []);

  return (
    <div className="flex w-full justify-center items-start  outline-none min-h-screen">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white py-1">Profile</h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Let your customers know your strongest skills.
          </p>
        </div>

        <div className="flex flex-col flex-2 items-center justify-center w-full mf:mt-0 mt-10">
          <div className="p-5 w-full flex flex-col justify-center items-center blue-glassmorphism">
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm">
              <div className="flex flex-col items-center">
                {profile?.avatar && profile.avatar.length > 0 ? (
                  <img
                    alt="Avatar"
                    src={profile.avatar}
                    className="w-[36rem] mr-1 rounded-full box-border border-4"
                  />
                ) : (
                  <AutoAvatar userId={profile?.address} size={370} />
                )}
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white text-sm">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Username*
              </span>
              <div>{profile?.username}</div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-0 bg-transparent text-sm">
              <span
                className="block text-white tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Skills ({profile?.skills?.length})
              </span>
              <div className="flex gap-2">
                {profile?.skills?.map((s, i) => (
                  <span key={i} className="text-white p-2 white-glassmorphism">
                    {skills.find((entry) => entry.id === s).name}
                  </span>
                ))}
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-0">
              <span
                className="block tracking-wide text-white text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Languages ({profile?.languages?.length})
              </span>
              <div className="flex gap-2">
                {profile?.languages?.map((l, i) => (
                  <span key={i} className="text-white p-2 white-glassmorphism">
                    {languages.find((entry) => entry.code === l).name}
                  </span>
                ))}
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white text-sm">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Rate
              </span>
              <div className="flex flex-row gap-2">
                <span className="text-white self-center">$</span>
                {profile?.rate}
                <span className="text-white self-center">/hr</span>
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white text-sm">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Availability
              </span>
              <div className="flex flex-row gap-2">
                {profile?.availability}
                <span className="text-white self-center">hours per week</span>
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white text-sm">
              <span
                className="block tracking-wide text-gray-20 font-bold mb-2"
                htmlFor="grid-state"
              >
                Wallet Address
              </span>
              <div className="flex gap-2 items-center">{profile?.address}</div>
            </div>
            <div className="h-[1px] w-full bg-gray-400 my-2" />
            {isLoading ? (
              <Loader />
            ) : (
              <NavLink
                to="/profile/edit"
                className="text-white text-center w-full mt-2 border p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
              >
                Edit Profile
              </NavLink>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

import React, { createRef, useState, useEffect } from "react";
import Select from "react-select";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Cropper } from "react-cropper";
import { getProfile, updateProfile } from "../services/ProfileService";
import { Loader } from "../components";
import "cropperjs/dist/cropper.css";
import "./roundedCropper.css";
import AutoAvatar from "../components/AutoAvatar";
import languages from "../utils/languages.json";
import skills from "../utils/skills.json";
import { OnboardingButton } from "../components/MetaMaskOnboarding";

// this transforms file to base64
const file2Base64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result?.toString() || "");
  reader.onerror = (error) => reject(error);
});

const languageOptions = languages.map((l) => ({
  value: l.code,
  label: l.name,
}));

const skillOptions = skills.map((s) => ({
  value: s.id,
  label: s.name,
}));

const FormField = ({ placeholder, name, type, value, handleChange }) => {
  if (name === "languages") {
    return (
      <Select
        options={languageOptions}
        closeMenuOnSelect={false}
        isMulti
        className="basic-multi-select"
        classNamePrefix="select"
        defaultValue={value}
        value={value}
        onChange={(e) => handleChange(e, name)}
        styles={{
          control: (styles) => ({
            ...styles,
            backgroundColor: "transparent",
          }),
          input: (styles) => ({
            ...styles,
            color: "white",
            outlineStyle: "none",
          }),
        }}
      />
    );
  }
  if (name === "skills") {
    return (
      <Select
        options={skillOptions}
        closeMenuOnSelect={false}
        isMulti
        className="basic-multi-select"
        classNamePrefix="select"
        defaultValue={value}
        value={value}
        onChange={(e) => handleChange(e, name)}
        styles={{
          control: (styles) => ({
            ...styles,
            backgroundColor: "transparent",
            outlineStyle: "none",
          }),
          input: (styles) => ({
            ...styles,
            color: "white",
            outlineStyle: "none",
          }),
        }}
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
      step="0.5"
      min="0"
      value={value}
      onChange={(e) => handleChange(e, name)}
      className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border"
    />
  );
};

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setformData] = useState({
    avatar: "",
    username: "",
    skills: [],
    languages: [],
    rate: 0,
    availability: 0,
    address: window.ethereum.selectedAddress,
  });
  const handleChange = (e, name) => {
    if (name === "languages" || name === "skills") {
      setformData((prevState) => ({
        ...prevState,
        [name]: e.map((item) => item.value),
      }));
    } else setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.address) return;
    const profileData = {
      avatar: formData.avatar,
      username: formData.username,
      skills: formData.skills,
      languages: formData.languages,
      rate: formData.rate,
      availability: formData.availability,
      address: formData.address,
    };
    setIsLoading(true);
    updateProfile(file, profileData, profile._id);
    setIsLoading(false);
  };
  // ref of the file input
  const fileRef = createRef();

  // the selected image
  const [uploaded, setUploaded] = useState(null);

  // the resulting cropped image
  const [cropped, setCropped] = useState(null);

  // the reference of cropper element
  const cropperRef = createRef();

  const onFileInputChange = (e) => {
    const f = e.target?.files?.[0];
    if (f) {
      setFile(e.target?.files);
      file2Base64(f).then((base64) => {
        setUploaded(base64);
      });
    }
  };

  // const onCrop = () => {
  //   const imageElement = cropperRef?.current;
  //   const cropper = imageElement?.cropper;
  //   setCropped(cropper.getCroppedCanvas().toDataURL());
  // };

  useEffect(() => {
    getProfile(window.ethereum.selectedAddress).then((p) => {
      setProfile(p);
    });
    return () => {
      // this now gets called when the component unmounts
      setProfile(null);
    };
  }, []);
  console.log(profile);

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
              {uploaded ? (
                <div>
                  {cropped ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={cropped}
                        alt="Cropped!"
                        // style={{ borderRadius: "50%" }}
                        className="rounded-full border"
                      />
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <button
                          type="button"
                          className="text-white w-full mt-2 border p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                          onClick={() => setCropped(false)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Cropper
                        src={uploaded}
                        style={{ height: 400, width: 400 }}
                        autoCropArea={1}
                        aspectRatio={1}
                        viewMode={3}
                        guides={false}
                        ref={cropperRef}
                      />
                      <button
                        type="button"
                        className="text-white w-full mt-2 border p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                        onClick={() => setUploaded(false)}
                      >
                        Cancel
                      </button>
                      {/* <button
                        type="button"
                        className="text-white w-full mt-2 border p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                        onClick={onCrop}
                      >
                        Crop
                      </button> */}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {profile?.avatar && profile.avatar.length > 0 ? (
                    <img
                      alt="Avatar"
                      src={profile.avatar}
                      className="w-[36rem] mr-1 rounded-full box-border border-4"
                    />
                  ) : (
                    <AutoAvatar userId={formData.address} size={370} />
                  )}
                  {/* {ipfsUrl && (
                    <img alt="Profile" className="self-center" src={ipfsUrl} />
                  )} */}
                  <input
                    type="file"
                    name="file"
                    style={{ display: "none" }}
                    ref={fileRef}
                    onChange={onFileInputChange}
                    accept="image/png,image/jpeg,image/gif"
                  />
                  <button
                    type="button"
                    className="text-white w-full mt-4 border p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                    onClick={() => fileRef.current?.click()}
                  >
                    Upload an Avatar
                  </button>
                </div>
              )}
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white text-sm">
              <span
                className="block tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Username*
              </span>
              <div>
                <FormField
                  className="w-full bg-transparent"
                  name="username"
                  type="text"
                  placeholder="e.g. Elon Musk"
                  handleChange={handleChange}
                />
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-0 bg-transparent text-sm">
              <span
                className="block text-white tracking-wide text-gray-20 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Skills
              </span>
              <FormField
                name="skills"
                handleChange={handleChange}
                className="outline-0"
              />
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-0">
              <span
                className="block tracking-wide text-white text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Languages
              </span>
              <FormField name="languages" handleChange={handleChange} />
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
                <FormField
                  className="w-full bg-transparent"
                  placeholder="0"
                  name="rate"
                  type="number"
                  handleChange={handleChange}
                />
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
                <FormField
                  className="w-full bg-transparent"
                  placeholder="0"
                  name="availability"
                  type="number"
                  min="0"
                  handleChange={handleChange}
                />
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
              <span className="italic">
                Please connect you wallet to assosiate the profile with your
                address
              </span>
              <div className="flex gap-2 items-center">
                {/* <FormField
                  placeholder="address..."
                  name="address"
                  type="text"
                  value={currentAccount}
                  handleChange={handleChange}
                /> */}
                {formData.address}
                {/* {!currentAccount && <><span>or</span><ConnectWalletButton /></> } */}
                <OnboardingButton />
              </div>
            </div>
            <div className="h-[1px] w-full bg-gray-400 my-2" />
            {isLoading ? (
              <Loader />
            ) : (
              <div className="flex w-full gap-2">
                <Link
                  to="/profile"
                  className="text-white text-center w-full mt-2 border p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-white w-full mt-2 border p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

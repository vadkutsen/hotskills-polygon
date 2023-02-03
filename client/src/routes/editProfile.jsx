import React, { createRef, useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { Cropper } from "react-cropper";
import { useDispatch } from "react-redux";
import axios from "../utils/axios";
import { Loader } from "../components";
import "cropperjs/dist/cropper.css";
import "./roundedCropper.css";
import AutoAvatar from "../components/AutoAvatar";
import languages from "../utils/languages.json";
import skills from "../utils/skills.json";
import { OnboardingButton } from "../components/MetaMaskOnboarding";
import { onAvatarUploadHandler } from "../services/IpfsUploadHandler";
import { updateProfile } from "../redux/features/profile/profileSlice";
import { notify } from "../services/ToastService";

// this transforms file to base64
const file2Base64 = (file) =>
  new Promise((resolve, reject) => {
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

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(window.ethereum?.selectedAddress);
  const [languageList, setLanguageList] = useState([]);
  const [username, setUsername] = useState("");
  const [skillList, setSkillList] = useState([]);
  const [rate, setRate] = useState(0);
  const [availability, setAvailability] = useState(0);
  const [oldImage, setOldImage] = useState(null);
  const [id, setId] = useState(null);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  // const { loading } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !address) return;
    setLoading(true);
    let avatar;
    if (file) {
      avatar = await onAvatarUploadHandler(file);
    } else {
      avatar = oldImage;
    }
    const profileData = {
      avatar,
      username,
      skills: skillList,
      languages: languageList,
      rate,
      availability,
      address,
      id
    };
    try {
      dispatch(updateProfile(profileData));
      notify("Profile updated.", null, "success");
      navigate("/profile");
    } catch (error) {
      console.log(error);
      notify(error.message, null, "error");
    }
    setLoading(false);
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

  const fetchProfile = useCallback(async () => {
    const { data } = await axios.get(`/api/profiles/${address}`);
    setOldImage(data.avatar);
    setUsername(data.username);
    setSkillList(data.skills);
    setLanguageList(data.languages);
    setRate(data.rate);
    setAvailability(data.availability);
    setId(data._id);
  }, [address]);

  useEffect(() => {
    fetchProfile();
  }, [address]);

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
                      {loading ? (
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
                  {oldImage ? (
                    <img
                      alt="Avatar"
                      src={oldImage}
                      className="w-[36rem] mr-1 rounded-full box-border border-4"
                    />
                  ) : (
                    <AutoAvatar userId={address} size={370} />
                  )}
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
                <input
                  placeholder="e.g. Elon Musk"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border"
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
              <Select
                name="skills"
                options={skillOptions}
                closeMenuOnSelect={false}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
                value={skillList.map((s) => skillOptions.find((option) => option.value === s))}
                onChange={(e) => setSkillList(() => e.map((item) => item.value))}
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
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-0">
              <span
                className="block tracking-wide text-white text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Languages
              </span>
              <Select
                name="languages"
                options={languageOptions}
                closeMenuOnSelect={false}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
                // defaultValue={languageList}
                value={languageList.map((s) => languageOptions.find((option) => option.value === s))}
                onChange={(e) => setLanguageList(e.map((item) => item.value))}
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
                <input
                  placeholder="0"
                  type="number"
                  step="0.5"
                  min="0"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border"
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
                <input
                  placeholder="o"
                  type="number"
                  step="0.5"
                  min="0"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border"
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
                {address}
                <OnboardingButton setAddress={setAddress} />
              </div>
            </div>
            <div className="h-[1px] w-full bg-gray-400 my-2" />
            {loading ? (
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

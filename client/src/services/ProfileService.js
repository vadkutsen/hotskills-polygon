import axios from "axios";
import { onAvatarUploadHandler } from "./IpfsUploadHandler";
import { notify } from "./ToastService";

export const getProfile = async (address) => {
  if (address) {
    try {
      const res = await axios.get(`/api/profiles/${address}`);
      return res.data;
    } catch (error) {
      console.log(error.message);
      notify(`${error.message}. ${error.response.data.msg}`, null, "error");
    }
  }
};

// export const getUserProfile = async (address) => {
//   if (address) {
//     try {
//       setIsLoading(true);
//       const contract = createEthereumContract();
//       const fetchedProfile = await contract.getProfile(address);
//       setIsLoading(false);
//       return fetchedProfile;
//     } catch (error) {
//       console.log(error);
//       setIsLoading(false);
//     }
//   } else {
//     console.log("Ethereum is not present");
//   }
// };
// const { setIsLoading, notify } = useContext(PlatformContext);

export const addProfile = async (file, formData) => {
  // setIsLoading(true);
  try {
    const { username, skills, languages, rate, availability, address } =
      formData;
    let avatar;
    if (file) {
      avatar = await onAvatarUploadHandler(file);
    } else {
      avatar = "";
    }
    const profileToSend = {
      avatar,
      username,
      skills,
      languages,
      rate,
      availability,
      address,
    };
    console.log(profileToSend);
    await axios.post("/api/profiles/new", profileToSend);
    notify("Profile saved successfully.", null, "success");
    window.location.reload();
  } catch (error) {
    console.log(error);
    notify(`${error.message}. ${error.response.data.msg}`, null, "error");
  }
  // setIsLoading(false);
};

export const updateProfile = async (file, formData, id) => {
  // setIsLoading(true);
  try {
    const { username, skills, languages, rate, availability, address } =
      formData;
    let avatar;
    if (file) {
      avatar = await onAvatarUploadHandler(file);
    } else {
      avatar = "";
    }
    const profileToSend = {
      avatar,
      username,
      skills,
      languages,
      rate,
      availability,
      address,
    };
    console.log(profileToSend);
    await axios.post(`/api/profiles/${id}`, profileToSend);
    notify("Profile saved successfully.", null, "success");
    window.location.reload();
  } catch (error) {
    console.log(error);
    notify(`${error.message}. ${error.response.data.msg}`, null, "error");
  }
  // setIsLoading(false);
};

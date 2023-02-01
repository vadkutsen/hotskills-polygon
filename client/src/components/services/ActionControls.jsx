import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AuthorActions from "./AuthorActions";
import RequestService from "./RequestService";
import { loginUser } from "../../redux/features/auth/authSlice";

const ActionControls = ({ service }) => {
  const { user } = useSelector((s) => s.auth);
  const address = window.ethereum?.selectedAddress;
  const dispatch = useDispatch();

  useEffect(() => {
    if (address) {
      try {
        dispatch(loginUser({ address }));
      } catch (error) {
        console.log(error.message);
      }
    }
  }, [address]);
  if (user?._id === service.author) {
    return <AuthorActions service={service} />;
  }
  if (service.status === 0) {
    return <RequestService service={service} />;
  }
  return null;
};

export default ActionControls;

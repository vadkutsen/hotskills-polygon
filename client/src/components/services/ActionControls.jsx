import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";
import AuthorActions from "./AuthorActions";
import { ServiceStatuses } from "../../utils/constants";
import RequestService from "./RequestService";

const ActionControls = ({ service }) => {
  // const { currentAccount } = useContext(AuthContext);
  const currentAccount = window.ethereum?.selectedAccount;
  if (service.author?.toLowerCase() === currentAccount?.toLowerCase()) {
    return <AuthorActions service={service} />;
  }
  if (service.status === 0) {
    return <RequestService service={service} />;
  }
  return null;
};

export default ActionControls;

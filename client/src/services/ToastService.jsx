import { toast } from "react-toastify";
import { networks } from "../utils/networks";

const MessageDisplay = ({ message, hash }) => (
  <div className="w-full">
    <p>{message}</p>
    {hash && (
      <a
        className="text-[#6366f1]"
        href={`${networks.testnet.blockExplorerUrls[0]}/tx/${hash}`}
        target="_blank"
        rel="noreferrer"
      >
        Check in etherscan
      </a>
    )}
  </div>
);

export const notify = (message, hash, type) => {
  if (type === "success") {
    console.log("notify called");
    toast.success(<MessageDisplay message={message} hash={hash} />, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  } else if (type === "error") {
    toast.error(<MessageDisplay message={message} hash={hash} />, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  } else {
    toast(<MessageDisplay message={message} hash={hash} />, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
};

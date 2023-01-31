import MetaMaskOnboarding from "@metamask/onboarding";
import React from "react";
import { useDispatch } from "react-redux";
import { AuthContext } from "../context/AuthContext";

const ONBOARD_TEXT = "Install MetaMask";
const CONNECT_TEXT = "Connect Wallet";
const CONNECTED_TEXT = "Connected";

export function OnboardingButton({ setAddress }) {
  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const onboarding = React.useRef();
  // const { setCurrentAccount } = React.useContext(AuthContext);
  // const dispatch = useDispatch();
  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        // setCurrentAccount(accounts[0]);
        // dispatch({ type: "connected", account: accounts[0] });
        setAddress(accounts[0]);
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  React.useEffect(() => {
    function handleNewAccounts(newAccounts) {
      setAccounts(newAccounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleNewAccounts);
      window.ethereum.on("accountsChanged", handleNewAccounts);
      return () => {
        window.ethereum.removeListener("accountsChanged", handleNewAccounts);
      };
    }
  }, []);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts) => setAccounts(newAccounts));
    } else {
      onboarding.current.startOnboarding();
    }
  };

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className="flex flex-row justify-center items-center gap-1 bg-[#2952e3] pt-2 pb-2 pl-2 pr-3 rounded-2xl cursor-pointer hover:bg-[#2546bd] w-40"
    >
      {buttonText}
    </button>
  );
}

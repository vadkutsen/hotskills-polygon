import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../../images/aurora-logo.png";

const ConnectWalletButton = () => {
  const { connectWallet } = useContext(AuthContext);
  return (
    <button
      type="button"
      onClick={connectWallet}
      className="flex flex-row justify-center items-center gap-1 bg-[#2952e3] pt-1 pb-1 pl-2 pr-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
    >
      <img alt="Aurora logo" className="w-6 h-6 self-center rounded-full" src={logo} />
      <p className="text-white text-base font-semibold">Connect Wallet</p>
    </button>
  );
};

export default ConnectWalletButton;

import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../../images/polygonlogo.png";
import { networks } from "../utils/networks";

const ConnectWalletButton = () => {
  const { connectWallet, switchNetwork, networkId } = useContext(AuthContext);
  if (networkId !== networks.testnet.chainId) {
    return (
      <div className="flex flex-col w-full text-white justify-center items-center">
        <button
          type="button"
          onClick={switchNetwork}
          className="flex flex-row justify-center items-center gap-1 bg-[#2952e3] pt-1 pb-1 pl-2 pr-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
        >
          <p className="text-white text-base font-semibold">Switch Network</p>
        </button>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={connectWallet}
      className="flex flex-row justify-center items-center gap-1 bg-[#2952e3] pt-2 pb-2 pl-2 pr-3 rounded-2xl cursor-pointer hover:bg-[#2546bd] w-40"
    >
      <img alt="Polygon logo" className="w-4 h-4 self-center" src={logo} />
      <p className="text-white text-base font-semibold">Connect Wallet</p>
    </button>
  );
};

export default ConnectWalletButton;

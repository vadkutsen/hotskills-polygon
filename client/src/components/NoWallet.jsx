import { React } from "react";

function NoWallet() {
  return (
    <div className="h-screen flex flex-col w-full justify-center items-center gap-3 text-xl">
      <p className="text-center text-white">
        Wallet not found. Please install Metamask to use this app: <a href="https://metamask.io/download.html" target="_blank" rel="noreferrer" className="text-blue-400">https://metamask.io/download.html</a>
      </p>
    </div>
  );
}

export default NoWallet;

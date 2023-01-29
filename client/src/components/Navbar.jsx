import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import logo1 from "../../images/logo-white.svg";
import logo2 from "../../images/polygonlogo.png";
import Wallet from "./Wallet";
import ConnectWalletButton from "./ConnectWalletButton";
import Notifications from "./Notifications";
import { networks } from "../utils/networks";

const NavBarItem = ({ title, classprops }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
);

const Navbar = () => {
  const { currentAccount, networkId } = useContext(AuthContext);
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.9] flex-initial justify-center items-center">
        <Link to="/">
          <div className="flex gap-2 text-white text-2xl cursor-pointer font-bold">
            <img alt="Brand logo" className="h-6 self-center" src={logo1} />
            <b>
              <span className="text-pink-400">HOT</span>SKILLS
            </b>
            <img alt="Network logo" className="h-5 self-center" src={logo2} />
          </div>
        </Link>
      </div>
      <div className="text-white md:flex hidden list-none flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          <NavLink end to="/tasks" className={({ isActive }) => (isActive && "text-blue-300")}>
            <NavBarItem title="Find Tasks" />
          </NavLink>
          <NavLink end to="/services" className={({ isActive }) => (isActive && "text-blue-300")}>
            <NavBarItem title="Find Freelancers" />
          </NavLink>
          <NavLink end to="/services/new" className={({ isActive }) => (isActive && "text-blue-300")}>
            <NavBarItem title="Add Service" />
          </NavLink>
          <NavLink end to="/tasks/new" className={({ isActive }) => (isActive && "text-blue-300")}>
            <NavBarItem title="Add Task" />
          </NavLink>
          <Notifications />
          {currentAccount ? <Wallet /> : <ConnectWalletButton />}
        </div>
      </div>
      <div className="flex relative">
        {!toggleMenu && (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        )}
        {toggleMenu && (
          <ul
            className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
          >
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            <NavLink end to="/tasks" className={({ isActive }) => (isActive && "text-blue-300")}>
              <NavBarItem title="Find Tasks" />
            </NavLink>
            <NavLink end to="/services" className={({ isActive }) => (isActive && "text-blue-300")}>
              <NavBarItem title="Find Freelancers" />
            </NavLink>
            <NavLink end to="/services/new" className={({ isActive }) => (isActive && "text-blue-300")}>
              <NavBarItem title="Add Service" />
            </NavLink>
            <NavLink end to="/tasks/new" className={({ isActive }) => (isActive && "text-blue-300")}>
              <NavBarItem title="Add Task" />
            </NavLink>
            <Notifications />
            <li>
              {currentAccount ? <Wallet /> : <ConnectWalletButton />}
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

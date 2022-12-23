import { Fragment, useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
import { AiFillBell } from "react-icons/ai";
import { PlatformContext } from "../context/PlatformContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Notifications() {
  const { notifications, setNotifications } = useContext(PlatformContext);
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full font-medium text-white bg-transparent rounded-md shadow-sm focus:outline-none">
          <AiFillBell size={24} />
          {notifications.length > 0 && <span className="text-xs absolute -top-2 -right-2 p-0.5 border rounded-full bg-red-500">{notifications.length}</span>}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right text-white bg-transparent white-glassmorphism rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <div
                  className={classNames(
                    active
                      ? "bg-[#2546bd] text-white"
                      : "text-white",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  {notifications.length > 0 ? notifications.map((n, i) => <p key={i}>{n}</p>) : "No new notifications"}
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

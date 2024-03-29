import React, { useContext, useState, useEffect } from "react";
// import { ethers } from "ethers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import { PlatformContext } from "../context/PlatformContext";
import { TaskContext } from "../context/TaskContext";
// import { AuthContext } from "../context/AuthContext";
import { Loader } from "../components";
import { Categories, TaskTypes } from "../utils/constants";
import { networks } from "../utils/networks";

import "react-datepicker/dist/react-datepicker.css";
import { ImWarning } from "react-icons/im";

const FormField = ({ placeholder, name, type, value, handleChange }) => {
  switch (name) {
    case "category":
      return (
        <select
          className="appearance-none w-full bg-transparent border text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 light:text-gray-800"
          value={value}
          type={type}
          onChange={(e) => handleChange(e, name)}
        >
          {Categories.map((c, i) => <option className="white-glassmorphism" key={i} value={c}>{c}</option>)}
        </select>
      );
    case "taskType":
      return (
        <select
          className="appearance-none w-full bg-transparent border text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 light:text-gray-800"
          value={value}
          type={type}
          onChange={(e) => handleChange(e, name)}
        >
          {Object.keys(TaskTypes).map((k) => <option className="white-glassmorphism" key={k} value={k}>{TaskTypes[k]}</option>)}
        </select>
      );
    case "description":
      return (
        <textarea
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => handleChange(e, name)}
          className="my-2 w-full rounded-sm p-2 outline-none bg-transparent min-h-[12rem] text-white border-none text-sm white-glassmorphism"
        />
      );
    default:
      return (
        <input
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => handleChange(e, name)}
          className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border text-sm"
        />
      );
  }
};

export default function NewTask() {
  const { isLoading, fee, balance } = useContext(PlatformContext);
  const { handleChange, addTask, formData, calculateTotalAmount } = useContext(TaskContext);

  const [dueDate, setDueDate] = useState(new Date());

  const handleSubmit = (e) => {
    const { title, description, reward } = formData;
    e.preventDefault();
    if (!title || !description || !reward) return;
    addTask();
  };

  // const totalAmount = (
  //   parseFloat(formData.reward) + parseFloat((formData.reward / 100) * fee) || 0
  // );

  return (
    <div className="flex w-full justify-center items-start min-h-screen">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white py-1">
            New Task
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Just add a task and enjoy how fast it will be executed.
          </p>
        </div>

        <div className="flex flex-col flex-2 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-500 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Category
              </span>
              <div className="relative">
                <FormField
                  name="category"
                  type="select"
                  handleChange={handleChange}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  />
                </div>
              </div>
            </div>
            <FormField
              placeholder="Title"
              name="title"
              type="text"
              handleChange={handleChange}
            />
            <FormField
              placeholder="Description"
              name="description"
              type="text"
              handleChange={handleChange}
            />
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-500 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Type
              </span>
              <div className="relative">
                <FormField
                  name="taskType"
                  type="select"
                  handleChange={handleChange}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  />
                </div>
              </div>
            </div>
            <div className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism">
              <span
                className="block tracking-wide text-gray-500 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Due Date
              </span>
              <DatePicker
                selected={formData.dueDate}
                onChange={(date) => handleChange(date, "dueDate")}
                className="w-full bg-transparent border text-white py-3 px-4 pr-8 rounded"
              />
            </div>
            <p className="text-white self-end">Balance: {balance} {networks.testnet.nativeCurrency.symbol}</p>
            <div className="flex flex-row w-full gap-2">
              <FormField
                placeholder="Reward"
                name="reward"
                min="0"
                type="number"
                handleChange={handleChange}
              />
              <span className="text-white self-center">{networks.testnet.nativeCurrency.symbol}</span>
            </div>
            <div className="flex justify-centers items-center gap-2 text-white">
              <ImWarning color="green" className="w-36" />
              <i className="text-sm">
                Reward amount will be securely locked in the contract and will be paid after the task result is approved by you or will be returned if you delete the task.
              </i>
            </div>
            <div className="h-[1px] w-full bg-gray-400 my-2" />
            <p className="text-white text-center">
              Total amount to pay (including {fee}% portal fee): {calculateTotalAmount(formData.reward, fee)}{" "}
              {networks.testnet.nativeCurrency.symbol}
            </p>
            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
              >
                Add Task
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

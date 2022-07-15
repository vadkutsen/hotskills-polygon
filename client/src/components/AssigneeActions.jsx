import { useContext, useState, useEffect } from "react";
import { PlatformContext } from "../context/PlatformContext";
import IpfsForm from "./IpfsForm";

const AssigneeActions = () => {
  const { project, unassignProject, submitResult, ipfsUrl } =
    useContext(PlatformContext);
  const [result, setResult] = useState("");

  useEffect(() => {
    setResult(ipfsUrl);
  }, [ipfsUrl]);

  const handleChange = (e) => {
    setResult(e.target.value);
  };
  const handleSubmit = (e) => {
    if (result === "") return;
    e.preventDefault();
    submitResult(project.id, result);
  };
  if (project.result) {
    return (
      <p className="mt-5 text-2xl text-white text-basetext-white">
        Result submitted. Waiting for completion from the author.
      </p>
    );
  }
  return (
    <div>
      <button
        type="button"
        className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
        onClick={() => unassignProject(project.id)}
      >
        Unassign
      </button>
      <IpfsForm />
      <input
        className="my-2 w-9/12 rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        placeholder="Result Link"
        name="result"
        type="text"
        value={result}
        onChange={handleChange}
      />
      <button
        type="button"
        className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
        onClick={handleSubmit}
      >
        Submit Result
      </button>
    </div>
  );
};

export default AssigneeActions;

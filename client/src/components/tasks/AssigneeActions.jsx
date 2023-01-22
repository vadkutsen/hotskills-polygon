import { useContext, useState } from "react";
import { FaStar } from "react-icons/fa";
import { ImWarning } from "react-icons/im";
import { PlatformContext } from "../../context/PlatformContext";
import { TaskStatuses } from "../../utils/constants";
import IpfsForm from "./IpfsForm";
import { unassignTask, submitResult } from "../../services/TaskService";

const AssigneeActions = (params) => {
  const { task } = params;
  const { rateUser, openDispute, arbiterReward, setIsLoading } = useContext(PlatformContext);
  const [result, setResult] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSubmit = (e) => {
    if (result === "" && selectedFiles.length === 0) return;
    e.preventDefault();
    setIsLoading(true);
    submitResult(task.id, result, selectedFiles).then(() => setIsLoading(false));
  };

  const handleClick = (e) => {
    if (rating === 0) return;
    e.preventDefault();
    setIsLoading(true);
    rateUser(task.author, rating).then(() => setIsLoading(false));
  };

  const handleOpenDispute = (e) => {
    e.preventDefault();
    setIsLoading(true);
    openDispute(task.id).then(() => setIsLoading(false));
  };

  const calculateDaysLeft = (date) => {
    const currentTime = new Date();
    console.log(currentTime);
    const prevTime = new Date(date);
    console.log(date);
    console.log(prevTime);
    const differenceInTime = currentTime.getTime() - prevTime.getTime();
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
    return differenceInDays;
  };

  if (task.status === TaskStatuses[1]) {
    return (
      <div>
        <IpfsForm selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
        <input
          className="my-2 w-9/12 rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
          placeholder="Result Link"
          name="result"
          type="text"
          value={result}
          onChange={(e) => setResult(e.target.value)}
        />
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-2 w-1/6 text-white rounded-2xl cursor-pointer hover:bg-[#2546bd]"
          onClick={handleSubmit}
        >
          Submit Result
        </button>
        <p className="mt-5 text-2xl text-white">
          Cannot complete the task? Please unassign yourself.
        </p>
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-yellow-700 p-2 w-1/6 text-white rounded-2xl cursor-pointer hover:bg-[#2546bd]"
          onClick={() => {
            setIsLoading(true);
            unassignTask(task.id).then(() => setIsLoading(false));
          }}
        >
          Unassign
        </button>
      </div>
    );
  }

  if (task.status === TaskStatuses[2]) {
    return (
      <>
        <p className="mt-5 text-2xl text-white text-basetext-white">
          Result submitted. Waiting for approval from the author.
        </p>
        <p>
          Feel free to request payment if you did not receive your reward within
          10 days
        </p>
        <p>
          (Request Payment will be available in{" "}
          {calculateDaysLeft(task.lastStatusChangeAt)} days)
        </p>
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-2 w-1/6 text-white rounded-2xl cursor-pointer hover:bg-[#2546bd]"
        >
          Request Payment
        </button>
      </>
    );
  }

  if (task.status === TaskStatuses[3]) {
    return (
      <div>
        <div className="flex gap-2 justify-center items-center">
          <ImWarning size={32} color="yellow" />
          <p className="text-2xl">
            Changes requested form the author! Please re-submit your result.
          </p>
        </div>
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-yellow-700 pl-2 w-1/6 text-white rounded-2xl cursor-pointer hover:bg-[#2546bd]"
          onClick={() => unassignTask(task.id)}
        >
          Unassign
        </button>
        <IpfsForm selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
        <input
          className="my-2 w-9/12 rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
          placeholder="Result Link"
          name="result"
          type="text"
          value={result}
          onChange={(e) => setResult(e.target.value)}
        />
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-2 w-1/6 text-white rounded-2xl cursor-pointer hover:bg-[#2546bd]"
          onClick={handleSubmit}
        >
          Re-submit Result
        </button>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="flex flex-row justify-center items-center my-5 bg-red-700 p-2 w-1/6 text-white rounded-2xl cursor-pointer hover:bg-[#2546bd]"
            onClick={handleOpenDispute}
          >
            Open Dispute
          </button>
          <div className="flex justify-centers items-center gap-2">
            <ImWarning size={32} color="yellow" />
            <p>
              Dispute is a paid function. We will charge {arbiterReward}% of the
              task reward in order to reward the dispute arbiter.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If the task is disputed
  if (task.status === TaskStatuses[4]) {
    return (
      <div>
        <p>Dispute opened. Please wait for the arbiter decision.</p>
      </div>
    );
  }

  if (task.status === TaskStatuses[5]) {
    return (
      <div>
        <p className="mt-5 text-2xl text-white text-basetext-white">
          Congrats! Your task is complete. The reward is sent to your wallet.
        </p>
        <p className="mt-3 text-white">Please rate the task author</p>
        <div className="flex flex-row">
          {[...Array(5)].map((star, i) => {
            const ratingValue = i + 1;
            return (
              <label key={i}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  style={{ display: "none" }}
                  onClick={() => setRating(ratingValue)}
                />
                <FaStar
                  color={
                    ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                  }
                  size={40}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            );
          })}
        </div>
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-[#134e4a] p-2 text-white rounded-2xl cursor-pointer hover:bg-[#2546bd]"
          onClick={handleClick}
        >
          Rate The Task Author
        </button>
      </div>
    );
  }
  return null;
};

export default AssigneeActions;

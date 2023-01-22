import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { PlatformContext } from "../../context/PlatformContext";
import AuthorActions from "./AuthorActions";
import AssigneeActions from "./AssigneeActions";
import CandidateActions from "./CandidateActions";
import { applyForTask } from "../../services/TaskService";

const ActionButton = (params) => {
  const { task } = params;
  const { currentAccount } = useContext(AuthContext);
  const { setIsLoading } = useContext(PlatformContext);

  const isCandidate = () => {
    for (let i = 0; i < task.candidates.length; i += 1) {
      if (task.candidates && task.candidates[i].toLowerCase() === currentAccount.toLowerCase()) {
        return true;
      }
    }
    return false;
  };

  const handleClick = () => {
    setIsLoading(true);
    applyForTask(task.id).then(() => setIsLoading(false));
  };

  let button;
  if (task.author && task.author.toLowerCase() === currentAccount.toLowerCase()) {
    button = <AuthorActions task={task} />;
  } else if (
    task.assignee && task.assignee !== "Unassigned" &&
    task.assignee.toLowerCase() !== currentAccount.toLowerCase()
  ) {
    button = <p />;
  } else if (task.assignee && task.assignee.toLowerCase() === currentAccount.toLowerCase()) {
    button = <AssigneeActions task={task} />;
  } else if (task.candidates && isCandidate()) {
    button = <CandidateActions task={task} />;
  } else {
    button = (
      <div>
        <button
          type="button"
          onClick={handleClick}
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
        >
          Apply
        </button>
      </div>
    );
  }
  return button;
};

export default ActionButton;

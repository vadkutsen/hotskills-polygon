import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { PlatformContext } from "../context/PlatformContext";
import { TaskContext } from "../context/TaskContext";
import { Loader, ActionControls, Candidates } from "../components";
import { TaskStatuses, TaskTypes } from "../utils/constants";

import AutoAvatar from "../components/AutoAvatar";
import { shortenAddress } from "../utils/shortenAddress";
import { networks } from "../utils/networks";

export default function Task() {
  const params = useParams();
  const { isLoading } = useContext(PlatformContext);
  const { formatTask, getTask, composeAuthorProfile } = useContext(TaskContext);
  const taskId = params.id;
  const [authorProfile, setAuthorProfile] = useState(null);
  const [task, setTask] = useState(null);

  useEffect(() => {
    getTask(taskId).then((t) => {
      setTask(formatTask(t));
    });
    // composeAuthorProfile(task.author).then((a) => setAuthorProfile(a));

    return () => {
      // this now gets called when the component unmounts
      // setAuthorProfile(null);
    };
  }, []);

  if (task) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto flex flex-row self-center items-start white-glassmorphism p-3 text-white">
          <div className="ml-5 flex flex-col flex-1">
            <h3 className="mt-2 text-4xl">{task.title}</h3>
            <div className="flex flex-row gap-2 items-center">
              <div className="mt-2 text-center white-glassmorphism w-4/12">
                {task.category}
              </div>
              <div className="mt-2 text-center white-glassmorphism w-4/12">
                {task.taskType}
              </div>
              <div className="mt-2 text-center white-glassmorphism w-4/12 ">
                {task.status} {task.lastStatusChangeAt}
              </div>
            </div>
            <p className="mt-1 text-2xl md:w-9/12">
              {task.description}
            </p>
            <div className="pt-4 flex flex-row gap-2 items-center italic">
              {authorProfile && authorProfile.profile.avatar ?
                <img alt="Avatar" className="w-[2.5rem] mr-1 rounded-full border" src={authorProfile.profile.avatar} />
                : <AutoAvatar userId={task.author} size={36} />}
              {authorProfile && authorProfile.profile.username ? <span>{authorProfile.profile.username} ({shortenAddress(task.author)})</span> : shortenAddress(task.author)}
              <div className="flex flex-row justify-center items-center">
                <FaStar color="#ffc107" />
                {authorProfile && authorProfile.rating.toFixed(1)}
              </div>
            </div>
            <p className="mt-1 italic text-sm">
              {task.createdAt}
            </p>
            <p className="mt-1 text-sm md:w-9/12">
              Assignee: {task.assignee !== "Unassigned" ? shortenAddress(task.assignee) : task.assignee}
            </p>
            {task.changeRequests && (
              <div className="mt-1 text-l w-9/12 white-glassmorphism mt-2 mb-2">
                Change Requests:{" "}
                {task.changeRequests.map((c, i) => (
                  <div key={i}>
                    {i + 1}: {c}
                  </div>
                ))}
              </div>
            )}
            <p className="mt-1 text-sm md:w-9/12">
              Result:{" "}
              {task.result ? (
                <a
                  rel="noreferrer"
                  className="text-[#6366f1]"
                  href={task.result}
                  target="_blank"
                >
                  {task.result}
                </a>
              ) : (
                "Not submitted yet"
              )}
            </p>
            {task.taskType !== TaskTypes[0] &&
              (
                <div className="mt-2 pt-2 flex flex-col w-full blue-glassmorphism justify-center items-center">
                  <span>Candidates applied: {task.candidates ? task.candidates.length : 0}</span>
                  {task.candidates && task.candidates.length > 0 ?
                    <div className="w-6/12">{task.candidates && <Candidates candidates={task.candidates} />}</div> : null}
                </div>
              )}
            {task.status === TaskStatuses[4] && (
              <p className="mt-1 italic text-sm md:w-9/12">
                Completed at: {task.completedAt}
              </p>
            )}

            {isLoading ? (
              <Loader />
            ) : (
              <ActionControls task={task} />
            )}
          </div>
          <div>
            <p className="mt-2 text-2xl">{task.reward} {networks.testnet.nativeCurrency.symbol}</p>
          </div>
          <ToastContainer />
        </div>
      </div>
    );
  }

  return (
    <p className="text-white text-center">Fetching data. Please wait.</p>
  );
}

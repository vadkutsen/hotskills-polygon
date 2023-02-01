import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPause, FaTrashAlt, FaPlay, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import { ServiceStatuses } from "../../utils/constants";
import {
  // deleteService,
  pauseService,
  resumeService,
  editService,
} from "../../services/ServiceService";
import { notify } from "../../services/ToastService";
import { deleteService } from "../../redux/features/service/serviceSlice";

const AuthorActions = ({ service }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleDelete = () => {
    try {
      dispatch(deleteService(service._id));
      notify("Service deleted.", null, "success");
      navigate("/services");
    } catch (error) {
      console.log(error);
      notify(error.message, null, "error");
    }
  };

  return (
    <div className="flex flex-row gap-2">
      {service?.status === 0 ? (
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-yellow-700 p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
          onClick={() => pauseService(service._id)}
        >
          <FaPause />
        </button>
      ) : (
        <button
          type="button"
          className="flex flex-row justify-center items-center my-5 bg-green-700 p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
          onClick={() => resumeService(service._id)}
        >
          <FaPlay />
        </button>
      )}
      <button
        type="button"
        className="flex flex-row justify-center items-center my-5 bg-[#1fe4ca52] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
        onClick={() => editService(service._id)}
      >
        <FaEdit />
      </button>
      <button
        type="button"
        className="flex flex-row justify-center items-center my-5 bg-[#831843] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
        onClick={handleDelete}
      >
        <FaTrashAlt />
      </button>
    </div>
  );
};

export default AuthorActions;

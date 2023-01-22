import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
// import { TaskContext } from "../../context/TaskContext";

const MAX_COUNT = 5;

const IpfsForm = ({ selectedFiles, setSelectedFiles }) => {
  const [fileLimit, setFileLimit] = useState(false);
  const handleUploadFiles = (files) => {
    const selected = [...selectedFiles];
    let limitExceeded = false;
    files.some((file) => {
      if (selected.findIndex((f) => f.name === file.name) === -1) {
        selected.push(file);
        if (selected.length === MAX_COUNT) setFileLimit(true);
        if (selected.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) setSelectedFiles(selected);
  };

  const handleFileEvent = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  return (
    <div>
      <p className="mt-5 text-2xl text-white">
        Select result files (up to {MAX_COUNT} - we will store them on IPFS/Filecoin)
      </p>
      <p className="text-2xl text-white">
        or paste a link to your results from any other hosting.
      </p>
      <input
        id="fileUpload"
        type="file"
        name="file"
        multiple
        onChange={handleFileEvent}
        disabled={fileLimit}
        className="hidden"
      />
      <label htmlFor="fileUpload">
        <a
          className={`${
            !fileLimit ? "" : "disabled"
          } flex flex-row justify-center items-center my-5 bg-[#2952e3] p-2 w-1/6 text-white rounded-2xl cursor-pointer hover:bg-[#2546bd]`}
        >
          Choose Files
        </a>
      </label>
      <div className="uploaded-files-list">
        {selectedFiles.map((file, i) => (
          <div key={i} className="flex items-center gap-2">
            {file.name}
            <button
              type="button"
              onClick={() => setSelectedFiles((current) => current.filter((f) => f !== file))}
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IpfsForm;

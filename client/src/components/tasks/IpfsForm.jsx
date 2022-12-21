import { useContext, useState } from "react";
import { TaskContext } from "../../context/TaskContext";

const MAX_COUNT = 5;

const IpfsForm = () => {
  const { onUploadHandler, selectedFiles, setSelectedFiles } = useContext(TaskContext);
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
        Select result files (up to 5 - we will store them on IPFS)
      </p>
      <p className="text-2xl text-white">
        or paste a link to your results from any other hosting.
      </p>
      {/* <form onSubmit={onUploadHandler}> */}
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
            Select Files
          </a>
        </label>
        {/* <button
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
          id="upload-btn"
          type="submit"
        >
          Upload File
        </button> */}
      {/* </form> */}
      <div className="uploaded-files-list">
        {selectedFiles.map((file, i) => (
          <div key={i}>{file.name}</div>
        ))}
      </div>
    </div>
  );
};

export default IpfsForm;

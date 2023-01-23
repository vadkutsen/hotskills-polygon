import { useContext, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { ServiceContext } from "../../context/ServiceContext";

const MAX_COUNT = 5;

const IpfsForm = () => {
  const { selectedFiles, setSelectedFiles } = useContext(ServiceContext);
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
      <p className="mt-5 text-white">
        Upload images (up to {MAX_COUNT}) to your service gallery
      </p>
      <input
        id="fileUpload"
        type="file"
        name="file"
        multiple
        onChange={handleFileEvent}
        disabled={fileLimit}
        className="hidden"
        accept="image/png,image/jpeg,image/gif"
      />
      <label htmlFor="fileUpload">
        <a
          className={`${
            !fileLimit ? "" : "disabled"
          } flex flex-row justify-center items-center my-5 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] text-white rounded-2xl cursor-pointer`}
        >
          Choose Files
        </a>
      </label>
      <div className="uploaded-files-list">
        {selectedFiles.map((file, i) => (
          <div key={i} className="flex gap-2">
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

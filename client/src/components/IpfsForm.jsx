import { useState } from "react";

const IpfsForm = (props) => {
  const IPFS = window.IpfsCore;
  let ipfs;
  const [images, setImages] = useState([]);
  const { onFileUpload } = props;
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    const { files } = form[0];
    if (!files || files.length === 0) {
      return alert("No files selected");
    }
    const file = files[0];
    // uload files
    const result = await ipfs.add(file);
    const url = `https://ipfs.infura.io/ipfs/${result.path}`;
    onFileUpload(url);
    setImages([
      ...images,
      {
        cid: result.cid,
        path: result.path,
      },
    ]);
    form.reset();
  };

  try {
    ipfs = IPFS.create({
      url: "https://ipfs.infura.io:5001/api/v0",
    });
  } catch (e) {
    console.log("IPFS error: ", e);
  }
  if (!ipfs) {
    return (
      <div>
        <p className="mt-5 text-2xl text-white text-basetext-white">
          Not connected to IPFS. Check out the logs for errors.
        </p>
      </div>
    );
  }
  return (
    <div>
      <p className="mt-5 text-2xl text-white text-basetext-white">
        Upload file using IPFS or paste a link to your result on any other
        hosting
      </p>
      <form onSubmit={onSubmitHandler}>
        <input
          className="mt-5 text-l text-white text-basetext-white"
          type="file"
          name="file"
        />
        <button
          className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 w-1/6 text-white rounded-full cursor-pointer hover:bg-[#2546bd]"
          id="upload-btn"
          type="submit"
        >
          Upload File
        </button>
      </form>
      <div>
        {images.map((image, index) => (
          <img
            alt={`Uploaded #${index + 1}`}
            src={`https://ipfs.infura.io/ipfs/${image.path}`}
            style={{ maxWidth: "400px", margin: "15px" }}
            key={image.cid.toString() + index}
          />
        ))}
      </div>
    </div>
  );
};

export default IpfsForm;

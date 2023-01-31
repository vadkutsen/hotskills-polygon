import { Web3Storage } from "web3.storage";

const client = new Web3Storage({
  token: import.meta.env.VITE_WEB3_STORAGE_TOKEN,
});

export const onResultUploadHandler = async (files) => {
  if (!files || files.length === 0) {
    return;
  }
  const rootCid = await client.put(files);
  const info = await client.status(rootCid);
  // const res = await client.get(rootCid);
  const url = `https://${info.cid}.ipfs.w3s.link/`;
  return url;
};

export const onGalleryUploadHandler = async (files) => {
  if (!files || files.length === 0) {
    // return alert("No files selected");
    return;
  }
  const rootCid = await client.put(files);
  const info = await client.status(rootCid);
  // const res = await client.get(rootCid);
  const urls = files.map((f) => `https://${info.cid}.ipfs.w3s.link/${f.name}`);
  // const url = `https://${info.cid}.ipfs.w3s.link/${files[0].name}`;
  console.log(urls);
  return urls;
};

export const onAvatarUploadHandler = async (files) => {
  if (!files || files.length === 0) {
    return alert("No files selected");
  }
  const rootCid = await client.put(files);
  const info = await client.status(rootCid);
  // const res = await client.get(rootCid);
  const url = `https://${info.cid}.ipfs.w3s.link/${files[0].name}`;
  return url;
};
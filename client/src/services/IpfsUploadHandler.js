import { Web3Storage } from "web3.storage";

export const onUploadHandler = async (files) => {
  const client = new Web3Storage({
    token: import.meta.env.VITE_WEB3_STORAGE_TOKEN,
  });
  if (!files || files.length === 0) {
    return;
  }
  const rootCid = await client.put(files);
  const info = await client.status(rootCid);
  // const res = await client.get(rootCid);
  const url = `https://${info.cid}.ipfs.w3s.link/`;
  return url;
};

import abi from "./contractABI.json";

export const contractAddress = "0x514c30EF4e3DC81f9E5a89c42eF9c8b1dC5E4F50";
export const contractABI = abi.abi;

export const address0 = "0x0000000000000000000000000000000000000000";

export const TaskTypes = {
  0: "First Come First Serve",
  1: "Casting",
};

export const TaskStatuses = {
  0: "Active",
  1: "Assigned",
  2: "In Review",
  3: "Change Requested",
  4: "Disputed",
  5: "Completed",
};

export const ServiceStatuses = {
  0: "Active",
  1: "Paused",
};

export const Categories = [
  "Programming & Tech",
  "Writing & Translation",
  "Video & Animation",
  "Music & Audio",
  "Data",
  "Business",
  "Lifestyle",
  "Other",
];


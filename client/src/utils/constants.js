import abi from "./contractABI.json";

export const contractAddress = "0x962fb9A80116e779Ea960439a6D1d5e8F1f9e5D7";
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


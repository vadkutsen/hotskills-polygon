import { useState } from "react";
// import { PlatformContext } from "../../context/PlatformContext";
// import { ServiceContext } from "../../context/ServiceContext";
import { networks } from "../../utils/networks";

const RequestService = (params) => {
  const { service } = params;
  // const { requestService, calculateTotalAmount } = useContext(ServiceContext);
  // const { fee } = useContext(PlatformContext);

  const date = new Date();
  const [formData, setformData] = useState({
    category: service.category,
    title: service.title,
    description: "",
    taskType: "1",
    assignee: service.author,
    dueDate: date.setDate(date.getDate() + service.deliveryTime),
    reward: service.price,
    // fee
  });

  const handleSubmit = () => {
    // requestService(formData);
  };

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  return (
    <div className="pt-10 flex flex-col items-center justify-start w-full mf:mt-0 mt-10 text-white">
      <div className="p-5 w-full flex flex-col justify-start items-center blue-glassmorphism">
        <span className="block tracking-wide font-bold mb-2">
          Ready to request the service? Describe your task below
        </span>
        <textarea
          className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm blue-glassmorphism"
          placeholder="Detalied description of your task..."
          name="description"
          type="text"
          onChange={(e) => handleChange(e, "description")}
        />
        <div className="h-[1px] w-full bg-gray-400 my-2" />
        <p className="text-white text-center">
          {/* Total amount to pay (including {fee}% portal fee): {calculateTotalAmount(formData.reward, fee)} {networks.testnet.nativeCurrency.symbol} */}
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
        >
          Request Service
        </button>
      </div>
    </div>
  );
};

export default RequestService;

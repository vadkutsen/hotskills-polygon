import { useState, useEffect } from "react";
// import axios from "axios";
import { HiSearch } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader, ServiceCard } from "../components";
import { Categories } from "../utils/constants";
import { getServices } from "../redux/features/service/serviceSlice";

const Services = () => {
  // const [services, setServices] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  const { services } = useSelector((state) => state.service);

  useEffect(() => {
    setIsloading(true);
    dispatch(getServices());
    setIsloading(false);
  }, [dispatch]);

  // const fetchServices = async () => {
  //   setIsloading(true);
  //   const res = await axios.get("/api/services");
  //   setIsloading(false);
  //   return res.data;
  // };

  // useEffect(() => {
  //   fetchServices().then((s) => {
  //     setServices(s);
  //   });
  //   return () => {
  //     // this now gets called when the component unmounts
  //     setServices([]);
  //   };
  // }, []);
  console.log(services);
  const filterByCategory = (filter) => {
    if (filter) {
      setSearchParams({ filter });
    } else {
      setSearchParams({});
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-full justify-start items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full justify-start items-center min-h-screen">
      <div>
        <p className="text-white text-3xl text-center my-2">
          Services ({services?.length})
        </p>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row gap-2 justify-center items-center">
            {Categories.map((c, i) => (
              <button
                type="button"
                className="p-2 text-center text-white white-glassmorphism"
                key={i}
                onClick={() => filterByCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-row w-full justify-center">
            <input
              className="my-2 w-4/12 rounded-sm p-2 outline-none bg-transparent text-white text-sm white-glassmorphism"
              type="search"
              placeholder="Search..."
              value={searchParams.get("filter") || ""}
              onChange={(event) => {
                const filter = event.target.value;
                if (filter) {
                  setSearchParams({ filter });
                } else {
                  setSearchParams({});
                }
              }}
            />
            <span>
              <HiSearch size={30} className="text-gray-500 mt-3" />
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center mt-10 w-9/12">
        {!services?.length ? (
          <p className="text-xl text-white">No services yet</p>
        ) : (
          [...services]
            .filter((p) => {
              const filter = searchParams.get("filter");
              if (!filter) return true;
              const title = p.title.toLowerCase();
              const desc = p.description.toLowerCase();
              const cat = p.category.toLowerCase();
              return (
                title.includes(filter.toLowerCase()) ||
                desc.includes(filter.toLowerCase()) ||
                cat.includes(filter.toLowerCase())
              );
            })
            .map((service, i) => <ServiceCard key={i} {...service} />)
        )}
      </div>
    </div>
  );
};

export default Services;

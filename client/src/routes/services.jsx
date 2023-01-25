import { useState, useEffect } from "react";
import axios from "axios";
import { HiSearch } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import { Loader, ServiceCard } from "../components";
import { Categories } from "../utils/constants";

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchServices = async () => {
    setIsloading(true);
    const res = await axios.get("/api/services");
    setIsloading(false);
    return res.data;
  };

  useEffect(() => {
    fetchServices().then((s) => {
      setServices(s);
    });
    return () => {
      // this now gets called when the component unmounts
      setServices([]);
    };
  }, []);

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
      {services ? (
        <div>
          <p className="text-white text-3xl text-center my-2">
            {services.length === 0
              ? "No services yet"
              : `Services (${services.length})`}
          </p>
          {services.length > 0 && (
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
          )}
        </div>
      ) : (
        <p className="text-white text-3xl text-center my-2">No services yet</p>
      )}
      <div className="flex flex-wrap justify-center items-center mt-10 w-9/12">
        {services.length > 0 &&
          [...services]
            .reverse()
            .filter((p) => {
              const filter = searchParams.get("filter");
              if (!filter) return true;
              const title = p.title.toLowerCase();
              const desc = p.description.toLowerCase();
              const cat = p.category.toLowerCase();
              return title.includes(filter.toLowerCase()) || desc.includes(filter.toLowerCase()) || cat.includes(filter.toLowerCase());
            })
            .map((service, i) => <ServiceCard key={i} {...service} />)}
      </div>
    </div>
  );
};

export default Services;

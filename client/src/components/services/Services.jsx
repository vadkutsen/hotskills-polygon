import { useEffect, useState } from "react";
import axios from "axios";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import usePreventBodyScroll from "../usePreventBodyScroll";
// import { ServiceContext } from "../../context/ServiceContext";
import ServiceCard from "./ServiceCard";
import { LeftArrow, RightArrow } from "../Arrows";
// import { ServiceStatuses } from "../../utils/constants";
import Loader from "../Loader";

function onWheel(apiObj, ev) {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  // const [searchParams, setSearchParams] = useSearchParams();

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

  const { disableScroll, enableScroll } = usePreventBodyScroll();

  return (
    <>
      {isLoading ? <Loader /> : services.length < 1 && (
        <p className="text-white text-2xl text-center my-2">No services yet</p>
      )}
      <div className="text-white pt-10">
        <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
          <ScrollMenu
            LeftArrow={LeftArrow}
            RightArrow={RightArrow}
            onWheel={onWheel}
            className="pt-10"
          >
            {services &&
              [...services]
                .filter((p) => p.status === 0)
                .reverse()
                .slice(0, 5)
                .map((service, i) => (
                  <ServiceCard key={i} itemId={i} {...service} />
                ))}
          </ScrollMenu>
        </div>
      </div>
    </>
  );
};

export default Services;

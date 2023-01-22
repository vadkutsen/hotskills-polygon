import { useEffect, useState } from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import TaskCard from "./TaskCard";
import usePreventBodyScroll from "../usePreventBodyScroll";
import { LeftArrow, RightArrow } from "../Arrows";
import { TaskStatuses } from "../../utils/constants";
import { getAllTasks } from "../../services/TaskService";

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

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const { disableScroll, enableScroll } = usePreventBodyScroll();

  useEffect(() => {
    getAllTasks().then((t) => { setTasks(t); });
    return () => {
      // this now gets called when the component unmounts
      setTasks([]);
    };
  }, []);

  return (
    <>
      {tasks.length < 1 && (
        <p className="text-white text-2xl text-center my-2">No tasks yet</p>
      )}
      <div className="text-white pt-10">
        <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
          <ScrollMenu
            LeftArrow={LeftArrow}
            RightArrow={RightArrow}
            onWheel={onWheel}
            className="pt-10"
          >
            {tasks &&
              [...tasks]
                .filter((p) => p.status === TaskStatuses[0])
                .reverse()
                .slice(0, 5)
                .map((task, i) => <TaskCard key={i} {...task} />)}
          </ScrollMenu>
        </div>
      </div>
    </>
  );
};

export default Tasks;

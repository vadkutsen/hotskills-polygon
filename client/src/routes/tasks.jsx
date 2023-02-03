import { useEffect } from "react";
import { HiSearch } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader, TaskCard } from "../components";
import { Categories } from "../utils/constants";
import { getTasks } from "../redux/features/task/taskSlice";

const Tasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterByCategory = (filter) => {
    if (filter) {
      setSearchParams({ filter });
    } else {
      setSearchParams({});
    }
  };

  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.task);

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   getAllTasks().then((t) => { setTasks(t); });
  //   setIsLoading(false);
  //   return () => {
  //     // this now gets called when the component unmounts
  //     setTasks([]);
  //   };
  // }, []);

  // Event listeners
  // useEffect(() => {
  //   const onNewTask = (t) => {
  //     setTasks((prevState) => [...prevState, formatTask(t)]);
  //     setNotifications((prevState) => [
  //       ...prevState,
  //       <Link to={`/tasks/${t.id}`} onClick={setNotifications([])}>
  //         New task added
  //       </Link>,
  //     ]);
  //   };
  //   if (ethereum) {
  //     contract.on("TaskAdded", onNewTask);
  //   }
  //   return () => {
  //     if (contract) {
  //       contract.off("TaskAdded", onNewTask);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   const onTaskDeleted = (id) => {
  //     setTasks((current) => current.filter((p) => p.id !== id.toNumber()));
  //   };
  //   if (ethereum) {
  //     contract.on("TaskDeleted", onTaskDeleted);
  //   }
  //   return () => {
  //     if (contract) {
  //       contract.off("TaskDeleted", onTaskDeleted);
  //     }
  //   };
  // }, []);

  return (
    <div className="min-h-screen">
      <p className="text-white text-3xl text-center my-2">
        Tasks ({tasks?.length})
      </p>
      <div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-wrap gap-2 justify-center items-center">
            {Categories.map((c, i) => (
              <button
                type="button"
                className="px-2 py-1 text-center text-white white-glassmorphism"
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
      {loading && (
        <div className="flex flex-col w-full justify-start items-center min-h-screen">
          <Loader />
        </div>
      )}
      {!tasks.length ? (
        <p className="text-white text-3xl text-center my-2">No available tasks :(</p>
      ) : (
        <div className="flex flex-wrap justify-center items-center mt-10">
          {tasks &&
            [...tasks]
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
              .map((task, i) => <TaskCard key={i} {...task} />)}
        </div>
      )}
    </div>
  );
};

export default Tasks;

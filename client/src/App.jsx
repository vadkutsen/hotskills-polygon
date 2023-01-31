import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "./components";
import "react-toastify/dist/ReactToastify.css";
import { getMe } from "./redux/features/auth/authSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default App;

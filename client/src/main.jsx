import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import { PlatformProvider } from "./context/PlatformContext";
import MyTasks from "./routes/myTasks";
import Project from "./routes/project";
import "./index.css";
import NewProject from "./routes/new";
import Home from "./routes/home";

ReactDOM.render(
  <PlatformProvider>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="new" element={<NewProject />} />
          <Route path=":id" element={<Project />} />
          <Route
            path="*"
            element={(
              <main className="text-white p-1">
                <h1>There is nothing here!</h1>
              </main>
            )}
          />
          <Route path="mytasks" element={<MyTasks />} />
        </Route>
      </Routes>
    </Router>
  </PlatformProvider>,
  document.getElementById("root")
);

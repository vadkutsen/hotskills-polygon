import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import { PlatformProvider } from "./context/PlatformContext";
// import { TaskProvider } from "./context/TaskContext";
import { ServiceProvider } from "./context/ServiceContext";
import { ProfileProvider } from "./context/ProfileContext";
import { AuthProvider } from "./context/AuthContext";
import MyTasks from "./routes/myTasks";
import MyServices from "./routes/myServices";
import Task from "./routes/task";
import Service from "./routes/service";
import NewTask from "./routes/newTask";
import NewService from "./routes/newService";
import Services from "./routes/services";
import Tasks from "./routes/tasks";
import Home from "./routes/home";
import Profile from "./routes/profile";
import EditProfile from "./routes/editProfile";

ReactDOM.render(
  <AuthProvider>
    <PlatformProvider>
      {/* <TaskProvider> */}
        <ServiceProvider>
          <ProfileProvider>
            <Router>
              <Routes>
                <Route path="/" element={<App />}>
                  <Route index element={<Home />} />
                  <Route exact path="services" element={<Services />} />
                  <Route exact path="services/new" element={<NewService />} />
                  <Route exact path="services/:id" element={<Service />} />
                  <Route exact path="tasks" element={<Tasks />} />
                  <Route exact path="tasks/new" element={<NewTask />} />
                  <Route exact path="tasks/:id" element={<Task />} />
                  <Route exact path="mytasks" element={<MyTasks />} />
                  <Route exact path="myservices" element={<MyServices />} />
                  <Route exact path="profile" element={<Profile />} />
                  {/* <Route path="profile/new" element={<NewProfile />} /> */}
                  <Route exact path="profile/edit" element={<EditProfile />} />
                  <Route
                    path="*"
                    element={(
                      <main className="text-white p-1 min-h-screen">
                        <h1 className="text-center">There is nothing here!</h1>
                      </main>
                    )}
                  />
                </Route>
              </Routes>
            </Router>
          </ProfileProvider>
        </ServiceProvider>
      {/* </TaskProvider> */}
    </PlatformProvider>
  </AuthProvider>,
  document.getElementById("root")
);

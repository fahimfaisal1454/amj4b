import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-8 w-full min-h-screen bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

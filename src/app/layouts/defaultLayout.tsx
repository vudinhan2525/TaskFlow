import { Header } from "@libs/app/components/general-components/user/header";
import { Outlet } from "react-router-dom";
// import { Sidebar } from "../../components/general-components/User/Sidebar";

const DefaultLayout = () => {
  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="flex">
        {/* <Sidebar /> */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;

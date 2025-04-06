import { Header } from "@libs/app/components/general-components/user/header";
import { useAuth } from "@libs/hooks/useAuth";
import { Outlet } from "react-router-dom";
// import { Sidebar } from "../../components/general-components/User/Sidebar";

const DefaultLayout = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAuth();
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

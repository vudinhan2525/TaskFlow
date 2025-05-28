import { Header } from "@libs/app/components/general-components/user/header";
// import { useAuth } from "@libs/hooks/useAuth";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // const { user } = useAuth();

  return (
    <div className="flex h-screen flex-col">
      <Header />

      <Outlet />
    </div>
  );
};

export default DefaultLayout;

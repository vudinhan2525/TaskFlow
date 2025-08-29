import { Header } from "@libs/app/components/general-components/user/header";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // const { user } = useAuth();

  return (
    <div className="flex h-screen flex-col">
      <Header />
    <Suspense fallback={<div>Loading.ddd..</div>}>
      <Outlet />
    </Suspense>
    </div>
  );
};

export default DefaultLayout;

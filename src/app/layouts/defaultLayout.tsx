import { Header } from "@libs/app/components/general-components/user/header";
// import { useAuth } from "@libs/hooks/useAuth";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";

// import { Sidebar } from "../../components/general-components/User/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";

const DefaultLayout = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<< Updated upstream
  const isOpenModal = useSelector((state: RootState) => state.ui.isOpenModal);

  // const { user } = useAuth();
  return (
    <div
      className={`w-full ${isOpenModal ? "h-screen overflow-hidden" : "min-h-screen"}`}
    >
=======
  // const { user } = useAuth();
  const isOpenModal = useSelector((state: RootState) => state.ui.isOpenModal);
  return (
    <div className="min-h-screen w-full">
>>>>>>> Stashed changes
      <Header />
      <div
        className={`w-full ${isOpenModal ? "h-screen overflow-hidden" : "min-h-screen"}`}
      >
        {/* <Sidebar /> */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;

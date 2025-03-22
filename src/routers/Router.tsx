import { Route, Routes } from "react-router-dom";
import DefaultLayout from "../app/layouts/DefaultLayout";
import LoginForm from "../app/(auth)/login/page";
const Router = () => {
  return (
    <Routes>
      <Route>
        <Route path="*" element={<DefaultLayout />}>
          <Route index element={<LoginForm />} />
        </Route>
      </Route>
    </Routes>
  );
};
export default Router;

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import Router from "./routers/router";
import { store } from "./store";
import { queryClient } from "./apis/react-query";
import { ToastContainer } from "react-toastify";
import { NotificationProvider } from "@libs/app/context/notification.context";
import { HelmetProvider } from "react-helmet-async";
import { IssueDetailProvider } from "@libs/app/context/issue-detail.context";

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <NotificationProvider>
            <IssueDetailProvider>
              <HelmetProvider>
                <Router />
              </HelmetProvider>
            </IssueDetailProvider>
          </NotificationProvider>
        </BrowserRouter>
        <ToastContainer />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;

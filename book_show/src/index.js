import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import store from "./store/store";
import { Provider } from "react-redux";
import AutoLogin from "./components/auth/AutoLogin";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AutoLogin>
        <RouterProvider router={router} />
      </AutoLogin>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

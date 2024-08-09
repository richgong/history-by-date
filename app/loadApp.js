import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "mobx-react";

import App from "./App.js";
import Store from "./Store.js";

let store = new Store();
window.store = store;

createRoot(document.getElementById("app")).render(
  <Provider store={store}>
    <App />
  </Provider>
);

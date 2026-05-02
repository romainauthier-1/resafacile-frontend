import "../styles/globals.css";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";

import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";

import { combineReducers, configureStore } from "@reduxjs/toolkit";

import user from "../reducers/user";

const reducers = combineReducers({ user });

const persistConfig = { key: "TemplateApp", storage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Head>
            <title>TemplateApp</title>

            <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />

            <meta name="theme-color" content="#1B365D" />

            <meta name="apple-mobile-web-app-capable" content="yes" />

            <meta
              name="apple-mobile-web-app-status-bar-style"
              content="black-translucent"
            />

            <meta name="apple-mobile-web-app-title" content="TemplateApp" />
          </Head>
          <ToastContainer />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;

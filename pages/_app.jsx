import "../styles/globals.css";
import Head from "next/head";

import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";

import { combineReducers, configureStore } from "@reduxjs/toolkit";

import users from "../reducers/users";
import bookings from "../reducers/bookings";
import restaurants from "../reducers/restaurant";

const reducers = combineReducers({ users, bookings, restaurants });

const persistConfig = { key: "RésaFacile", storage };

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
            <title>📆 RésaFacile</title>

            <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />

            <meta name="theme-color" content="#1B365D" />

            <meta name="mobile-web-app-capable" content="yes" />

            <meta
              name="apple-mobile-web-app-status-bar-style"
              content="black-translucent"
            />

            <meta name="apple-mobile-web-app-title" content="RésaFacile" />
          </Head>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;

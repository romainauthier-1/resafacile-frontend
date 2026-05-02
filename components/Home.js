import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../reducers/user";
import { toast } from "react-toastify";
import Card from "./Card";
import Modal from "./Modal";
import Login from "./Login";

export default function Home() {
  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.states.isConnected);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-3xl">
          <div className="w-16 h-16 border-4 border-t-cyan-500 border-white/20 rounded-full animate-spin mb-4"></div>
          <p className="text-white font-bold text-lg animate-pulse">
            Chargement en cours...
          </p>
          <p className="text-white/50 text-sm mt-2">
            Patience, ça peut être un peu long 🧘‍♂️
          </p>
        </div>
      )}
      <main
        className="flex flex-col content-center h-full w-full justify-center items-center overflow-hidden"
        style={{
          backgroundColor: isModalOpen
            ? "rgba(0, 0, 0, 0.5)"
            : "rgba(241, 245, 249, 0.5)",
        }}
      >
        <div className="flex flex-col justify-center items-center">
          <h1 className=" font-sans  text-3xl md:text-5xl text-slate-600 tracking-widest scale-120 md:scale-150 animate-pulse transform uppercase m-6">
            TITRE DU SITE
          </h1>
        </div>
        {!isConnected ? (
          <Login />
        ) : (
          <>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-700 text-white rounded-md px-4 p-3 text-center hover:scale-105 transition-transform m-10"
            >
              Ajouter un souvenir
            </button>
            {isModalOpen && <Modal />}
            <div className="relative w-full min-h-[150vh] mt-10">
              Contenu principal ici
            </div>
            <button
              onClick={() => dispatch(logout())}
              className="bg-red-700 text-white mt-80 mb-20 rounded-md px-4 p-3 text-center hover:scale-105 transition-transform"
            >
              Déconnexion
            </button>
          </>
        )}
      </main>
    </div>
  );
}

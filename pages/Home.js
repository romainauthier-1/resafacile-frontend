import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Card from "../components/Card";
import Modal from "../components/Modal";
import ReservationForm from "./ReservationForm";

import { LogOut } from "lucide-react";

export default function Home() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-md rounded-3xl">
          <div className="w-16 h-16 border-4 border-t-primary border-white/20 rounded-full animate-spin mb-4"></div>
          <p className="text-white font-bold text-lg animate-pulse">
            Chargement en cours...
          </p>
          <p className="text-white/50 text-sm mt-2">Patience 🧘‍♂️</p>
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
          <h1 className=" font-sans  text-3xl md:text-5xl text-primary tracking-widest scale-120 md:scale-150 transform uppercase m-6">
            RÉSERVEZ VOTRE TABLE
          </h1>
        </div>
        <div className="flex flex-row justify-between w-full">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-background text-white rounded-full ml-4 px-4 p-3 text-center hover:scale-105 transition-transform w-34"
          >
            Action 1
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-backgroundLight text-white rounded-full ml-4 px-4 p-3 text-center hover:scale-105 transition-transform w-34"
          >
            Action 2
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-background text-white rounded-full ml-4 px-4 p-3 text-center hover:scale-105 transition-transform w-34"
          >
            Action 3
          </button>
        </div>
        <ReservationForm />
        {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
        {/* <div className="mt-10 flex flex-wrap justify-center items-center">
            </div> */}
      </main>
    </div>
  );
}

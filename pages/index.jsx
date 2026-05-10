import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import BookingCard from "../components/BookingCard";
import Modal from "../components/Modal";

import { setBookings, bookATable, cancelATable } from "../reducers/bookings";
import { logout } from "../reducers/connectedRestaurant";

import { LogOut, CalendarSync } from "lucide-react";

export default function LandingPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const connectedRestaurant = useSelector(
    (state) => state.connectedRestaurant.restaurant,
  );

  const bookingList = useSelector((state) => state.bookings);

  const isRestaurantConnected = useSelector(
    (state) => state.connectedRestaurant.isConnected,
  );
  const [isSignup, setIsSignup] = useState(false);

  const getBookings = async (restaurantId) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/all/${restaurantId}?t=${Date.now()}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );
      const data = await response.json();

      if (data.result) {
        dispatch(setBookings(data.allBookings));
      }
    } catch (err) {
      console.error(err);
      toast.error(
        data.message || "Une erreur est survenue au chargement de la page.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/cancel/${bookingId}`,
        {
          method: "DELETE",
          cache: "no-store",
        },
      );
      const data = await response.json();
      if (data.result) {
        dispatch(cancelATable(bookingId));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isRestaurantConnected) {
      getBookings(connectedRestaurant._id);
      console.log(
        `LISTE DES RÉSERVATIONS POUR LE RESTAURANT ${connectedRestaurant.name} :`,
      );
      console.log(bookingList);
    }
  }, [connectedRestaurant, isRestaurantConnected]);

  const bookingDisplay = bookingList
    ?.toSorted((a, b) => a.dateTime > b.dateTime)
    .map((booking) => {
      return (
        <BookingCard
          key={booking._id}
          booking={booking}
          onDelete={() => handleDeleteBooking(booking._id)}
        />
      );
    });

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundColor: isModalOpen
          ? "rgba(0, 0, 0, 0.5)"
          : "rgba(241, 245, 249, 0.5)",
      }}
    >
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-md rounded-3xl">
          <div className="w-16 h-16 border-4 border-t-primary border-white/20 rounded-full animate-spin mb-4"></div>
          <p className="text-white font-bold text-lg animate-pulse">
            Chargement en cours...
          </p>
          <p className="text-secondary text-sm mt-2">Patience 🧘‍♂️</p>
        </div>
      )}
      <ToastContainer />
      <main className="flex flex-col content-center h-full w-full justify-center items-center overflow-hidden">
        <div className="flex flex-col justify-center items-center">
          {isRestaurantConnected && (
            <>
              <h1 className=" font-sans  text-3xl md:text-5xl text-primary tracking-widest scale-120 md:scale-150 transform uppercase m-6">
                {connectedRestaurant.name}
              </h1>
              <h2 className=" font-sans  text-xl md:text-5xl text-primary tracking-widest transform uppercase m-6">
                Liste des réservations
              </h2>
              <div className="flex flex-row w-full justify-evenly">
                <button
                  onClick={() => {
                    dispatch(logout());
                  }}
                  className={`bg-destructive/60 text-white rounded-full px-4 p-3 text-center hover:scale-105 flex flex-col justify-center items-center transition-transform w-34`}
                >
                  <LogOut />
                  <p>Déconnexion</p>
                </button>
                <button
                  onClick={() => {
                    getBookings(connectedRestaurant._id);
                  }}
                  className={`bg-secondary/90 text-white rounded-full px-4 p-3 text-center hover:scale-105 flex flex-col justify-center items-center transition-transform w-34`}
                >
                  <CalendarSync />
                  <p>Rafraîchir</p>
                </button>
              </div>
            </>
          )}
        </div>
        {isRestaurantConnected ? (
          bookingList.length > 0 ? (
            <div className="flex flex-row flex-wrap gap-10">
              {bookingDisplay}
            </div>
          ) : (
            <h2>Aucune réservation trouvée.</h2>
          )
        ) : (
          <>
            {isModalOpen && (
              <Modal
                onClose={() => setIsModalOpen(false)}
                isSignup={isSignup}
              />
            )}
            <div className="mt-10 flex flex-row justify-center items-center gap-10">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setIsSignup(false);
                }}
                className={`bg-backgroundLight text-secondary rounded-full px-4 p-3 text-center hover:scale-105 transition-transform w-34`}
              >
                <p>Connexion Restaurant</p>
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setIsSignup(true);
                }}
                className={`bg-backgroundLight text-secondary rounded-full px-4 p-3 text-center hover:scale-105 transition-transform w-34`}
              >
                <p>Inscription Restaurant</p>
              </button>
              {isRestaurantConnected && (
                <button
                  onClick={() => {
                    dispatch(logout());
                  }}
                  className={`bg-backgroundLight text-secondary rounded-full px-4 p-3 text-center hover:scale-105 transition-transform w-34`}
                >
                  <LogOut />
                  <p>Déconnexion</p>
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

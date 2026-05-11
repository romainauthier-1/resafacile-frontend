import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import BookingCard from "../components/BookingCard";
import Modal from "../components/Modal";
import ReservationForm from "./ReservationForm";
import { colors } from "../components/utils";

import { setBookings, bookATable, cancelATable } from "../reducers/bookings";
import {
  logout,
  updateServicesForTheDay,
} from "../reducers/connectedRestaurant";

import {
  LogOut,
  CalendarSync,
  CalendarPlus,
  ChevronRight,
  ChevronLeft,
  CalendarCheck,
  Lock,
  LockOpen,
} from "lucide-react";

export default function LandingPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [bookingToUpdate, setBookingToUpdate] = useState(null);
  const [currentStartDate, setCurrentStartDate] = useState(new Date());

  const connectedRestaurant =
    useSelector((state) => state.connectedRestaurant?.restaurant) || {};

  const bookingList = useSelector((state) => state.bookings);

  const isRestaurantConnected = useSelector(
    (state) => state.connectedRestaurant?.isConnected,
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
        err.message || "Une erreur est survenue au chargement de la page.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      if (
        window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")
      ) {
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
      } else {
        return;
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isRestaurantConnected && connectedRestaurant._id) {
      getBookings(connectedRestaurant._id);
      console.log(
        `LISTE DES RÉSERVATIONS POUR LE RESTAURANT ${connectedRestaurant.name} :`,
      );
      console.log(bookingList);
    }
  }, [connectedRestaurant, isRestaurantConnected, isUpdating]);

  const getNextSevenDays = (startDate = new Date()) => {
    const days = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split("T")[0]; // Format YYYY-MM-DD
      days[dateString] = [];
    }
    return days;
  };

  const groupedBookings = getNextSevenDays(currentStartDate);

  const getNextWeek = () => {
    const next = new Date(currentStartDate);
    next.setDate(next.getDate() + 7);
    setCurrentStartDate(next);
  };

  const getPreviousWeek = () => {
    const prev = new Date(currentStartDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentStartDate(prev);
  };

  bookingList?.forEach((booking) => {
    const dateKey = booking?.dateTime?.split("T")[0];
    if (groupedBookings[dateKey]) {
      groupedBookings[dateKey].push(booking);
    }
  });

  const calendarDisplay = Object.keys(groupedBookings).map((date) => {
    const dayBookings = groupedBookings[date];

    const displayDate = new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    const nbBookings = dayBookings.length;

    const nbBookingPax = dayBookings.reduce(
      (total, booking) => total + booking.nbPax,
      0,
    );

    const closeBookingsForTheDay = async () => {
      setIsLoading(true);
      for (let i = 0; i < connectedRestaurant?.services.length; i++) {
        const service = connectedRestaurant.services[i];
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/restaurants/service/close-date/${connectedRestaurant._id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                serviceId: service._id,
                date: new Date(date).toISOString().split("T")[0],
              }),
            },
          );
          const data = await response.json();

          if (data.result) {
            toast.success(data.message);
            dispatch(updateServicesForTheDay(data.services));
            getBookings(connectedRestaurant._id);
          }
        } catch (err) {
          console.error(err);
        }
      }
      setIsLoading(false);
    };

    const openBookingsForTheDay = async () => {
      setIsLoading(true);
      for (let i = 0; i < connectedRestaurant?.services.length; i++) {
        const service = connectedRestaurant.services[i];
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/restaurants/service/open-date/${connectedRestaurant._id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                serviceId: service._id,
                date: new Date(date).toISOString().split("T")[0],
              }),
            },
          );
          const data = await response.json();

          if (data.result) {
            toast.success(data.message);
            dispatch(updateServicesForTheDay(data.services));
            getBookings(connectedRestaurant._id);
          }
        } catch (err) {
          console.error(err);
        }
      }
      setIsLoading(false);
    };

    const isBookingOpenForTheDay =
      connectedRestaurant?.services?.filter((service) =>
        service.closedDates.includes(new Date(date).toISOString()),
      ).length === 0;

    return (
      <div
        key={date}
        className="w-full mb-8 p-4 border-l-4 border-primary bg-white shadow-sm rounded-r-xl"
      >
        <div className=" flex flex-row justify-between items-center w-full">
          <h3 className="text-l font-bold text-secondary capitalize mb-4">
            {displayDate}
          </h3>
          <p className="text-l text-secondary capitalize mb-4">
            {" "}
            {`${nbBookings} réservations | ${nbBookingPax} couverts`}
          </p>
          {isBookingOpenForTheDay ? (
            <button
              className="text-l text-destructive/60 mb-4"
              onClick={() => closeBookingsForTheDay()}
            >
              <LockOpen />
            </button>
          ) : (
            <button
              className="text-l text-secondary/60 mb-4"
              onClick={() => openBookingsForTheDay()}
            >
              <Lock />
            </button>
          )}
        </div>

        <div className="flex flex-col w-full gap-2">
          {dayBookings.length > 0 ? (
            dayBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onDelete={() => handleDeleteBooking(booking._id)}
                onUpdate={() => {
                  setIsUpdating(true);
                  setBookingToUpdate(booking);
                }}
              />
            ))
          ) : (
            <p className="text-gray-400 italic">
              Aucune réservation pour ce jour.
            </p>
          )}
        </div>
      </div>
    );
  });

  useEffect(() => {
    setIsBooking(false);
    setIsUpdating(false);
  }, []);

  if (isRestaurantConnected && !connectedRestaurant?._id) {
    return (
      <p>
        Session expirée ou restaurant introuvable. Veuillez vous reconnecter.
      </p>
    );
  }
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
                  className={` text-destructive/60 rounded-full px-4 p-3 text-center hover:scale-105 flex flex-col justify-center items-center transition-transform w-34`}
                >
                  <LogOut color={colors.destructive} />
                  <p>Déconnexion</p>
                </button>
                <button
                  onClick={() => {
                    getBookings(connectedRestaurant._id);
                  }}
                  className={` text-secondary rounded-full px-4 p-3 text-center hover:scale-105 flex flex-col justify-center items-center transition-transform w-34`}
                >
                  <CalendarSync color={colors.secondary} />
                  <p>Rafraîchir</p>
                </button>
                <button
                  onClick={() => {
                    setIsBooking(true);
                  }}
                  className={` text-background rounded-full px-4 p-3 text-center hover:scale-105 flex flex-col justify-center items-center transition-transform w-34`}
                >
                  <CalendarPlus color={colors.background} />
                  <p>Nouvelle réservation</p>
                </button>
              </div>
              <div className="flex flex-row w-full justify-evenly m-4">
                <button className="cursor-pointer hover:scale-110 transition-transform">
                  <ChevronLeft onClick={getPreviousWeek} size={30} />
                </button>
                <button className="cursor-pointer hover:scale-110 transition-transform">
                  <CalendarCheck
                    onClick={() => setCurrentStartDate(new Date())}
                    size={30}
                  />
                </button>
                <button className="cursor-pointer hover:scale-110 transition-transform">
                  <ChevronRight onClick={getNextWeek} size={30} />
                </button>
              </div>
            </>
          )}
          {isRestaurantConnected && isBooking && (
            <ReservationForm
              connectedRestaurant={connectedRestaurant}
              onClose={() => setIsBooking(false)}
            />
          )}
          {isRestaurantConnected && isUpdating && (
            <ReservationForm
              bookingRestaurant={connectedRestaurant}
              onClose={() => {
                setIsUpdating(false);
                setBookingToUpdate(null);
                getBookings(connectedRestaurant._id);
              }}
              isUpdating={isUpdating}
              bookingToUpdate={bookingToUpdate}
            />
          )}
        </div>
        {isRestaurantConnected ? (
          bookingList.length > 0 ? (
            <div className="flex flex-col w-full">
              {/* {bookingDisplay} */}
              {calendarDisplay}
            </div>
          ) : (
            <h2>Pas de réservation pour le moment !</h2>
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
            </div>
          </>
        )}
      </main>
    </div>
  );
}

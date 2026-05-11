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

  const connectedRestaurant = useSelector(
    (state) => state.connectedRestaurant?.restaurant,
  );

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
      <div key={date} className="panel-card p-6 mb-8">
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
            dayBookings
              .toSorted(
                (a, b) =>
                  new Date(a.dateTime).getTime() -
                  new Date(b.dateTime).getTime(),
              )
              .map((booking) => (
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
      className="page-shell"
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
      <main className="w-full max-w-6xl">
        {isRestaurantConnected && (
          <>
            <div className="panel-card p-8 md:p-10 mb-8 space-y-8">
              <div className="text-center space-y-4">
                <h1 className="section-title">{connectedRestaurant.name}</h1>
                <h2 className="text-2xl md:text-4xl font-semibold text-slate-900">
                  Liste des réservations
                </h2>
              </div>
              <div className="flex flex-wrap gap-4 justify-center items-center">
                <button
                  onClick={() => {
                    dispatch(logout());
                    dispatch(setBookings([]));
                  }}
                  className="btn-tertiary px-5 py-3 text-destructive/70 hover:text-destructive"
                >
                  <div className="flex flex-col items-center gap-1">
                    <LogOut color={colors.destructive} />
                    <p>Déconnexion</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    getBookings(connectedRestaurant._id);
                  }}
                  className="btn-secondary px-5 py-3"
                >
                  <div className="flex flex-col items-center gap-1">
                    <CalendarSync color={colors.secondary} />
                    <p>Rafraîchir</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsBooking(true);
                  }}
                  className="btn-primary px-5 py-3"
                >
                  <div className="flex flex-col items-center gap-1">
                    <CalendarPlus color="white" />
                    <p>Nouvelle réservation</p>
                  </div>
                </button>
              </div>
              <div className="flex flex-row items-center justify-center gap-4">
                <button
                  className="btn-secondary p-3 flex items-center justify-center"
                  onClick={getPreviousWeek}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="btn-secondary p-3 flex items-center justify-center"
                  onClick={() => setCurrentStartDate(new Date())}
                >
                  <CalendarCheck size={24} />
                </button>
                <button
                  className="btn-secondary p-3 flex items-center justify-center"
                  onClick={getNextWeek}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
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
            connectedRestaurant={connectedRestaurant}
            onClose={() => {
              setIsUpdating(false);
              setBookingToUpdate(null);
              getBookings(connectedRestaurant._id);
            }}
            isUpdating={isUpdating}
            bookingToUpdate={bookingToUpdate}
          />
        )}
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
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="section-title text-4xl md:text-6xl">
                  RésaFacile
                </h1>
                <p className="section-subtitle text-lg md:text-xl max-w-2xl mx-auto">
                  La solution simple et efficace pour gérer vos réservations de
                  restaurant
                </p>
              </div>
              <div className="flex flex-row justify-center items-center gap-6">
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsSignup(false);
                  }}
                  className="btn-secondary px-6 py-3"
                >
                  Connexion Restaurant
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsSignup(true);
                  }}
                  className="btn-primary px-6 py-3"
                >
                  Inscription Restaurant
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

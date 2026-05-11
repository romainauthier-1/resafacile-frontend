import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Modal from "../components/Modal";
import ReservationForm from "./ReservationForm";
import {
  capitalize,
  convertMinutesToTime,
  weekDays,
} from "../components/utils";

import { setBookingRestaurant } from "../reducers/bookingRestaurant";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const bookingRestaurant = useSelector(
    (state) => state.bookingRestaurant.restaurant,
  );

  const [isSignup, setIsSignup] = useState(false);

  const setRestaurant = async (slug) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/restaurants/reserver/${slug}`,
      );

      const data = await response.json();

      if (data.result) {
        dispatch(setBookingRestaurant(data.foundRestaurant));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue au chargement de la page.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    slug && setRestaurant(slug);
    bookingRestaurant &&
      console.log("RESTAURANT OÙ JE VEUX RÉSERVER: ", bookingRestaurant);
  }, [slug]);

  return (
    <div>
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
      <main
        className="page-shell"
        style={{
          backgroundColor: isModalOpen
            ? "rgba(0, 0, 0, 0.5)"
            : "rgba(241, 245, 249, 0.5)",
        }}
      >
        <div className="page-shell panel-card p-8 md:p-10 mb-8">
          <div className="flex flex-col gap-4 text-center">
            <h1 className="section-title">Réservez votre table</h1>
            <p className="section-subtitle max-w-2xl mx-auto">
              Retrouvez toutes les informations de votre restaurant et
              choisissez facilement votre créneau.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] mt-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-semibold text-slate-900">
                {bookingRestaurant?.name}
              </h2>
              <p className="text-base text-slate-700">
                {bookingRestaurant?.address}
              </p>
              <p className="text-base text-slate-700">
                {bookingRestaurant?.zipCode} {bookingRestaurant?.city}
              </p>
              <p className="text-base text-slate-700">
                📲 {bookingRestaurant?.phoneNumber?.replace("+33", "0")}
              </p>
            </div>
            <div className="grid gap-4 rounded-[24px] bg-surface-soft p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-2">
                  Jours d'ouverture
                </p>
                <div className="flex flex-wrap gap-2">
                  {bookingRestaurant?.openingDays
                    ?.toSorted(
                      (a, b) => weekDays.indexOf(a) - weekDays.indexOf(b),
                    )
                    .map((day) => (
                      <span key={day} className="badge-pill">
                        {capitalize(day)}
                      </span>
                    ))}
                </div>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-3">
                  Horaires d'accueil
                </p>
                <div className="grid gap-3">
                  {bookingRestaurant?.services?.map((service) => (
                    <div
                      key={service.name}
                      className="rounded-3xl bg-white p-4 shadow-sm border border-slate-100"
                    >
                      <p className="font-semibold text-slate-900">
                        {capitalize(service.name)}
                      </p>
                      <p className="text-sm text-slate-600">
                        {convertMinutesToTime(service.startTime)} –{" "}
                        {convertMinutesToTime(service.endTime)}
                      </p>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsBooking(true)}
                    className="btn-primary px-6 py-2 text-sm w-full"
                  >
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            {isBooking && (
              <ReservationForm
                bookingRestaurant={bookingRestaurant}
                onClose={() => setIsBooking(false)}
              />
            )}
          </div>
        </div>
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)} isSignup={isSignup} />
        )}
      </main>
    </div>
  );
}

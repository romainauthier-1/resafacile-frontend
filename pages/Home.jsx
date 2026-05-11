import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Modal from "../components/Modal";
import ReservationForm from "./ReservationForm";
import { capitalize, convertMinutesToTime } from "../components/utils";

import { setBookingRestaurant } from "../reducers/bookingRestaurant";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        className="flex flex-col content-center h-full w-full justify-center items-center overflow-hidden"
        style={{
          backgroundColor: isModalOpen
            ? "rgba(0, 0, 0, 0.5)"
            : "rgba(241, 245, 249, 0.5)",
        }}
      >
        <div className="flex flex-col justify-center items-center">
          <>
            <h1 className=" font-sans  text-2xl md:text-3xl text-primary tracking-widest scale-120 md:scale-150 transform uppercase m-6">
              RÉSERVEZ VOTRE TABLE
            </h1>
            <h2 className="font-sans text-xl md:text-2xl text-primary tracking-widest transform uppercase m-3">
              {bookingRestaurant?.name}
            </h2>
            <p className="font-sans text-background tracking-widest transform uppercase m-2">
              {bookingRestaurant?.address}
            </p>
            <p className="font-sans text-background tracking-widest transform uppercase m-2">
              {bookingRestaurant?.zipCode} {bookingRestaurant?.city}
            </p>
            <p className="font-sans text-background tracking-widest transform uppercase m-2">
              📲 {bookingRestaurant?.phoneNumber.replace("+33", "0")}
            </p>
            <div className="flex flex-row w-full justify-evenly items-center">
              <p className="font-sans text-background tracking-widest transform uppercase m-2">
                Jours d'ouverture :
              </p>
              {bookingRestaurant?.openingDays.map((day) => {
                return (
                  <p className="font-sans text-background tracking-widest transform uppercase m-2">
                    {capitalize(day)}
                  </p>
                );
              })}
            </div>
            <div className="flex flex-row w-full justify-evenly items-center">
              <p className="font-sans text-background tracking-widest transform uppercase m-2">
                Horaires d'accueil :
              </p>
              {bookingRestaurant?.services.map((service) => {
                return (
                  <>
                    <p className="font-sans text-background tracking-widest transform uppercase m-2">
                      {capitalize(service.name)}
                    </p>
                    <p className="font-sans text-background tracking-widest transform uppercase m-2">
                      {convertMinutesToTime(service.startTime)}
                    </p>
                    <p className="font-sans text-background tracking-widest transform uppercase m-2">
                      {convertMinutesToTime(service.endTime)}
                    </p>
                  </>
                );
              })}
            </div>
          </>
        </div>
        <div className="flex flex-row gap-6 justify-evenly w-full items-center mt-4 overflow-y-scroll no-scrollbar"></div>
        <ReservationForm bookingRestaurant={bookingRestaurant} />
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)} isSignup={isSignup} />
        )}
      </main>
    </div>
  );
}

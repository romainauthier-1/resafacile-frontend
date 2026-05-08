import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import BookingCard from "../../../../components/BookingCard";
import Modal from "../../../../components/Modal";
import ReservationForm from "./ReservationForm";

import { setBookings } from "../../../../reducers/bookings";
import { logout } from "../../../../reducers/restaurant";

import { LogOut } from "lucide-react";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [restaurantsList, setRestaurantsList] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  const restaurant = useSelector((state) => state.restaurants);
  const bookingList = useSelector((state) => state.bookings);

  const isRestaurant = restaurant.isConnected;
  const [isSignup, setIsSignup] = useState(false);

  // const getRestaurants = async () => {
  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/restaurants/all`,
  //   );
  //   const data = await response.json();

  //   if (data.result) {
  //     setRestaurantsList(data.allRestaurants);
  //   } else {
  //     toast.error(data.message);
  //   }
  // };

  const setRestaurant = async (slug) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/restaurants/reserver/${slug}`,
      );

      const data = await response.json();

      if (data.result) {
        setSelectedRestaurant(data.foundRestaurant);
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
    // getRestaurants();
    slug && setRestaurant(slug);
    console.log("RESTAURANT : ", selectedRestaurant);
  }, [slug]);

  const getBookings = async (restaurantId) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/all/${restaurantId}`,
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

  useEffect(() => {
    if (isRestaurant) {
      getBookings(selectedRestaurant._id);
    }
    console.log("BOOKINGLIST : ", bookingList);
  }, [selectedRestaurant, isRestaurant]);

  const bookingDisplay = bookingList?.map((booking) => {
    return <BookingCard key={booking._id} booking={booking} />;
  });
  // const restaurantsButtons = restaurantsList.map((restaurant) => (
  //   <button
  //     key={restaurant._id}
  //     onClick={() => setSelectedRestaurant(restaurant)}
  //     className={` ${selectedRestaurant._id === restaurant._id ? "bg-background" : "bg-backgroundLight"} text-white rounded-full px-4 p-3 text-center hover:scale-105 transition-transform w-34`}
  //   >
  //     <p>{restaurant.name}</p>
  //     <p>{restaurant.phoneNumber}</p>
  //     <p>{restaurant.address}</p>
  //     <p>{restaurant.city}</p>
  //   </button>
  // ));

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
          {isRestaurant ? (
            <>
              <h1 className=" font-sans  text-3xl md:text-5xl text-primary tracking-widest scale-120 md:scale-150 transform uppercase m-6">
                {selectedRestaurant.name}
              </h1>
              <button
                onClick={() => {
                  dispatch(logout());
                }}
                className={`bg-backgroundLight text-secondary rounded-full px-4 p-3 text-center hover:scale-105 transition-transform w-34`}
              >
                <LogOut />
                <p>Déconnexion</p>
              </button>
            </>
          ) : (
            <>
              <h1 className=" font-sans  text-3xl md:text-5xl text-primary tracking-widest scale-120 md:scale-150 transform uppercase m-6">
                RÉSERVEZ VOTRE TABLE
              </h1>
              <h2>{selectedRestaurant.name}</h2>
            </>
          )}
        </div>
        <div className="flex flex-row gap-6 justify-evenly w-full items-center mt-4 overflow-y-scroll no-scrollbar">
          {/* {restaurantsButtons.length > 0 && restaurantsButtons} */}
        </div>
        {isRestaurant ? (
          bookingList.length > 0 ? (
            bookingDisplay
          ) : (
            <h2>Aucune réservation trouvée.</h2>
          )
        ) : (
          <>
            <ReservationForm selectedRestaurant={selectedRestaurant} />
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
              <button
                onClick={() => {
                  dispatch(logout());
                }}
                className={`bg-backgroundLight text-secondary rounded-full px-4 p-3 text-center hover:scale-105 transition-transform w-34`}
              >
                <LogOut />
                <p>Déconnexion</p>
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

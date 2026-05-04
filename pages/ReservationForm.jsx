import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { capitalize, colors } from "../components/utils";

import { useDispatch } from "react-redux";
import { bookATable } from "../reducers/bookings";

import { Eye, EyeOff } from "lucide-react";

export default function ReservationForm({ selectedRestaurant }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+33");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  );
  const [time, setTime] = useState("");
  const [nbPax, setNbPax] = useState(2);
  const [occasion, setOccasion] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const nbPaxRef = useRef(null);
  const occasionRef = useRef(null);

  const dispatch = useDispatch();

  const validateBookingInputs = () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !date ||
      !time ||
      !nbPax
    ) {
      setErrorMessage("Tous les champs doivent être remplis.");
      return false;
    } else if (!selectedRestaurant) {
      setErrorMessage("Veuillez sélectionner un restaurant.");
      return false;
    }
    return true;
  };

  const resetInputs = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setDate(
      new Date().toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    );
    setTime("");
    setNbPax(2);
    setOccasion("");
  };

  const handleBooking = async (e, restaurantId) => {
    e && e.preventDefault();
    setErrorMessage("");
    if (!validateBookingInputs()) return;

    try {
      setIsLoading(true);

      const dateTime = `${date.split("/").reverse().join("-")}T${time}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/new/${restaurantId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phoneNumber,
            dateTime,
            nbPax,
            occasion,
          }),
        },
      );

      const data = await response.json();
      if (data.result) {
        dispatch(bookATable(data.savedBooking));
        toast.success(data.message || "Réservation enregistrée !");
        resetInputs();
      } else {
        setErrorMessage(
          data.message ||
            "Une erreur est survenue. Si le problème persiste, contactez-nous.",
        );
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter" && !nextField) {
      e.preventDefault();
      handleBooking(e, selectedRestaurant._id);
    }
    if (e.key === "Enter") {
      e.preventDefault();

      if (nextField) {
        nextField.current?.focus();
      }
    }
  };

  return (
    <div className="flex flex-col w-screen">
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
      <div className="flex flex-col justify-center w-full items-center md:justify-evenly gap-8 p-4">
        <form
          onSubmit={(e) => handleBooking(e, selectedRestaurant?._id)}
          className="flex flex-col justify-center items-center h-full w-4/5 m-12 p-6 bg-primary rounded-xl "
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 w-full">
            <div className="w-full md:w-1/3 flex flex-col gap-4 jusfify-evenly items-center">
              <input
                className="text-secondary input rounded-md p-2 text-center"
                placeholder="Prénom"
                type="text"
                enterKeyHint="next"
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, lastNameRef)}
                value={firstName}
                autoCapitalize="words"
                autoCorrect="off"
              ></input>
              <input
                className="text-secondary input rounded-md p-2 text-center"
                placeholder="Nom de famille"
                type="text"
                enterKeyHint="next"
                ref={lastNameRef}
                onKeyDown={(e) => handleKeyDown(e, emailRef)}
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                autoCapitalize="words"
                autoCorrect="off"
              ></input>
              <input
                className="text-secondary input rounded-md p-2 text-center"
                placeholder="Adresse e-mail"
                inputMode="email"
                enterKeyHint="next"
                ref={emailRef}
                onKeyDown={(e) => handleKeyDown(e, phoneNumberRef)}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                autoCorrect="off"
                autoCapitalize="none"
              ></input>
              <input
                className="text-secondary input rounded-md p-2"
                placeholder="Numéro de téléphone"
                type="tel"
                enterKeyHint="next"
                ref={phoneNumberRef}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, dateRef)}
                value={phoneNumber}
                autoCorrect="off"
              ></input>
            </div>
            <div className="w-1/3 flex flex-col gap-4 jusfify-evenly items-center">
              <input
                className="text-secondary input rounded-md p-2 text-center"
                placeholder="Date"
                type="date"
                enterKeyHint="next"
                ref={dateRef}
                onChange={(e) => setDate(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, timeRef)}
                value={date}
              ></input>
              <input
                className="text-secondary input rounded-md p-2 text-center"
                placeholder="Heure"
                type="time"
                enterKeyHint="next"
                ref={timeRef}
                onChange={(e) => setTime(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, nbPaxRef)}
                value={time}
              ></input>
              <input
                className="text-secondary input rounded-md p-2 text-center"
                placeholder="Nombre de personnes"
                type="tel"
                enterKeyHint="next"
                ref={nbPaxRef}
                onChange={(e) => setNbPax(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, occasionRef)}
                value={nbPax}
              ></input>
              <input
                className="text-secondary input rounded-md p-2 text-center"
                placeholder="Occasion"
                type="text"
                enterKeyHint="go"
                ref={occasionRef}
                onChange={(e) => setOccasion(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, null)}
                value={occasion}
              ></input>
            </div>
          </div>
          {errorMessage && (
            <p className="text-destructive text-sm mt-2">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="p-3 mt-6 bg-secondary rounded-full w-40 hover:scale-110 transition-transform"
          >
            <p className="text-white">Je réserve !</p>
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { capitalize, colors } from "../components/utils";

import { useDispatch } from "react-redux";
import { bookATable } from "../reducers/bookings";

import { X } from "lucide-react";

export default function ReservationForm({
  bookingRestaurant,
  connectedRestaurant,
  onClose,
  isUpdating,
  bookingToUpdate,
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const [time, setTime] = useState(() => {
    if (bookingToUpdate) {
      return bookingToUpdate.dateTime.split("T")[1].slice(0, 5);
    }
    return `${hours}:${minutes}`;
  });
  const [timeError, setTimeError] = useState("");
  const [nbPax, setNbPax] = useState(4);
  const [occasion, setOccasion] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [sendMessage, setSendMessage] = useState(true);

  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const nbPaxRef = useRef(null);
  const occasionRef = useRef(null);

  useEffect(() => {
    if (isUpdating && bookingToUpdate) {
      setFirstName(capitalize(bookingToUpdate.customer.firstName));
      setLastName(capitalize(bookingToUpdate.customer.lastName));
      setEmail(bookingToUpdate.customer.email);
      setPhoneNumber(bookingToUpdate.customer.phoneNumber);

      const localDate = new Date(bookingToUpdate.dateTime);
      const year = localDate.getFullYear();
      const month = (localDate.getMonth() + 1).toString().padStart(2, "0");
      const day = localDate.getDate().toString().padStart(2, "0");
      setDate(`${year}-${month}-${day}`);

      const hours = localDate.getHours().toString().padStart(2, "0");
      const minutes = localDate.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);

      setNbPax(bookingToUpdate.nbPax);
      setOccasion(bookingToUpdate.occasion || "");
    }
  }, [bookingToUpdate, isUpdating]);

  const dispatch = useDispatch();

  const validateBookingInputs = () => {
    setErrorMessage("");
    setTimeError("");
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
    } else if (bookingRestaurant) {
      if (time.split(":")[1] % bookingRestaurant.gap !== 0) {
        setTimeError(
          `Merci de sélectionner un créneau de ${bookingRestaurant.gap} minutes.`,
        );
        return false;
      }
    } else if (connectedRestaurant) {
      if (time.split(":")[1] % connectedRestaurant.gap !== 0) {
        setTimeError(
          `Merci de sélectionner un créneau de ${connectedRestaurant.gap} minutes.`,
        );
        return false;
      }
    }
    return true;
  };

  const resetInputs = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setDate(new Date().toISOString().split("T")[0]);
    setTime(`${hours}:${minutes}`);
    setNbPax(4);
    setOccasion("");
    setTimeError("");
    setSendMessage(false);
  };

  const handleBooking = async (e, restaurantId, sendMessage) => {
    e && e.preventDefault();
    setErrorMessage("");

    const effectiveRestaurantId =
      restaurantId || bookingRestaurant?._id || connectedRestaurant?._id;

    if (!effectiveRestaurantId) {
      setErrorMessage(
        "Impossible de retrouver le restaurant pour cette réservation.",
      );
      return;
    }

    if (!validateBookingInputs()) return;

    try {
      setIsLoading(true);

      const dateTime = `${date}T${time}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/new/${effectiveRestaurantId}`,
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
            sendMessage,
          }),
        },
      );

      const data = await response.json();
      if (data.result) {
        dispatch(bookATable(data.savedBooking));
        toast.success(data.message || "Réservation enregistrée !");
        resetInputs();
        onClose();
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

  const handleUpdateBooking = async (e, bookingId, sendMessage) => {
    e && e.preventDefault();
    setErrorMessage("");
    if (!validateBookingInputs()) return;

    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/update/${bookingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phoneNumber,
            dateTime: `${date}T${time}`,
            nbPax,
            occasion,
            sendMessage,
          }),
        },
      );
      const data = await response.json();

      if (data.result) {
        toast.success(data.message);
        resetInputs();
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter" && !nextField) {
      e.preventDefault();
      handleBooking(e, bookingRestaurant?._id || connectedRestaurant?._id);
    }
    if (e.key === "Enter") {
      e.preventDefault();

      if (nextField) {
        nextField.current?.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-md rounded-3xl">
          <div className="w-16 h-16 border-4 border-t-primary border-white/20 rounded-full animate-spin mb-4"></div>
          <p className="text-white font-bold text-lg animate-pulse">
            Chargement en cours...
          </p>
          <p className="text-secondary text-sm mt-2">Patience 🧘‍♂️</p>
        </div>
      )}
      <form
        onSubmit={(e) =>
          isUpdating
            ? handleUpdateBooking(e, bookingToUpdate._id, sendMessage)
            : handleBooking(
                e,
                bookingRestaurant?._id || connectedRestaurant?._id,
                sendMessage,
              )
        }
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 panel-card"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            {isUpdating ? "Modifier la réservation" : "Nouvelle réservation"}
          </h2>
          <button
            type="button"
            onClick={() => onClose()}
            className="btn-tertiary p-1.5 hover:text-slate-600 flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="field-input text-slate-900 text-center text-base"
              placeholder="Prénom"
              type="text"
              enterKeyHint="next"
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, lastNameRef)}
              value={firstName}
              autoCapitalize="words"
              autoCorrect="off"
            />
            <input
              className="field-input text-slate-900 text-center text-base"
              placeholder="Nom de famille"
              type="text"
              enterKeyHint="next"
              ref={lastNameRef}
              onKeyDown={(e) => handleKeyDown(e, emailRef)}
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              autoCapitalize="words"
              autoCorrect="off"
            />
            <input
              className="field-input text-slate-900 text-center text-base md:col-span-2"
              placeholder="Adresse e-mail"
              inputMode="email"
              enterKeyHint="next"
              ref={emailRef}
              onKeyDown={(e) => handleKeyDown(e, phoneNumberRef)}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              autoCorrect="off"
              autoCapitalize="none"
            />
            <input
              className="field-input text-slate-900 text-base md:col-span-2"
              placeholder="Numéro de téléphone"
              type="tel"
              enterKeyHint="next"
              ref={phoneNumberRef}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, dateRef)}
              value={phoneNumber}
              autoCorrect="off"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="field-input text-slate-900 text-center text-base"
              placeholder="Date"
              type="date"
              enterKeyHint="next"
              ref={dateRef}
              onChange={(e) => setDate(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, timeRef)}
              value={date}
            />
            <input
              className="field-input text-slate-900 text-center text-base"
              placeholder="Heure"
              type="time"
              enterKeyHint="next"
              ref={timeRef}
              onChange={(e) => setTime(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, nbPaxRef)}
              value={time}
            />
            <input
              className="field-input text-slate-900 text-center text-base"
              placeholder="Nombre de personnes"
              type="tel"
              enterKeyHint="next"
              ref={nbPaxRef}
              onChange={(e) => setNbPax(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, occasionRef)}
              value={nbPax}
            />
            <input
              className="field-input text-slate-900 text-center text-base"
              placeholder="Occasion"
              type="text"
              enterKeyHint="go"
              ref={occasionRef}
              onChange={(e) => setOccasion(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, null)}
              value={occasion}
            />
          </div>
          {timeError && (
            <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 text-center text-xs">
              {timeError}
            </p>
          )}
          {connectedRestaurant?._id && (
            <button
              type="button"
              onClick={() => {
                setSendMessage(!sendMessage);
              }}
              className={`px-4 py-3 text-base rounded-full font-medium transition-all w-full ${
                sendMessage
                  ? "bg-secondary text-white shadow-md"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {sendMessage ? "Avec SMS" : "Pas de SMS"}
            </button>
          )}
          {errorMessage && (
            <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 text-center text-xs">
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            className="btn-primary px-6 py-3 text-base w-full"
          >
            {isUpdating ? "Mettre à jour" : "Réserver"}
          </button>
        </div>
      </form>
    </div>
  );
}

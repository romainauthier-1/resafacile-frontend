import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { Pencil, X, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { convertMinutesToTime, convertTimeToMinutes } from "./utils";

import { setBookings } from "../reducers/bookings";
import { login, logout } from "../reducers/restaurant";

export default function Modal({ onClose, isSignup }) {
  const dispatch = useDispatch();

  const bookingList = useSelector((state) => state.bookings);

  const [isLoading, setIsLoading] = useState(false);

  const [siret, setSiret] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("France");
  const [phoneNumber, setPhoneNumber] = useState("+33");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openingDays, setOpeningDays] = useState([
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche",
  ]);
  const [services, setServices] = useState([]);
  const [service1Name, setService1Name] = useState("Déjeuner");
  const [service2Name, setService2Name] = useState("");
  const [service3Name, setService3Name] = useState("");
  const [service4Name, setService4Name] = useState("");
  const [service1StartTime, setService1StartTime] = useState(720);
  const [service2StartTime, setService2StartTime] = useState(null);
  const [service3StartTime, setService3StartTime] = useState(null);
  const [service4StartTime, setService4StartTime] = useState(null);
  const [service1EndTime, setService1EndTime] = useState(840);
  const [service2EndTime, setService2EndTime] = useState(null);
  const [service3EndTime, setService3EndTime] = useState(null);
  const [service4EndTime, setService4EndTime] = useState(null);
  const [service1Gap, setService1Gap] = useState(15);
  const [service2Gap, setService2Gap] = useState(null);
  const [service3Gap, setService3Gap] = useState(null);
  const [service4Gap, setService4Gap] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const nameRef = useRef(null);
  const addressRef = useRef(null);
  const cityRef = useRef(null);
  const countryRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const openingDaysRef = useRef(null);
  const service1NameRef = useRef(null);
  const service2NameRef = useRef(null);
  const service3NameRef = useRef(null);
  const service4NameRef = useRef(null);
  const service1StartTimeRef = useRef(null);
  const service2StartTimeRef = useRef(null);
  const service3StartTimeRef = useRef(null);
  const service4StartTimeRef = useRef(null);
  const service1EndTimeRef = useRef(null);
  const service2EndTimeRef = useRef(null);
  const service3EndTimeRef = useRef(null);
  const service4EndTimeRef = useRef(null);
  const service1GapRef = useRef(null);
  const service2GapRef = useRef(null);
  const service3GapRef = useRef(null);
  const service4GapRef = useRef(null);

  const resetInputs = () => {
    setSiret("");
    setName("");
    setAddress("");
    setCity("");
    setCountry("France");
    setPhoneNumber("+33");
    setEmail("");
    setPassword("");
    setOpeningDays([
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
      "dimanche",
    ]);
    setServices([
      { name: "déjeuner", startTime: 720, endTime: 840, gap: 15 },
      { name: "dîner", startTime: 1140, endTime: 1320, gap: 30 },
    ]);
  };

  const validateSignupInputs = () => {
    if (
      !name ||
      !address ||
      !city ||
      !country ||
      !siret ||
      !email ||
      !phoneNumber ||
      !password ||
      !openingDays ||
      !services
    ) {
      setErrorMessage("Tous les champs doivent être remplis.");
      return false;
    }
    return true;
  };

  const validateLoginInputs = () => {
    if (!email || !password) {
      setErrorMessage("Tous les champs doivent être remplis.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e && e.preventDefault();
    setErrorMessage("");
    if (!validateLoginInputs()) return;

    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/restaurants/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (data.result) {
        toast.success(data.message);
        resetInputs();
      }
    } catch (err) {
      console.error(err);
      toast.error(
        data.message || "Une erreur est survenue lors de la connexion.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e && e.preventDefault();
    setErrorMessage("");
    setServices([
      {
        name: service1Name && service1Name,
        startTime: service1StartTime && convertMinutesToTime(service1StartTime),
        endTime: service1EndTime && convertMinutesToTime(service1EndTime),
        gap: service1Gap & service1Gap,
      },
      {
        name: service2Name && service2Name,
        startTime: service2StartTime && convertMinutesToTime(service2StartTime),
        endTime: service2EndTime && convertMinutesToTime(service2EndTime),
        gap: service2Gap && service2Gap,
      },
      {
        name: service3Name && service3Name,
        startTime: service3StartTime && convertMinutesToTime(service3StartTime),
        endTime: service3EndTime && convertMinutesToTime(service3EndTime),
        gap: service3Gap && service3Gap,
      },
      {
        name: service4Name && service4Name,
        startTime: service4StartTime && convertMinutesToTime(service4StartTime),
        endTime: service4EndTime && convertMinutesToTime(service4EndTime),
        gap: service4Gap && service4Gap,
      },
    ]);
    if (!validateSignupInputs()) return;

    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/restaurants/new`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            siret,
            name,
            address,
            city,
            country,
            email,
            phoneNumber,
            openingDays,
            services,
          }),
        },
      );

      const data = await response.json();

      if (data.result) {
        toast.success(data.message);
        resetInputs();
      }
    } catch (err) {
      console.error(err);
      toast.error(
        data.message || "Une erreur est survenue lors de la connexion.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-backgroundLight backdrop-blur-sm p-4 md:p-10">
      <div className="relative w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden flex flex-row justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-background/20 text-white rounded-full w-12 h-12 flex m-3 items-center justify-center transition-all border border-white/20"
        >
          <X size={24} />
        </button>
        <form
          onSubmit={(e) => {
            isSignup ? handleSignup(e) : handleLogin(e);
          }}
          className="flex flex-col justify-center items-center h-full w-4/5 m-12 p-6 bg-primary rounded-xl "
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 w-full">
            {isSignup && (
              <div className="w-full md:w-1/3 flex flex-col jusfify-evenly items-center">
                <input
                  className="p-3 text-base border-b-2 rounded-lg mt-3 mb-3 w-full  outline-none text-secondary focus:border-secondary transition-colors"
                  placeholder="N° SIRET"
                  type="text"
                  enterKeyHint="next"
                  onChange={(e) => setSiret(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, nameRef)}
                  value={siret}
                  autoCapitalize="on"
                  autoCorrect="off"
                ></input>
                <input
                  className="p-3 text-base border-b-2 rounded-lg mt-3 mb-3 outline-none w-full text-secondary focus:border-secondary transition-colors"
                  placeholder="Nom du restaurant"
                  type="text"
                  enterKeyHint="next"
                  ref={nameRef}
                  onKeyDown={(e) => handleKeyDown(e, addressRef)}
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  autoCapitalize="words"
                  autoCorrect="off"
                ></input>
                <input
                  className="p-3 text-base border-b-2 rounded-lg mt-3 mb-3 outline-none w-full text-secondary focus:border-secondary transition-colors"
                  placeholder="Adresse du restaurant"
                  type="text"
                  enterKeyHint="next"
                  ref={addressRef}
                  onKeyDown={(e) => handleKeyDown(e, cityRef)}
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  autoCapitalize="words"
                  autoCorrect="on"
                ></input>
                <input
                  className="p-3 text-base border-b-2 rounded-lg mt-3 mb-3 outline-none w-full text-secondary focus:border-secondary transition-colors"
                  placeholder="Ville"
                  type="text"
                  enterKeyHint="next"
                  ref={cityRef}
                  onKeyDown={(e) => handleKeyDown(e, countryRef)}
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  autoCapitalize="words"
                  autoCorrect="on"
                ></input>
                <input
                  className="p-3 text-base border-b-2 rounded-lg mt-3 mb-3 outline-none w-full text-secondary focus:border-secondary transition-colors"
                  placeholder="Pays"
                  type="text"
                  enterKeyHint="next"
                  ref={countryRef}
                  onKeyDown={(e) => handleKeyDown(e, emailRef)}
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                  autoCapitalize="words"
                  autoCorrect="on"
                ></input>
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 text-secondary"
                  placeholder="Numéro de téléphone"
                  type="tel"
                  enterKeyHint="next"
                  ref={phoneNumberRef}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                  value={phoneNumber}
                  autoCorrect="off"
                ></input>
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Jours d'ouverture"
                  type="select"
                  ref={openingDaysRef}
                  onChange={(e) => setOpeningDays(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, servicesRef)}
                  value={openingDays}
                ></input>
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Nom Service 1"
                  type="text"
                  enterKeyHint="next"
                  ref={service1NameRef}
                  onChange={(e) => setService1Name(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, service1StartTimeRef)}
                  value={service1Name}
                ></input>
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Heure début Service 1"
                  type="time"
                  enterKeyHint="next"
                  ref={service1StartTimeRef}
                  onChange={(e) => setService1StartTime(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, service1EndTimeRef)}
                  value={service1StartTime}
                ></input>{" "}
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Heure fin Service 1"
                  type="time"
                  enterKeyHint="next"
                  ref={service1EndTimeRef}
                  onChange={(e) => setService1EndTime(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, service1GapRef)}
                  value={service1EndTime}
                ></input>
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Écart entre les horaires Service 1"
                  type="time"
                  enterKeyHint="next"
                  ref={service1GapRef}
                  onChange={(e) => setService1Gap(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, null)}
                  value={service1Gap}
                ></input>
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Nom Service 2"
                  type="text"
                  enterKeyHint="next"
                  ref={service2NameRef}
                  onChange={(e) => setService2Name(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, service2StartTimeRef)}
                  value={service2Name}
                ></input>
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Heure début Service 2"
                  type="time"
                  enterKeyHint="next"
                  ref={service2StartTimeRef}
                  onChange={(e) => setService2StartTime(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, service2EndTimeRef)}
                  value={service2StartTime}
                ></input>{" "}
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Heure fin Service 2"
                  type="time"
                  enterKeyHint="next"
                  ref={service2EndTimeRef}
                  onChange={(e) => setService2EndTime(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, service2GapRef)}
                  value={service2EndTime}
                ></input>{" "}
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Écart entre les horaires Service 2"
                  type="time"
                  enterKeyHint="next"
                  ref={service2GapRef}
                  onChange={(e) => setService2Gap(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, null)}
                  value={service2Gap}
                ></input>
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Nom Service 3"
                  type="text"
                  enterKeyHint="next"
                  ref={service3NameRef}
                  onChange={(e) => setService3Name(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, service3StartTimeRef)}
                  value={service3Name}
                ></input>
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Heure début Service 3"
                  type="time"
                  enterKeyHint="next"
                  ref={service3StartTimeRef}
                  onChange={(e) => setServiceStartTime(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, service3EndTimeRef)}
                  value={service3StartTime}
                ></input>{" "}
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Heure fin Service 3"
                  type="time"
                  enterKeyHint="next"
                  ref={service3EndTimeRef}
                  onChange={(e) => setService3EndTime(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, service3GapRef)}
                  value={service3EndTime}
                ></input>{" "}
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Écart entre les horaires Service 3"
                  type="time"
                  enterKeyHint="next"
                  ref={service3GapRef}
                  onChange={(e) => setService3Gap(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, null)}
                  value={service3Gap}
                ></input>
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Nom Service 4"
                  type="text"
                  enterKeyHint="next"
                  ref={service4NameRef}
                  onChange={(e) => setService4Name(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, service4StartTimeRef)}
                  value={service4Name}
                ></input>
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Heure début Service 4"
                  type="time"
                  enterKeyHint="next"
                  ref={service4StartTimeRef}
                  onChange={(e) => setService4StartTime(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, service4EndTimeRef)}
                  value={service4StartTime}
                ></input>
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Heure fin Service 4"
                  type="time"
                  enterKeyHint="next"
                  ref={service4EndTimeRef}
                  onChange={(e) => setService4EndTime(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, service4GapRef)}
                  value={service4EndTime}
                ></input>
                <input
                  className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                  placeholder="Écart entre les horaires Service 4"
                  type="time"
                  enterKeyHint="next"
                  ref={service4GapRef}
                  onChange={(e) => setService4Gap(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, null)}
                  value={service4Gap}
                ></input>
              </div>
            )}

            <div className="w-1/3 flex flex-col jusfify-evenly items-center">
              <input
                className="p-3 text-base border-b-2 rounded-lg w-full mt-3 mb-3 outline-none text-secondary focus:border-secondary transition-colors"
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
                className="p-3 text-base rounded-lg outline-none w-full mt-3 mb-3 focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
                placeholder="*******"
                type={isPasswordVisible ? "text" : "password"}
                enterKeyHint="next"
                ref={passwordRef}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, openingDaysRef)}
                value={password}
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
            <p className="text-white">
              {isSignup ? "Inscription" : "Connexion"}
            </p>
          </button>
        </form>
      </div>
    </div>
  );
}

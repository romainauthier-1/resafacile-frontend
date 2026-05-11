import { useState, useEffect, useRef, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { capitalize, convertTimeToMinutes } from "./utils";
import StepRestaurant from "./StepRestaurant";
import StepServices from "./StepServices";
import StepAccount from "./StepAccount";

import { login, logout } from "../reducers/connectedRestaurant";

export default function Modal({ onClose, isSignup }) {
  const dispatch = useDispatch();

  const bookingList = useSelector((state) => state.bookings);

  const [isLoading, setIsLoading] = useState(false);

  // Infos Restaurant
  const [siret, setSiret] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [openingDays, setOpeningDays] = useState([
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ]);
  const [gap, setGap] = useState(15);

  // Infos services
  const [services, setServices] = useState([
    { name: "Déjeuner", startTime: "12:00", endTime: "14:00" },
    { name: "Dîner", startTime: "19:00", endTime: "21:00" },
  ]);

  const addService = () => {
    if (services.length >= 4) return;
    setServices([...services, { name: "", startTime: "", endTime: "" }]);
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index, field, value) => {
    setServices(
      services.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };
  // Infos compte
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNext = () => {
    setErrorMessage("");
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSignup();
    }
  };

  const handleBack = () => {
    setErrorMessage("");
    setCurrentStep(currentStep - 1);
  };

  const resetInputs = () => {
    setName("");
    setAddress("");
    setCity("");
    setZipCode("");
    setPhoneNumber("");
    setEmail("");
    setPassword("");
    setOpeningDays(["mardi", "mercredi", "jeudi", "vendredi", "samedi"]);
    setServices([
      { name: "déjeuner", startTime: "12:00", endTime: "14:00" },
      { name: "dîner", startTime: "19:00", endTime: "22:00" },
    ]);
  };

  const resetInputsSoft = () => {
    setName("");
    setAddress("");
    setCity("");
    setZipCode("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e && e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Tous les champs doivent être remplis.");
      return;
    }

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
        dispatch(login(data.restaurant));
        resetInputs();
        onClose();
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Une erreur est survenue lors de la connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e && e.preventDefault();
    setErrorMessage("");

    if (
      !siret ||
      !name ||
      !address ||
      !city ||
      !zipCode ||
      !phoneNumber ||
      !email ||
      !password ||
      !gap
    ) {
      setErrorMessage("Tous les champs doivent être remplis.");
      return;
    }

    try {
      setIsLoading(true);

      const servicesToDB = services.map((service) => ({
        ...service,
        startTime: convertTimeToMinutes(service.startTime),
        endTime: convertTimeToMinutes(service.endTime),
      }));

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
            zipCode,
            email,
            password,
            phoneNumber,
            openingDays,
            gap,
            services: servicesToDB,
          }),
        },
      );

      const data = await response.json();

      if (data.result) {
        toast.success(data.message);
        dispatch(login(data.restaurant));
        resetInputs();
        onClose();
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  // Pré-remplissage formulaire avec le siret
  const getRestaurantInfos = async (siret) => {
    setErrorMessage("");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/restaurants/${siret}`,
      );
      const data = await response.json();

      if (!data.result) {
        setErrorMessage(data.message);
      }

      const restaurant = data.restaurant;
      setName(restaurant?.businessCommercialName || "");
      setAddress(
        restaurant?.businessAddress
          ? `${restaurant.businessAddress?.number} ${restaurant.businessAddress?.streetType} ${restaurant.businessAddress?.streetName}`
          : "",
      );
      setZipCode(restaurant.businessAddress?.zipCode || "");
      setCity(capitalize(restaurant.businessAddress?.city) || "");
    } catch (err) {
      setErrorMessage("Nous n'avons pas pu pré-remplir le formulaire.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (siret.length === 14) {
      getRestaurantInfos(siret);
    }

    if (siret.length < 10) {
      setErrorMessage("");
      resetInputsSoft();
    }
  }, [siret]);

  const steps = ["Restaurant", "Services", "Compte"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-backgroundLight backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-[var(--radius)] overflow-hidden shadow-[var(--shadow)] bg-[var(--surface)] border border-[var(--border)]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-0">
          <h2 className="text-lg font-medium text-[var(--text)]">
            {isSignup ? "Créer votre restaurant" : "Connexion"}
          </h2>
          <button
            onClick={onClose}
            className="btn-tertiary p-1.5 hover:text-[var(--restaurant-primary)] flex-shrink-0"
          >
            <X size={18} color={"black"} />
          </button>
        </div>

        {/* Stepper — uniquement en mode signup */}
        {isSignup && (
          <div className="flex items-center gap-2 px-6 pt-4 pb-2">
            {steps.map((label, i) => (
              <Fragment key={i}>
                <div
                  className={`flex items-center gap-2 ${currentStep > i && "cursor-pointer"}`}
                  onClick={() => currentStep > i && setCurrentStep(i)}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all 
                    ${
                      i < currentStep
                        ? "bg-green-200 text-[var(--restaurant-secondary)]"
                        : i === currentStep
                          ? "bg-[var(--restaurant-secondary)] text-[var(--surface-strong)]"
                          : "border border-[var(--border)] text-[var(--muted)]"
                    }`}
                  >
                    {i < currentStep ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-xs font-medium
                    ${
                      i < currentStep
                        ? "text-[var(--restaurant-secondary)]"
                        : i === currentStep
                          ? "text-[var(--restaurant-secondary)]"
                          : "text-[var(--muted)]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px ${i < currentStep ? "bg-[var(--restaurant-secondary)]" : "bg-[var(--border)]"}`}
                  />
                )}
              </Fragment>
            ))}
          </div>
        )}

        {/* Contenu */}
        <div className="p-6">
          {!isSignup && (
            <StepAccount
              isSignup={isSignup}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
              handleLogin={handleLogin}
            />
          )}
          {isSignup && currentStep === 0 && (
            <StepRestaurant
              siret={siret}
              setSiret={setSiret}
              name={name}
              setName={setName}
              address={address}
              setAddress={setAddress}
              city={city}
              setCity={setCity}
              zipCode={zipCode}
              setZipCode={setZipCode}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              openingDays={openingDays}
              setOpeningDays={setOpeningDays}
              gap={gap}
              setGap={setGap}
            />
          )}
          {isSignup && currentStep === 1 && (
            <StepServices
              services={services}
              onUpdate={updateService}
              onAdd={addService}
              onRemove={removeService}
            />
          )}
          {isSignup && currentStep === 2 && (
            <StepAccount
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
              handleSignup={handleSignup}
              isSignup={isSignup}
            />
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm mt-3">{errorMessage}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-[var(--border)]">
          <button
            onClick={handleBack}
            className={
              currentStep === 0 || !isSignup
                ? "invisible"
                : "text-sm text-[var(--text)] hover:scale-110 transition-transform"
            }
          >
            ← Retour
          </button>
          <button
            onClick={isSignup ? handleNext : handleLogin}
            disabled={isLoading}
            className="btn-primary px-6 py-2 text-sm disabled:opacity-50"
          >
            {isLoading
              ? "..."
              : isSignup && currentStep < 2
                ? "Suivant →"
                : isSignup
                  ? "Créer le compte"
                  : "Connexion"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { capitalize, colors } from "../components/utils";

import { login, logout } from "../reducers/user";
import { useDispatch } from "react-redux";

import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSignup, setIsSignup] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const validateLoginInputs = () => {
    if (!email || !password) {
      setErrorMessage("Adresse e-mail ou mot de passe invalide.");
      return false;
    }
    return true;
  };

  const validateSignupInputs = () => {
    if (!firstName || !lastName || !email || !password) {
      setErrorMessage("Tous les champs sont obligatoires.");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    setErrorMessage("");
    if (!validateSignupInputs()) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password }),
        },
      );

      const data = await response.json();
      if (data.result) {
        dispatch(
          login({
            firstName: data.savedUser.firstName,
            lastName: data.savedUser.lastName,
            token: data.savedUser.token,
            subscription: data.savedUser.subscription ? true : false,
          }),
        );
        setFirstName(null);
        setLastName(null);
        setEmail(null);
        setPassword(null);
      } else {
        setErrorMessage(
          data.message || "Le nom ou le mot de passe est invalide.",
        );
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignin = async () => {
    setErrorMessage("");
    if (!validateLoginInputs()) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();
      if (data.result) {
        dispatch(
          login({
            firstName: data.foundUser.firstName,
            lastName: data.foundUser.lastName,
            token: data.foundUser.token,
            subscription: data.foundUser.subscription ? true : false,
          }),
        );
        setEmail(null);
        setPassword(null);
      } else {
        setErrorMessage(
          data.message || "Le nom ou le mot de passe est invalide.",
        );
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err.message);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (nextField) {
        nextField.current?.focus();
      }
    }
  };

  return (
    <div className="flex flex-col max-h-[100vh] max-w-[100vw]">
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-md rounded-3xl">
          <div className="w-16 h-16 border-4 border-t-primary border-white/20 rounded-full animate-spin mb-4"></div>
          <p className="text-white font-bold text-lg animate-pulse">
            Chargement en cours...
          </p>
          <p className="text-secondary text-sm mt-2">Patience 🧘‍♂️</p>
        </div>
      )}
      <div className="flex flex-col justify-center items-center md:flex-row md:justify-evenly gap-8 p-4">
        <div className="flex h-full w-[500px] m-12 p-6 bg-primary rounded-xl flex-col">
          {isSignup && (
            <>
              <input
                className="p-3 border-b-2 rounded-lg mt-3 mb-3 outline-none text-secondary focus:border-secondary transition-colors"
                placeholder="Prénom"
                type="text"
                enterKeyHint="next"
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, lastNameRef)}
                value={firstName}
              ></input>
              <input
                className="p-3 border-b-2 rounded-lg mt-3 mb-3 outline-none text-secondary focus:border-secondary transition-colors"
                placeholder="Nom de famille"
                type="text"
                enterKeyHint="next"
                ref={lastNameRef}
                onKeyDown={(e) => handleKeyDown(e, emailRef)}
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              ></input>
            </>
          )}
          <input
            className="p-3 border-b-2 rounded-lg mt-3 mb-3 outline-none text-secondary focus:border-secondary transition-colors"
            placeholder="Adresse e-mail"
            inputMode="email"
            enterKeyHint="next"
            ref={emailRef}
            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          ></input>
          <div className="flex flex-row items-center bg-white rounded-lg  mt-3 mb-3 p-3  justify-between">
            <input
              className=" rounded-lg outline-none focus:border-secondary transition-colors border-b-2 flex-1 text-secondary"
              placeholder="Mot de passe"
              type={isPasswordVisible ? "text" : "password"}
              enterKeyHint="go"
              ref={passwordRef}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            ></input>
            {isPasswordVisible ? (
              <EyeOff
                onClick={togglePasswordVisibility}
                className="cursor-pointer"
                color={colors.primary}
              />
            ) : (
              <Eye
                onClick={togglePasswordVisibility}
                className="cursor-pointer"
                color={colors.primary}
              />
            )}
          </div>
          {errorMessage && (
            <p className="text-destructive text-sm mt-2">{errorMessage}</p>
          )}
          {isSignup ? (
            <>
              <button
                onClick={() => handleSignup()}
                className="p-3 mt-6 bg-secondary rounded-full"
              >
                <p className="text-primaryLight">Je m'inscris !</p>
              </button>
              <button
                onClick={() => setIsSignup(false)}
                className="p-3 mt-6 bg-secondary rounded-full"
              >
                <p className="text-primaryLight">J'ai déjà un compte</p>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleSignin()}
                className="p-3 mt-6 bg-secondary rounded-full"
              >
                <p className="text-primaryLight">Je me connecte !</p>
              </button>
              <button
                onClick={() => setIsSignup(true)}
                className="p-3 mt-6 bg-secondary rounded-full"
              >
                <p className="text-primaryLight">Je n'ai pas de compte</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

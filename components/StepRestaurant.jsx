import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { capitalize } from "./utils";

export default function StepRestaurant({
  siret,
  setSiret,
  name,
  setName,
  address,
  setAddress,
  city,
  setCity,
  zipCode,
  setZipCode,
  phoneNumber,
  setPhoneNumber,
  openingDays,
  setOpeningDays,
  gap,
  setGap,
}) {
  const weekDays = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche",
  ];

  const toggleDay = (day) => {
    setOpeningDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const siretRef = useRef(null);
  const nameRef = useRef(null);
  const addressRef = useRef(null);
  const cityRef = useRef(null);
  const zipCodeRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const gapRef = useRef(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="N° SIRET"
          type="number"
          value={siret}
          maxLength={14}
          minLength={14}
          required
          returnKeyType="next"
          ref={siretRef}
          onSubmit={() => phoneNumberRef.current?.focus()}
          onChange={(e) => setSiret(e.target.value)}
          className="field-input text-slate-900"
        />
        <input
          placeholder="06 12 34 56 78"
          type="tel"
          required
          value={phoneNumber}
          returnKeyType="next"
          ref={phoneNumberRef}
          onSubmit={() => nameRef.current?.focus()}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="field-input text-slate-900"
        />
        <input
          placeholder="Nom du restaurant"
          value={name}
          required
          returnKeyType="next"
          ref={nameRef}
          onSubmit={() => addressRef.current?.focus()}
          onChange={(e) => setName(e.target.value)}
          className="field-input text-slate-900 col-span-2"
        />
        <input
          placeholder="Adresse"
          value={address}
          required
          returnKeyType="next"
          ref={addressRef}
          onSubmit={() => zipCodeRef.current?.focus()}
          onChange={(e) => setAddress(e.target.value)}
          className="field-input text-slate-900 col-span-2"
        />
        <input
          placeholder="Code Postal"
          value={zipCode}
          type="number"
          maxLength={5}
          minLength={5}
          required
          returnKeyType="next"
          ref={zipCodeRef}
          onSubmit={() => cityRef.current?.focus()}
          onChange={(e) => setZipCode(e.target.value)}
          className="field-input text-slate-900"
        />
        <input
          placeholder="Ville"
          value={city}
          returnKeyType="next"
          ref={cityRef}
          onSubmit={() => gapRef.current?.focus()}
          onChange={(e) => setCity(e.target.value)}
          className="field-input text-slate-900"
        />
      </div>

      <p className="text-l text-center font-bold text-[var(--text)]">
        Jours d'ouverture
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {weekDays.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            className={`btn-secondary px-4 py-2 text-sm transition-all
              ${
                openingDays.includes(day)
                  ? "bg-[var(--restaurant-secondary)] text-white border-[var(--restaurant-secondary)]"
                  : ""
              }`}
          >
            {capitalize(day)}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1 justify-center items-center">
        <label className="text-xs text-[var(--text)]">
          Écart entre chaque créneau (min)
        </label>
        <input
          type="number"
          min="5"
          step="5"
          value={gap}
          returnKeyType="next"
          ref={gapRef}
          onChange={(e) => setGap(Number(e.target.value))}
          className="field-input text-slate-900 text-center"
        />
      </div>
    </div>
  );
}

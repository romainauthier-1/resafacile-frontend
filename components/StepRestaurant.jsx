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

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="N° SIRET"
          type="number"
          value={siret}
          onChange={(e) => setSiret(e.target.value)}
          className="text-secondary input rounded-md p-2"
        />
        <input
          placeholder="+33"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="text-secondary input rounded-md p-2"
        />
        <input
          placeholder="Nom du restaurant"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-secondary input col-span-2 rounded-md p-2"
        />
        <input
          placeholder="Adresse"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="text-secondary input col-span-2 rounded-md p-2"
        />
        <input
          placeholder="Code Postal"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="text-secondary input rounded-md p-2"
        />
        <input
          placeholder="Ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="text-secondary input rounded-md p-2"
        />
      </div>

      <p className="text-l text-center font-bold text-white">
        Jours d'ouverture
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {weekDays.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            className={`px-3 py-1 rounded-full text-xs border transition-all
              ${
                openingDays.includes(day)
                  ? "bg-secondary text-white border-secondary"
                  : "border-white text-white"
              }`}
          >
            {capitalize(day)}
          </button>
        ))}
      </div>
    </div>
  );
}

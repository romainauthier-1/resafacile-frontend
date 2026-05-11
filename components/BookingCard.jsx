import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Trash2, Pencil } from "lucide-react";
import { colors, capitalize } from "./utils";

export default function BookingCard({ booking, onDelete, onUpdate }) {
  const dispatch = useDispatch();

  const dateOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const hourOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const occasion = booking.occasion;

  return (
    <div className="bg-primaryLight rounded-xl shadow-xl p-2 flex flex-col md:grid md:grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr_0.5fr] items-center justify-center">
      <Pencil
        className="cursor-pointer hover:scale-110 transition-transform"
        color={colors.secondary}
        onClick={onUpdate}
      />
      <h2 className="font-bold text-center p-2 ">{`${new Date(booking.dateTime).toLocaleTimeString("fr-FR", hourOptions)}`}</h2>
      <h2 className="font-bold text-center p-2 truncate ">{`${capitalize(booking.customer.firstName)} ${capitalize(booking.customer.lastName)}`}</h2>
      <p className="text-center p-2 ">{`${booking.nbPax} personnes`}</p>
      <p className="text-center p-2 ">{`Tél: ${booking.customer.phoneNumber}`}</p>
      <p className="text-center p-2 italic ">{occasion}</p>
      <Trash2
        color={colors.destructive}
        onClick={onDelete}
        className="cursor-pointer hover:scale-110 transition-transform"
      />
    </div>
  );
}

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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col md:grid md:grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr_0.5fr] items-center justify-center hover:shadow-md transition-shadow">
      <button
        className="btn-tertiary p-2 hover:text-secondary"
        onClick={onUpdate}
      >
        <Pencil size={20} />
      </button>
      <h2 className="font-semibold text-center text-slate-900">{`${new Date(booking.dateTime).toLocaleTimeString("fr-FR", hourOptions)}`}</h2>
      <h2 className="font-semibold text-center text-slate-900 truncate">{`${capitalize(booking.customer.firstName)} ${capitalize(booking.customer.lastName)}`}</h2>
      <p className="text-center text-slate-600">{`${booking.nbPax} personnes`}</p>
      <p className="text-center text-slate-600">{`Tél: ${booking.customer.phoneNumber}`}</p>
      <p className="text-center text-slate-600 italic">{occasion}</p>
      <button
        className="btn-tertiary p-2 hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}

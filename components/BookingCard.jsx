import { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Trash2, Pencil } from "lucide-react";
import { colors } from "./utils";

export default function BookingCard({ booking }) {
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

  return (
    <div className="bg-primaryLight rounded-xl shadow-xl m-6 p-6 flex flex-col h-52 w-64">
      <div className="flex flex-row justify-between">
        <Pencil
          className="cursor-pointer hover:scale-110 transition-transform"
          color={colors.secondary}
        />
        <h2 className="font-bold text-center p-2">{`${new Date(booking.dateTime).toLocaleDateString("fr-FR", dateOptions)} à ${new Date(booking.dateTime).toLocaleTimeString("fr-FR", hourOptions)}`}</h2>
        <h2 className="font-bold text-center p-2">{`${booking.customer.firstName} ${booking.customer.lastName}`}</h2>
        <Trash2
          color={colors.primary}
          className="cursor-pointer hover:scale-110 transition-transform"
        />
      </div>
      <p className="text-center p-2">{`${booking.nbPax} personnes`}</p>
      <p className="text-center p-2">{`Tél: ${booking.customer.phoneNumber}`}</p>
    </div>
  );
}

import { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Trash2, Pencil } from "lucide-react";
import { colors } from "./utils";

export default function Card({ title, description }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-primaryLight rounded-xl shadow-xl m-6 p-6 flex flex-col h-52 w-64">
      <div className="flex flex-row justify-between">
        <Pencil
          className="cursor-pointer hover:scale-110 transition-transform"
          color={colors.secondary}
        />
        <h2 className="font-bold text-center p-2">{title}</h2>
        <Trash2
          color={colors.primary}
          className="cursor-pointer hover:scale-110 transition-transform"
        />
      </div>
      <p className="text-center p-2">{description}</p>
    </div>
  );
}

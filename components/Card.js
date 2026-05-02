import { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Trash2, Pencil } from "lucide-react";

export default function Card() {
  const dispatch = useDispatch();

  return (
    <div className="bg-violet-100/50 rounded-xl shadow-xl m-6 p-6 absolute flex flex-col">
      <div className="flex flex-row justify-between">
        <Pencil
          className="cursor-pointer hover:scale-110 transition-transform"
          color="purple"
        />
        <h2 className="font-bold text-center p-2">Titre</h2>
        <Trash2
          color="red"
          className="cursor-pointer hover:scale-110 transition-transform"
        />
      </div>
      <p className="text-center p-2">Description</p>
    </div>
  );
}

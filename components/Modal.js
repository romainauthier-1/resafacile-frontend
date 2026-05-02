import { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { Pencil, X, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function Modal({ onClose }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-backgroundLight backdrop-blur-sm p-4 md:p-10">
      <div className="relative w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden flex flex-row justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <button className="bg-white/10 hover:bg-background/20 text-white rounded-full w-12 h-12 flex m-3 items-center justify-center transition-all border border-white/20">
          <Plus size={24} />
        </button>
        <button className="bg-white/10 hover:bg-background/20 text-white rounded-full w-12 h-12 flex m-3 items-center justify-center transition-all border border-white/20">
          <Pencil size={24} />
        </button>
        <button className="bg-white/10 hover:bg-background/20 text-white rounded-full w-12 h-12 flex m-3 items-center justify-center transition-all border border-white/20">
          <Trash2 size={24} />
        </button>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-background/20 text-white rounded-full w-12 h-12 flex m-3 items-center justify-center transition-all border border-white/20"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}

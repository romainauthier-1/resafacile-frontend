import { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { Pencil, X, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function Modal() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10">
      <div className="relative w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <Plus
          size={10}
          className="bg-white/10 cursor-pointer hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all border border-white/20"
        />

        <button
          onClick={() => {
            onClose();
          }}
          className="bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all border border-white/20"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

import { capitalize, convertMinutesToTime } from "./utils";
import { Trash2 } from "lucide-react";

export default function StepServices({ services, onUpdate, onAdd, onRemove }) {
  return (
    <div className="flex flex-col gap-4">
      {services.map((service, i) => (
        <div
          key={i}
          className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] p-6 flex flex-col gap-4"
        >
          <div className="flex justify-between gap-20 items-center">
            <input
              placeholder="Nom du service"
              value={capitalize(service.name)}
              onChange={(e) => onUpdate(i, "name", e.target.value)}
              className="field-input text-slate-900 flex-1 font-medium"
            />
            {services.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-red-400 text-md hover:text-red-300"
              >
                <Trash2 size={25} />
              </button>
            )}
          </div>
          <div className="flex flex-row justify-evenly items-center gap-3  flex-wrap">
            <div className="flex flex-col gap-1 justify-center items-center">
              <label className="text-xs text-[var(--text)]">Début</label>
              <input
                type="time"
                value={service.startTime}
                onChange={(e) => onUpdate(i, "startTime", e.target.value)}
                className="field-input text-slate-900"
              />
            </div>
            <div className="flex flex-col gap-1 justify-center items-center">
              <label className="text-xs text-[var(--text)]">Fin</label>
              <input
                type="time"
                value={service.endTime}
                onChange={(e) => onUpdate(i, "endTime", e.target.value)}
                className="field-input text-slate-900"
              />
            </div>
          </div>
        </div>
      ))}
      {services.length < 4 && (
        <button
          type="button"
          onClick={onAdd}
          className="btn-secondary px-4 py-3 text-sm w-full"
        >
          + Ajouter un service
        </button>
      )}
    </div>
  );
}

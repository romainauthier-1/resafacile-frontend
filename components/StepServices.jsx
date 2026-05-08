import { capitalize, convertMinutesToTime } from "./utils";
import { Trash2 } from "lucide-react";

export default function StepServices({ services, onUpdate, onAdd, onRemove }) {
  return (
    <div className="flex flex-col gap-4">
      {services.map((service, i) => (
        <div
          key={i}
          className="border border-white/90 rounded-xl p-4 flex flex-col gap-3"
        >
          <div className="flex justify-between gap-20 items-center">
            <input
              placeholder="Nom du service"
              value={capitalize(service.name)}
              onChange={(e) => onUpdate(i, "name", e.target.value)}
              className="text-secondary p-2 flex-1 input w-40 font-medium rounded-md"
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
              <label className="text-xs text-white">Début</label>
              <input
                type="time"
                value={service.startTime}
                onChange={(e) => onUpdate(i, "startTime", e.target.value)}
                className="text-secondary p-2 input rounded-md "
              />
            </div>
            <div className="flex flex-col gap-1 justify-center items-center">
              <label className="text-xs text-white">Fin</label>
              <input
                type="time"
                value={service.endTime}
                onChange={(e) => onUpdate(i, "endTime", e.target.value)}
                className="text-secondary p-2 input rounded-md"
              />
            </div>
            <div className="flex flex-col gap-1 justify-center items-center">
              <label className="text-xs text-white">
                Écart entre chaque créneau (min)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={service.gap}
                onChange={(e) => onUpdate(i, "gap", Number(e.target.value))}
                className="text-secondary p-2 input rounded-md text-center"
              />
            </div>
          </div>
        </div>
      ))}
      {services.length < 4 && (
        <button
          type="button"
          onClick={onAdd}
          className="text-sm text-white border border-dashed border-white rounded-xl py-2 hover:text-secondaryLight hover:border-secondaryLight hover:scale-105 transition-all"
        >
          + Ajouter un service
        </button>
      )}
    </div>
  );
}

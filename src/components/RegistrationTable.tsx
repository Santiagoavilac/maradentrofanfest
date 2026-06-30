import { CheckCircle2 } from "lucide-react";
import type { Registration } from "../lib/supabase";
import Button from "./Button";

type RegistrationTableProps = {
  registrations: Registration[];
  onCheckIn: (registration: Registration) => void;
  onCheckOut: (registration: Registration) => void;
};

function formatDateTime(value: string | null) {
  return value ? new Date(value).toLocaleString() : "Sin registro";
}

function formatCompanions(registration: Registration) {
  if (registration.companions === 0) return "Sin acompañantes";
  if (registration.companion_names.length === 0) return `${registration.companions} sin nombre`;
  return registration.companion_names.join(", ");
}

export default function RegistrationTable({ registrations, onCheckIn, onCheckOut }: RegistrationTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/12 bg-white/[0.07] backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-[1160px] w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.08] text-xs uppercase tracking-[0.12em] text-white/56">
            <tr>
              <th className="px-4 py-4">Nombre</th>
              <th className="px-4 py-4">Teléfono</th>
              <th className="px-4 py-4">Acompañantes</th>
              <th className="px-4 py-4">Estado</th>
              <th className="px-4 py-4">Reserva</th>
              <th className="px-4 py-4">Entrada</th>
              <th className="px-4 py-4">Salida</th>
              <th className="px-4 py-4">Acción</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr key={registration.id} className="border-b border-white/8 last:border-none">
                <td className="px-4 py-4 font-semibold">
                  {registration.first_name} {registration.last_name}
                  <span className="block text-xs font-normal text-white/45">{registration.qr_code}</span>
                </td>
                <td className="px-4 py-4 text-white/72">{registration.phone}</td>
                <td className="px-4 py-4 text-white/62">{formatCompanions(registration)}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${registration.status === "checked_in" ? "bg-pitch/18 text-pitch" : "bg-sand/18 text-sand"}`}>
                    {registration.status === "checked_in" ? "Ingresado" : "Pendiente"}
                  </span>
                </td>
                <td className="px-4 py-4 text-white/62">{formatDateTime(registration.created_at)}</td>
                <td className="px-4 py-4 text-white/62">{formatDateTime(registration.checked_in_at)}</td>
                <td className="px-4 py-4 text-white/62">{formatDateTime(registration.checked_out_at)}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      className="min-h-10 px-4 py-2 text-xs"
                      disabled={registration.status === "checked_in"}
                      onClick={() => onCheckIn(registration)}
                    >
                      <CheckCircle2 size={16} />
                      Marcar entrada
                    </Button>
                    <Button
                      className="min-h-10 px-4 py-2 text-xs"
                      variant="secondary"
                      disabled={registration.status !== "checked_in" || Boolean(registration.checked_out_at)}
                      onClick={() => onCheckOut(registration)}
                    >
                      Marcar salida
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {registrations.length === 0 ? <p className="px-5 py-8 text-center text-white/58">Sin registros para mostrar.</p> : null}
    </div>
  );
}

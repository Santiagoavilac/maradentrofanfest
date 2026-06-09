import { Link, useParams } from "react-router-dom";
import Button from "../components/Button";
import Layout from "../components/Layout";
import QRCard from "../components/QRCard";
import { readRegistrationSnapshot } from "../lib/qr";
import type { Registration } from "../lib/supabase";

export default function MyQR() {
  const { id } = useParams();
  const registration = readRegistrationSnapshot<Registration>();
  const isCurrent = registration?.id === id;
  const qrValue = isCurrent && registration ? registration.qr_code : `MA-2026-${id?.slice(0, 8).toUpperCase() ?? "QR"}`;
  const fullName = isCurrent && registration ? `${registration.first_name} ${registration.last_name}` : undefined;

  return (
    <Layout>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-4xl place-items-center px-4 py-8">
        <div className="w-full text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-lagoon">Registro confirmado</p>
          <h1 className="mt-3 font-display text-4xl font-black sm:text-6xl">Tu entrada está lista</h1>
          <p className="mx-auto mt-4 max-w-lg text-white/68">
            Mostrá este QR en el ingreso al Fan Fest.
          </p>

          <div className="mt-8">
            <QRCard
              value={qrValue}
              name={fullName}
            />
          </div>

          {!isCurrent ? (
            <p className="mx-auto mt-5 max-w-sm text-sm text-sand">
              Este navegador no tiene el registro guardado en sesión. El QR visual sigue disponible, pero el nombre se muestra al volver desde el registro.
            </p>
          ) : null}

          <Link className="mt-6 inline-flex" to="/">
            <Button variant="secondary">Volver al inicio</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

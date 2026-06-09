import { QRCodeCanvas } from "qrcode.react";
import Button from "./Button";

type QRCardProps = {
  value: string;
  name?: string;
};

export default function QRCard({ value, name }: QRCardProps) {
  const downloadQr = () => {
    const canvas = document.getElementById("fan-fest-qr") as HTMLCanvasElement | null;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `mar-adentro-${value}.png`;
    link.click();
  };

  return (
    <section className="mx-auto grid w-full max-w-sm gap-5 rounded-[2rem] border border-white/18 bg-white/[0.1] p-5 text-center shadow-glow backdrop-blur-2xl">
      <div className="rounded-[1.5rem] bg-white p-4">
        <QRCodeCanvas id="fan-fest-qr" value={value} size={280} marginSize={2} level="H" />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-lagoon">{value}</p>
        {name ? <h2 className="mt-2 font-display text-2xl font-black">{name}</h2> : null}
        <p className="mt-2 text-sm text-white/68">Mostrá este QR en el ingreso al Fan Fest.</p>
      </div>
      <Button type="button" onClick={downloadQr}>
        Descargar QR
      </Button>
    </section>
  );
}

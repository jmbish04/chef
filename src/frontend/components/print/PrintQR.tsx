import { QRCodeSVG } from "qrcode.react";
import React, { useEffect, useState } from "react";

export default function PrintQR({ recipeId }: { recipeId: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.origin + "/print/" + recipeId);
  }, [recipeId]);

  if (!url) return null;

  return (
    <div className="flex flex-col items-center gap-2 my-8 p-4 border rounded-xl bg-white text-black">
      <QRCodeSVG value={url} size={128} />
      <p className="text-xs font-mono">Scan for mobile view</p>
    </div>
  );
}

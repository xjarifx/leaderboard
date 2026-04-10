import { useState } from "react";
import { API_BASE } from "../lib/api";

export default function DataDownloadButton() {
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (isPreparing) return;

    setError("");
    setIsPreparing(true);

    try {
      const response = await fetch(`${API_BASE}/public/data-download`);

      if (!response.ok) {
        throw new Error("Failed to download data");
      }

      const blob = await response.blob();
      const contentDisposition =
        response.headers.get("Content-Disposition") || "";
      const matchedName = contentDisposition.match(/filename=\"?([^\";]+)\"?/i);
      const fileName = matchedName?.[1] || "leaderboard-data.json";

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setIsPreparing(false);
    }
  };

  return (
    <div className="global-download-wrap" aria-live="polite">
      <button
        type="button"
        className="btn btn-primary global-download-btn"
        onClick={handleDownload}
        disabled={isPreparing}
      >
        {isPreparing ? "Preparing data..." : "Download Public Data"}
      </button>
      {error && (
        <p className="global-download-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

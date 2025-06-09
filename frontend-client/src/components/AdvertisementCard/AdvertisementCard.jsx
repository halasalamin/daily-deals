import React, { useState, useEffect } from "react";

const AdvertisementCard = ({ ad }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const time = calculateTimeLeft(ad.endTime);
      setTimeLeft(time);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [ad.endTime]);

  const companyName =
    typeof ad.companyId === "string" ? "Company" : ad.companyId?.name || "Company";

  return (
    <div className="advertisement-card" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      {ad.imageUrl ? (
        <img
          src={ad.imageUrl}
          alt={`Ad from ${companyName}`}
          style={{ width: "600px", height: "300px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
        />
      ) : (
        <div className="no-image-placeholder">No Image Available</div>
      )}

      <div
        style={{
          backgroundColor: "white",
          color: "#167f81",
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "20px",
          fontWeight: "700",
          padding: "10px 18px",
          borderRadius: "12px",
          boxShadow: "0 0 1px #167f81",
          minWidth: "160px",
          textAlign: "center",
          userSelect: "none",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        {timeLeft}
      </div>
    </div>
  );
};

const calculateTimeLeft = (offerEnd) => {
  const offerEndDate = new Date(offerEnd);
  const now = new Date();
  const diff = offerEndDate.getTime() - now.getTime();
  if (diff <= 0) return "Ad expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  // Format with leading zeros for better look
  const pad = (n) => (n < 10 ? "0" + n : n);

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)} remaining`;
};

export default AdvertisementCard;

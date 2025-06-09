import React, { useState, useEffect } from "react";
import AdvertisementCard from "./AdvertisementCard";
import "./AdvertisementSlider.css";
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';

const AdvertisementSlider = () => {
  const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/ads/approved");
        const data = await res.json();
        setAds(data || []);
      } catch (error) {
        console.error("Failed to fetch ads:", error);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextAd();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentAd, ads]);

  const nextAd = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
      setFade(false);
    }, 300);
  };

  const prevAd = () => {
    setFade(true);
    setTimeout(() => {
      setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length);
      setFade(false);
    }, 300);
  };

  if (ads.length === 0) return <p>Loading advertisements...</p>;

  return (
    <div className="advertisement-slider">
      <button onClick={prevAd} className="slider-arrow left" style={{borderRadius: "50%"}}>
        <ChevronLeftOutlinedIcon style={{ fontSize: "40px", color: "gray" }} />
      </button>

      <div className={`ad-container ${fade ? "fade" : ""}`}>
        <AdvertisementCard ad={ads[currentAd]} />
      </div>

      <button onClick={nextAd} className="slider-arrow right" style={{borderRadius: "50%"}}>
        <ChevronRightOutlinedIcon style={{ fontSize: "40px", color: "gray" }} />
      </button>
    </div>
  );
};

export default AdvertisementSlider;

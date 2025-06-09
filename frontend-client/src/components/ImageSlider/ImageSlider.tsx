import { useState } from "react";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { IconButton } from "@mui/material";
import styles from './ImageSlider.module.css';

const ImageSlider = ({ images }: { images: string[] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.imageRow}>
        <IconButton 
          onClick={() => setSelectedIndex(selectedIndex - 1)} 
          disabled={selectedIndex === 0}
          className={styles.arrowButton}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>

        <img 
          className={styles.sliderImage}
          src={images[selectedIndex]} 
          alt={`product ${selectedIndex}`} 
        />

        <IconButton 
          onClick={() => setSelectedIndex(selectedIndex + 1)} 
          disabled={selectedIndex === images.length - 1}
          className={styles.arrowButton}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </div>

      <div className={styles.dotsContainer}>
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`${styles.dot} ${selectedIndex === index ? styles.dotActive : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;

import React from "react";
import "./MobileGallery.css";

const mobiles = [
  { brand: "Apple", img: "/images/apple.jpg", link: "https://www.apple.com" },
  { brand: "Samsung", img: "/images/samsung.jpg", link: "https://www.samsung.com" },
  { brand: "Xiaomi", img: "/images/xiaomi.jpg", link: "https://www.mi.com" },
  { brand: "OnePlus", img: "/images/oneplus.jpg", link: "https://www.oneplus.com" },
  { brand: "Oppo", img: "/images/oppo.jpg", link: "https://www.oppo.com" },
  { brand: "Vivo", img: "/images/vivo.jpg", link: "https://www.vivo.com" }
];

function MobileGallery() {
  return (
    <div className="gallery">
      {mobiles.map((mobile, index) => (
        <div className="card" key={index}>
          <img src={mobile.img} alt={mobile.brand} />
          <a href={mobile.link} target="_blank" rel="noopener noreferrer">
            Visit {mobile.brand}
          </a>
        </div>
      ))}
    </div>
  );
}

export default MobileGallery;

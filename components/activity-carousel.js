/* app/components/Carousel.jsx */
'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const activityImages = [
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127462/IMG-20250628-WA0100_thchpj.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127462/IMG-20250628-WA0099_gej4jn.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127462/IMG-20250628-WA0098_ktkta9.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127462/IMG-20250628-WA0091_imu1px.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127462/IMG-20250628-WA0101_erikmx.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127462/IMG-20250628-WA0090_byltsf.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127463/IMG-20250628-WA0095_yylsph.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127463/IMG-20250628-WA0088_gtrv5r.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127464/IMG-20250628-WA0097_msvxal.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127463/IMG-20250628-WA0096_zyhr3q.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127464/IMG-20250628-WA0087_xngpga.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127464/IMG-20250628-WA0094_tknk2c.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127464/IMG-20250628-WA0093_tujy6z.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127464/IMG-20250628-WA0086_ny8l8r.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127465/IMG-20250628-WA0085_epg3qv.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127465/IMG-20250628-WA0092_zl2sqb.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127465/IMG-20250628-WA0089_qzipi5.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127465/IMG-20250628-WA0084_u0uai9.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127465/IMG-20250628-WA0083_easv2c.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127466/IMG-20250628-WA0081_xpmjsb.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127466/IMG-20250628-WA0082_flxuhk.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127466/IMG-20250628-WA0080_v2drza.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127466/IMG-20250628-WA0078_rhdmlv.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127467/IMG-20250628-WA0079_ej1wkd.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127467/IMG-20250628-WA0077_papf5x.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127467/IMG-20250628-WA0076_kqvche.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127467/IMG-20250628-WA0075_rifrxc.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127532/IMG-20250628-WA0073_waejus.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127532/IMG-20250628-WA0070_ftesj3.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127532/IMG-20250628-WA0072_h1zu1g.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127533/IMG-20250628-WA0067_ln9zh8.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127533/IMG-20250628-WA0068_q7hmv3.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127533/IMG-20250628-WA0071_fr4q6k.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127533/IMG-20250628-WA0069_skgil4.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127533/IMG-20250628-WA0065_kdddyp.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127533/IMG-20250628-WA0066_ufnoqf.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127534/IMG-20250628-WA0064_t4wqth.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127564/IMG-20250628-WA0062_bcxdue.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127564/IMG-20250628-WA0063_vkmmff.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127564/IMG-20250628-WA0061_y6dqyg.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127566/IMG-20250628-WA0059_lko7ml.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127566/IMG-20250628-WA0055_lcftgc.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127567/IMG-20250628-WA0056_lxvx3s.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127567/IMG-20250628-WA0057_dt62qe.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127568/IMG-20250628-WA0052_ufhxys.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127568/IMG-20250628-WA0053_lhljui.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127569/IMG-20250628-WA0054_ji446e.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127604/IMG-20250628-WA0047_kqmlgf.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127604/IMG-20250628-WA0049_ncpaln.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127604/IMG-20250628-WA0051_ikgrf7.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127604/IMG-20250628-WA0046_zeky0q.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127604/IMG-20250628-WA0048_jqr1x8.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127604/IMG-20250628-WA0050_lpri0o.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127605/IMG-20250628-WA0045_xhxwzo.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127605/IMG-20250628-WA0043_s2rir5.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127605/IMG-20250628-WA0044_h2covf.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127605/IMG-20250628-WA0042_lthvtl.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127606/IMG-20250628-WA0041_hgpxko.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127606/IMG-20250628-WA0040_rdo0e3.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127606/IMG-20250628-WA0039_utmm6j.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127607/IMG-20250628-WA0038_wawpjy.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127611/IMG-20250628-WA0037_y3ucl1.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127659/IMG-20250628-WA0034_a4gfiu.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127660/IMG-20250628-WA0035_qpd4ws.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127660/IMG-20250628-WA0031_s2re8v.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127661/IMG-20250628-WA0032_alvwgv.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127661/IMG-20250628-WA0033_zk4lp6.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127662/IMG-20250628-WA0029_j9szop.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127662/IMG-20250628-WA0030_tork4n.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127662/IMG-20250628-WA0026_hgro7y.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127662/IMG-20250628-WA0028_mbt0vh.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127663/IMG-20250628-WA0036_xi8dpv.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127663/IMG-20250628-WA0027_sqbuwt.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127665/IMG-20250628-WA0025_wpdx0r.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127710/IMG-20250628-WA0023_n43ywx.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127710/IMG-20250628-WA0024_co2shs.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127710/IMG-20250628-WA0022_msfjzv.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127710/IMG-20250628-WA0021_evas7p.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127711/IMG-20250628-WA0020_igv90z.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127712/IMG-20250628-WA0019_eheypn.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127713/IMG-20250628-WA0018_ygvjn1.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127775/IMG-20250628-WA0007_z1b9vy.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127776/IMG-20250628-WA0004_shtqpc.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127776/IMG-20250628-WA0005_qr3xz1.jpg", alt: "", title: "" },
  { src: "https://res.cloudinary.com/chirkut/image/upload/v1751127777/IMG-20250628-WA0001_d8xc5l.jpg", alt: "", title: "" }
];

const Carousel = () => {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const next = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setIndex((index + 1) % activityImages.length);
      setTimeout(() => setIsTransitioning(false), 700);
    }
  };
  
  const prev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setIndex((index - 1 + activityImages.length) % activityImages.length);
      setTimeout(() => setIsTransitioning(false), 700);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) {
        next();
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [index, isTransitioning]);

  const getImageStyle = (position) => {
    switch (position) {
      case -2:
        return 'w-[5%] -mr-[2.5%] blur-sm opacity-30 z-0';
      case 2:
        return 'w-[5%]  -ml-[2.5%] blur-sm opacity-30 z-0';
      case -1:
        return 'w-[25%] h-[30vh]  -mr-[12.5%] blur-sm opacity-60 z-0';
      case 1:
        return 'w-[25%] h-[30vh]  -ml-[12.5%] blur-sm opacity-60 z-0';
      case 0:
        return 'w-[60%] h-[70vh] z-10';
      default:
        return 'hidden';
    }
  };

  const visibleIndexes = [-2, -1, 0, 1, 2];

  return (
    <div className="relative flex items-center justify-center w-[90%] max-w-screen mx-auto h-[680px] overflow-visible">
      <button onClick={prev} className="absolute left-0 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all duration-300">
        <ChevronLeft />
      </button>
      <div className="flex items-center justify-center relative">
        {visibleIndexes.map((offset) => {
          const imgIndex = (index + offset + activityImages.length) % activityImages.length;
          const image = activityImages[imgIndex];
          return (
            <div
              key={imgIndex}
              className={`transition-all duration-700 ease-out rounded-xl overflow-hidden relative ${getImageStyle(offset)}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="max-h-[650px] w-full object-fill transition-transform duration-700 ease-out"
              />
            </div>
          );
        })}
      </div>
      <button onClick={next} className="absolute right-0 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all duration-300">
        <ChevronRight />
      </button>
    </div>
  );
};

export default Carousel;

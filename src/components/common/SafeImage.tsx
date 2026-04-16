import Image from 'next/image';
import { useState } from 'react';

export const SafeImage = ({ src, alt, ...props }: any) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc || "/no-poster.png"}
      alt={alt}
      onError={() => setImgSrc("/no-poster.png")} // Resim yüklenemezse varsayılanı koy
    />
  );
};
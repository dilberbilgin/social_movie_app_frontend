export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  if (!target.src.includes('no-poster.png')) {
    target.src = "/no-poster.png";
  }
};
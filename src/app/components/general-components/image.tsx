interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
}
export default function Image({ src, alt = "image", className = "" }: ImageProps) {
  return (
    <div
      className={`bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${src})` }}
      role="img"
      aria-label={alt}
    ></div>
  );
}

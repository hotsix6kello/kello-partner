export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="18" fill="url(#brandMarkGradient)" />
      <path
        d="M18 15H29V29.95L40.55 15H54L39.65 32.18L54 49H40.52L29 35.31V49H18V15Z"
        fill="white"
      />
      <defs>
        <linearGradient id="brandMarkGradient" x1="9.5" y1="7" x2="55.5" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF7E9D" />
          <stop offset="1" stopColor="#C98D94" />
        </linearGradient>
      </defs>
    </svg>
  );
}

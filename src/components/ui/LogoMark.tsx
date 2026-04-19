interface LogoMarkProps {
  className?: string;
  title?: string;
}

// 스꾸버스 로고 마크 (favicon과 동일한 path).
// fill="currentColor"로 Tailwind text-* 클래스로 색상을 제어할 수 있다.
export default function LogoMark({
  className,
  title = "스꾸버스",
}: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <path
        fill="currentColor"
        d="M 433 764 L 591 764 L 843 252 L 606 252 L 512 583 L 417 252 L 181 252 Z"
      />
    </svg>
  );
}

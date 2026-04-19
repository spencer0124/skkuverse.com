import AnimatedReveal from "./AnimatedReveal";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

export default function SectionHeading({
  label,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={alignClass}>
      {label && (
        <AnimatedReveal>
          <p className="text-t6 font-bold text-brand mb-3">{label}</p>
        </AnimatedReveal>
      )}
      <AnimatedReveal delay={0.1}>
        <h2 className="text-t2 md:text-display font-bold text-grey-900 whitespace-pre-line tracking-tight">
          {title}
        </h2>
      </AnimatedReveal>
      {description && (
        <AnimatedReveal delay={0.2}>
          <p className="mt-4 text-t5 md:text-t4 text-grey-500 font-normal whitespace-pre-line">
            {description}
          </p>
        </AnimatedReveal>
      )}
    </div>
  );
}

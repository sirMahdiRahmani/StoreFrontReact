import { Diamond } from "./icons";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  align?: "center" | "start";
  className?: string;
}

/**
 * Editorial section header: a gilt eyebrow with a leading diamond, a serif
 * title, and (when centered) a short gilt underline. Used to give every
 * section a consistent, deliberate opening.
 */
export function SectionHeading({ eyebrow, title, align = "center", className = "" }: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <div className={`flex flex-col gap-2 ${isCenter ? "items-center text-center" : "items-start text-start"} ${className}`}>
      {eyebrow && (
        <span className="flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-gilt">
          <Diamond className="h-1 w-1" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-2xl leading-tight text-text-1 sm:text-3xl">{title}</h2>
      {isCenter && <span className="mt-1 h-px w-12 bg-gilt/50" aria-hidden="true" />}
    </div>
  );
}

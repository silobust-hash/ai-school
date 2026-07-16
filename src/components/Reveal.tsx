import type { ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in ms */
  delay?: number;
  /** Wrapper element tag (default div) */
  as?: ElementType;
  className?: string;
};

/** Content-first wrapper: visible on the initial paint and without JavaScript. */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: RevealProps) {
  return (
    <Tag
      className={`reveal is-visible ${className}`}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

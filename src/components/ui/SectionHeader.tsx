import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-serif text-xl font-semibold text-espresso sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-sm text-espresso/60">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
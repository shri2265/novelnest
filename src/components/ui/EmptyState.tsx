import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  body?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, body, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-parchment-deep/50 bg-ivory/60 px-6 py-12 text-center ${className}`}>
      {Icon ? (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-parchment/50 text-terracotta">
          <Icon className="h-7 w-7" />
        </div>
      ) : null}
      <h3 className="font-serif text-lg font-medium italic text-espresso">{title}</h3>
      {body ? <p className="mt-1 max-w-sm text-sm leading-relaxed text-espresso/55">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
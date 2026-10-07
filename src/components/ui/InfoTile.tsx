import type { LucideIcon } from "lucide-react";

interface InfoTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function InfoTile({ icon: Icon, label, value }: InfoTileProps) {
  return (
    <div className="rounded-2xl border border-parchment-deep/40 bg-ivory p-3.5 text-center">
      <Icon className="mx-auto h-[18px] w-[18px] text-terracotta" />
      <p className="mt-1.5 font-serif text-base font-semibold text-espresso">{value}</p>
      <p className="text-[11px] text-espresso/50">{label}</p>
    </div>
  );
}
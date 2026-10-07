import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { subscribeToasts } from "../../lib/toast";

export function ToastHost() {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);
  const next = useRef(1);

  useEffect(() => subscribeToasts((msg) => {
    const id = next.current++;
    setItems((prev) => [...prev.slice(-2), { id, msg }]);
    window.setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 2600);
  }), []);

  if (items.length === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-8">
      {items.map((i) => (
        <div key={i.id} className="fade-up flex items-center gap-2 rounded-full bg-espresso px-4 py-2.5 text-sm text-cream shadow-lift">
          <Check className="h-4 w-4 text-gold" />
          {i.msg}
        </div>
      ))}
    </div>
  );
}
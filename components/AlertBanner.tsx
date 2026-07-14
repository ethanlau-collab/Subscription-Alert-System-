"use client";

import { Subscription } from "@/types/subscription";

interface Props {
  expiringSoon: Subscription[];
  expired: Subscription[];
}

export default function AlertBanner({ expiringSoon, expired }: Props) {
  return (
    <div className="mb-6 space-y-3">
      {expired.length > 0 && (
        <div className="bg-red-950 border border-red-800 rounded-xl px-5 py-3">
          <p className="text-red-400 font-semibold text-sm mb-1">⚠ Expired Subscriptions</p>
          <ul className="text-red-300 text-sm space-y-0.5">
            {expired.map((s) => (
              <li key={s.id}>• {s.name}</li>
            ))}
          </ul>
        </div>
      )}
      {expiringSoon.length > 0 && (
        <div className="bg-amber-950 border border-amber-800 rounded-xl px-5 py-3">
          <p className="text-amber-400 font-semibold text-sm mb-1">🔔 Renewing Within 7 Days</p>
          <ul className="text-amber-300 text-sm space-y-0.5">
            {expiringSoon.map((s) => {
              const days = Math.ceil((new Date(s.renewalDate).getTime() - Date.now()) / 86400000);
              return (
                <li key={s.id}>• {s.name} — in {days} day{days !== 1 ? "s" : ""}</li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

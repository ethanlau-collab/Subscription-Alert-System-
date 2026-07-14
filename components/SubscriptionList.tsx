"use client";

import { Subscription } from "@/types/subscription";

interface Props {
  subscriptions: Subscription[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", CAD: "CA$", AUD: "A$", JPY: "¥",
};

const CATEGORY_COLORS: Record<string, string> = {
  Software: "bg-blue-900 text-blue-300",
  Media: "bg-purple-900 text-purple-300",
  Gaming: "bg-green-900 text-green-300",
  Cloud: "bg-cyan-900 text-cyan-300",
  Finance: "bg-yellow-900 text-yellow-300",
  Health: "bg-red-900 text-red-300",
  Education: "bg-orange-900 text-orange-300",
  Other: "bg-gray-800 text-gray-300",
};

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function statusLabel(days: number) {
  if (days < 0) return { text: `Expired ${Math.abs(days)}d ago`, cls: "text-red-400" };
  if (days === 0) return { text: "Expires today", cls: "text-red-400" };
  if (days <= 7) return { text: `Expires in ${days}d`, cls: "text-amber-400" };
  return { text: `Renews in ${days}d`, cls: "text-gray-400" };
}

export default function SubscriptionList({ subscriptions, onEdit, onDelete }: Props) {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-16 text-gray-600">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-sm">No subscriptions yet. Add one above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 mb-4">{subscriptions.length} subscription{subscriptions.length !== 1 ? "s" : ""} — auto-saved</p>
      {subscriptions.map((sub) => {
        const days = daysUntil(sub.renewalDate);
        const status = statusLabel(days);
        const symbol = CURRENCY_SYMBOLS[sub.currency] ?? sub.currency;
        const catColor = CATEGORY_COLORS[sub.category] ?? CATEGORY_COLORS.Other;

        return (
          <div
            key={sub.id}
            className={`bg-gray-900 border rounded-xl px-5 py-4 flex items-center justify-between gap-4 ${
              days < 0 ? "border-red-900" : days <= 7 ? "border-amber-900" : "border-gray-800"
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-white truncate">{sub.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor}`}>
                  {sub.category}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm flex-wrap">
                <span className="text-gray-200 font-medium">
                  {symbol}{sub.cost.toFixed(2)}{" "}
                  <span className="text-gray-500 font-normal text-xs">/ {sub.billingCycle}</span>
                </span>
                <span className={`text-xs ${status.cls}`}>{status.text}</span>
              </div>
              {sub.notes && <p className="text-xs text-gray-500 mt-1 truncate">{sub.notes}</p>}
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onEdit(sub.id)}
                className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete "${sub.name}"?`)) onDelete(sub.id);
                }}
                className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-red-900 text-gray-400 hover:text-red-300 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

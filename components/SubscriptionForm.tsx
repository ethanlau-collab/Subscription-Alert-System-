"use client";

import { useState, useEffect } from "react";
import { Subscription, BillingCycle } from "@/types/subscription";

interface Props {
  onSave: (sub: Omit<Subscription, "id" | "createdAt">) => void;
  onUpdate: (id: string, sub: Omit<Subscription, "id" | "createdAt">) => void;
  editingSubscription: Subscription | null;
  onCancelEdit: () => void;
}

const CATEGORIES = ["Software", "Media", "Gaming", "Cloud", "Finance", "Health", "Education", "Other"];

const empty = {
  name: "",
  cost: "",
  currency: "USD",
  billingCycle: "monthly" as BillingCycle,
  renewalDate: "",
  category: "Software",
  notes: "",
};

export default function SubscriptionForm({ onSave, onUpdate, editingSubscription, onCancelEdit }: Props) {
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (editingSubscription) {
      setForm({
        name: editingSubscription.name,
        cost: String(editingSubscription.cost),
        currency: editingSubscription.currency,
        billingCycle: editingSubscription.billingCycle,
        renewalDate: editingSubscription.renewalDate,
        category: editingSubscription.category,
        notes: editingSubscription.notes,
      });
      setOpen(true);
    }
  }, [editingSubscription]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name: form.name.trim(),
      cost: parseFloat(form.cost) || 0,
      currency: form.currency,
      billingCycle: form.billingCycle,
      renewalDate: form.renewalDate,
      category: form.category,
      notes: form.notes.trim(),
    };
    if (editingSubscription) {
      onUpdate(editingSubscription.id, data);
    } else {
      onSave(data);
    }
    setForm(empty);
    setOpen(false);
  }

  function handleCancel() {
    setForm(empty);
    setOpen(false);
    onCancelEdit();
  }

  return (
    <div className="mb-8">
      {!open && !editingSubscription && (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-3 rounded-lg border-2 border-dashed border-gray-700 text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors text-sm font-medium"
        >
          + Add Subscription
        </button>
      )}

      {(open || editingSubscription) && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4"
        >
          <h2 className="text-lg font-semibold text-white">
            {editingSubscription ? "Edit Subscription" : "New Subscription"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Service Name *</label>
              <input
                required
                type="text"
                placeholder="Netflix, Spotify…"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Cost *</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="9.99"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="w-24">
                <label className="block text-xs text-gray-400 mb-1">Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {["USD", "EUR", "GBP", "CAD", "AUD", "JPY"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Renewal Date *</label>
              <input
                required
                type="date"
                value={form.renewalDate}
                onChange={(e) => setForm({ ...form, renewalDate: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Billing Cycle</label>
              <select
                value={form.billingCycle}
                onChange={(e) => setForm({ ...form, billingCycle: e.target.value as BillingCycle })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="one-time">One-time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Notes</label>
              <input
                type="text"
                placeholder="Optional notes…"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition-colors"
            >
              {editingSubscription ? "Save Changes" : "Add Subscription"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

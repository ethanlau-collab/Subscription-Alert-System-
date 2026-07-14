"use client";

import { useSubscriptions } from "@/hooks/useSubscriptions";
import SubscriptionForm from "@/components/SubscriptionForm";
import SubscriptionList from "@/components/SubscriptionList";
import AlertBanner from "@/components/AlertBanner";

export default function Home() {
  const {
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    editingId,
    setEditingId,
  } = useSubscriptions();

  const now = Date.now();

  const expiringSoon = subscriptions.filter((s) => {
    const days = Math.ceil((new Date(s.renewalDate).getTime() - now) / 86400000);
    return days >= 0 && days <= 7;
  });

  const expired = subscriptions.filter(
    (s) => new Date(s.renewalDate).getTime() < now
  );

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-1 text-white">Subscription Alert System</h1>
        <p className="text-gray-400 mb-8 text-sm">
          Track and manage your subscription expiration dates with automatic alerts
        </p>

        {(expiringSoon.length > 0 || expired.length > 0) && (
          <AlertBanner expiringSoon={expiringSoon} expired={expired} />
        )}

        <SubscriptionForm
          onSave={addSubscription}
          onUpdate={updateSubscription}
          editingSubscription={subscriptions.find((s) => s.id === editingId) ?? null}
          onCancelEdit={() => setEditingId(null)}
        />

        <SubscriptionList
          subscriptions={subscriptions}
          onEdit={(id) => setEditingId(id)}
          onDelete={deleteSubscription}
        />
      </div>
    </main>
  );
}

export type BillingCycle = "monthly" | "yearly" | "weekly" | "one-time";

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  currency: string;
  billingCycle: BillingCycle;
  renewalDate: string; // ISO date string YYYY-MM-DD
  category: string;
  notes: string;
  createdAt: string;
}

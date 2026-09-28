import type { SavingsRecord } from "@/lib/database.types";

export function sumRecords(records: Pick<SavingsRecord, "amount">[]) {
  return records.reduce((total, record) => total + Number(record.amount), 0);
}

export function latestRecord<T extends Pick<SavingsRecord, "recorded_on" | "created_at">>(
  records: T[],
) {
  return [...records].sort((a, b) => {
    const byDate = b.recorded_on.localeCompare(a.recorded_on);
    if (byDate !== 0) return byDate;
    return b.created_at.localeCompare(a.created_at);
  })[0];
}

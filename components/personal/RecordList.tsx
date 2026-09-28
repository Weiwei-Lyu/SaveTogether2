"use client";

import { useState } from "react";
import type { SavingsRecord } from "@/lib/database.types";
import { deletePersonalRecordAction } from "@/lib/actions/personal";
import { ConfirmButton } from "@/components/ConfirmButton";
import { PersonalRecordForm } from "@/components/personal/RecordForm";
import { formatDate, formatMoney } from "@/lib/format";

export function PersonalRecordList({
  goalId,
  records,
  today,
}: {
  goalId: string;
  records: SavingsRecord[];
  today: string;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (records.length === 0) {
    return (
      <p className="text-sm text-muted">
        No confirmed records yet. A planned path does not add dollars by itself.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {records.map((record) => (
        <li key={record.id} className="rounded-2xl border border-line bg-white/70 p-4">
          {editingId === record.id ? (
            <PersonalRecordForm
              goalId={goalId}
              record={record}
              today={today}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{formatMoney(Number(record.amount))}</p>
                <p className="text-sm text-muted">{formatDate(record.recorded_on)}</p>
                {record.note ? <p className="mt-1 text-sm">{record.note}</p> : null}
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="text-sm text-sage-dark hover:underline"
                  onClick={() => setEditingId(record.id)}
                >
                  Edit
                </button>
                <ConfirmButton
                  action={deletePersonalRecordAction}
                  hidden={{ goalId, recordId: record.id }}
                  label="Delete"
                  confirmLabel="Delete record"
                  warning="Delete this confirmed record? Your confirmed saved total will update immediately."
                />
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

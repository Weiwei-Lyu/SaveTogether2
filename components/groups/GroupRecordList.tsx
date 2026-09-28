"use client";

import { useState } from "react";
import type { SavingsRecord } from "@/lib/database.types";
import { deleteGroupRecordAction } from "@/lib/actions/groups";
import { ConfirmButton } from "@/components/ConfirmButton";
import { GroupRecordForm } from "@/components/groups/GroupForms";
import { formatDate, formatMoney } from "@/lib/format";

export function GroupRecordList({
  planId,
  userId,
  records,
  names,
  today,
}: {
  planId: string;
  userId: string;
  records: SavingsRecord[];
  names: Record<string, string>;
  today: string;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (records.length === 0) {
    return (
      <p className="text-sm text-muted">
        No confirmed group contributions yet. Totals stay at $0 until someone records one.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {records.map((record) => {
        const mine = record.user_id === userId;
        return (
          <li key={record.id} className="rounded-2xl border border-line bg-white/70 p-4">
            {editingId === record.id ? (
              <GroupRecordForm
                planId={planId}
                record={record}
                today={today}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {names[record.user_id] ?? "Member"} · {formatMoney(Number(record.amount))}
                  </p>
                  <p className="text-sm text-muted">{formatDate(record.recorded_on)}</p>
                  {record.note ? <p className="mt-1 text-sm">{record.note}</p> : null}
                </div>
                {mine ? (
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="text-sm text-sage-dark hover:underline"
                      onClick={() => setEditingId(record.id)}
                    >
                      Edit
                    </button>
                    <ConfirmButton
                      action={deleteGroupRecordAction}
                      hidden={{ planId, recordId: record.id }}
                      label="Delete"
                      confirmLabel="Delete contribution"
                      warning="Delete your confirmed contribution? The group total will update. Other members’ records stay."
                    />
                  </div>
                ) : null}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

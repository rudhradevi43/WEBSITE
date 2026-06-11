import { AppShell } from "@/components/app-shell";
import { KanbanBoard } from "@/components/kanban-board";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TrackerPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Application tracker</CardTitle>
            <p className="text-sm text-slate-500">
              Drag applications across Saved, Applied, Interview, Technical Round, Final Round, Offer, Rejected, and Visa
              Processing. Applications with no contact after 7 days are flagged for follow-up.
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Each application stores company, title, location, visa type, applied date, recruiter contact, notes, salary,
              and attachments through the backend API.
            </p>
          </CardContent>
        </Card>
        <KanbanBoard />
      </div>
    </AppShell>
  );
}

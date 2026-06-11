"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useSession } from "next-auth/react";
import { AlertTriangle, GripVertical } from "lucide-react";
import { APPLICATION_STATUSES, ApplicationStatus } from "@visapath/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  company: string;
  jobTitle: string;
  location: string;
  visaType?: string;
  status: ApplicationStatus;
  salary?: string;
  recruiterEmail?: string;
  appliedDate?: string;
  followUpRequired?: boolean;
}

const statusLabels: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  TECHNICAL_ROUND: "Technical",
  FINAL_ROUND: "Final",
  OFFER: "Offer",
  REJECTED: "Rejected",
  VISA_PROCESSING: "Visa Processing"
};

export default function TrackerPage() {
  const { data } = useSession();
  const token = data?.accessToken ?? "";
  const queryClient = useQueryClient();

  const { data: applications = [] } = useQuery({
    queryKey: ["applications"],
    enabled: Boolean(token),
    queryFn: () => apiFetch<Application[]>("/applications", { token })
  });

  const move = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      apiFetch(`/applications/${id}/move`, { token, method: "PATCH", body: JSON.stringify({ status }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications"] })
  });

  function onDragEnd(event: DragEndEvent) {
    const id = String(event.active.id);
    const status = event.over?.id as ApplicationStatus | undefined;
    if (status && APPLICATION_STATUSES.includes(status)) {
      move.mutate({ id, status });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Application tracker</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Kanban visa pipeline</h1>
      </div>

      <DndContext onDragEnd={onDragEnd}>
        <div className="grid gap-4 overflow-x-auto pb-4 xl:grid-cols-4 2xl:grid-cols-8">
          {APPLICATION_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              applications={applications.filter((application) => application.status === status)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function KanbanColumn({ status, applications }: { status: ApplicationStatus; applications: Application[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className={cn("min-h-96 rounded-2xl border bg-muted/50 p-3", isOver && "ring-2 ring-emerald-500")}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">{statusLabels[status]}</h2>
        <Badge>{applications.length}</Badge>
      </div>
      <div className="space-y-3">
        {applications.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </div>
    </div>
  );
}

function ApplicationCard({ application }: { application: Application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: application.id });
  const style = { transform: CSS.Translate.toString(transform) };

  return (
    <Card ref={setNodeRef} style={style} className={cn("cursor-grab bg-card", isDragging && "opacity-70 shadow-premium")}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm">{application.company}</CardTitle>
          <button {...listeners} {...attributes} aria-label="Drag application">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        <p className="text-sm font-medium">{application.jobTitle}</p>
        <p className="text-xs text-muted-foreground">{application.location}</p>
        {application.visaType ? <Badge>{application.visaType}</Badge> : null}
        {application.followUpRequired ? (
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-2 text-xs font-semibold text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            Follow Up Required
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

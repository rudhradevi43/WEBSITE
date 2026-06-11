"use client";

import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Application, ApplicationStatus } from "@/lib/api";

const columns: { id: ApplicationStatus; label: string }[] = [
  { id: "SAVED", label: "Saved" },
  { id: "APPLIED", label: "Applied" },
  { id: "INTERVIEW", label: "Interview" },
  { id: "TECHNICAL_ROUND", label: "Technical Round" },
  { id: "FINAL_ROUND", label: "Final Round" },
  { id: "OFFER", label: "Offer" },
  { id: "REJECTED", label: "Rejected" },
  { id: "VISA_PROCESSING", label: "Visa Processing" }
];

const initialApplications: Application[] = [
  {
    id: "app-1",
    companyName: "Accenture",
    jobTitle: "Power BI Developer",
    location: "Dublin, Ireland",
    visaType: "Critical Skills Employment Permit",
    status: "APPLIED",
    appliedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    recruiterName: "Hiring Team",
    recruiterEmail: "talent@example.com",
    notes: "Strong DAX and SQL match.",
    salary: "EUR 70,000",
    attachments: [],
    followUpRequired: true
  },
  {
    id: "app-2",
    companyName: "ASML",
    jobTitle: "Data Analyst",
    location: "Eindhoven, Netherlands",
    visaType: "Highly Skilled Migrant",
    status: "INTERVIEW",
    attachments: [],
    followUpRequired: false
  }
];

export function KanbanBoard() {
  const [applications, setApplications] = useState(initialApplications);

  function onDragEnd(event: DragEndEvent) {
    const applicationId = String(event.active.id);
    const status = event.over?.id as ApplicationStatus | undefined;
    if (!status) {
      return;
    }
    setApplications((items) => items.map((item) => (item.id === applicationId ? { ...item, status } : item)));
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="grid min-h-[650px] gap-4 overflow-x-auto pb-4 xl:grid-cols-4 2xl:grid-cols-8">
        {columns.map((column) => (
          <KanbanColumn key={column.id} id={column.id}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">{column.label}</h3>
              <Badge>{applications.filter((application) => application.status === column.id).length}</Badge>
            </div>
            <div className="space-y-3">
              {applications
                .filter((application) => application.status === column.id)
                .map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
            </div>
          </KanbanColumn>
        ))}
      </div>
    </DndContext>
  );
}

function KanbanColumn({ id, children }: { id: ApplicationStatus; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`min-w-72 rounded-2xl border p-3 transition ${
        isOver ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-slate-100/70 dark:bg-slate-900/70"
      }`}
    >
      {children}
    </div>
  );
}

function ApplicationCard({ application }: { application: Application }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: application.id });
  return (
    <Card
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={`cursor-grab bg-white dark:bg-slate-950 ${isDragging ? "opacity-60 shadow-xl" : ""}`}
      {...listeners}
      {...attributes}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-base">{application.jobTitle}</CardTitle>
        <p className="text-sm text-slate-500">{application.companyName}</p>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 text-sm">
        <p>{application.location}</p>
        <p className="text-slate-500">Visa: {application.visaType ?? "To confirm"}</p>
        {application.followUpRequired ? (
          <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950">Follow Up Required</Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import type { Appointment } from "@/lib/types";
import AppointmentCard from "./AppointmentCard";

export default function PastAppointments({ appointments }: { appointments: Appointment[] }) {
  const [open, setOpen] = useState(false);

  if (appointments.length === 0) return null;

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-sm text-postech-gray hover:text-gray-700 flex items-center gap-1 transition-colors"
      >
        <span>{open ? "▲" : "▼"}</span>
        <span>지난 약속 {appointments.length}개 {open ? "접기" : "보기"}</span>
      </button>
      {open && (
        <div className="space-y-3 mt-3">
          {appointments.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
        </div>
      )}
    </div>
  );
}

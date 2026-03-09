import Link from "next/link";
import type { Appointment } from "@/lib/types";
import { getAppointmentStatus } from "@/lib/types";

function StatusBadge({ status }: { status: "OPEN" | "FULL" | "PAST" }) {
  const label = { OPEN: "모집중", FULL: "마감", PAST: "종료" };
  const styles = {
    OPEN: "bg-green-100 text-green-700",
    FULL: "bg-red-100 text-red-700",
    PAST: "bg-gray-100 text-postech-gray",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[status]}`}>
      {label[status]}
    </span>
  );
}

export default function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const status = getAppointmentStatus(appointment);
  const spotsLeft = appointment.max_people - 1 - appointment.participants.length;
  const dateObj = new Date(appointment.datetime);

  const dateStr = dateObj.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
  const timeStr = dateObj.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/appointment/${appointment.id}`}>
      <div className={`bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer ${status === "PAST" ? "opacity-60" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-gray-900 text-base leading-tight">
            {appointment.title}
          </h2>
          <StatusBadge status={status} />
        </div>
        <div className="mt-2 space-y-1 text-sm text-postech-gray">
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span>{appointment.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🕐</span>
            <span>{dateStr} {timeStr}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>👤</span>
            <span>호스트: {appointment.host}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-postech-gray">
            {appointment.participants.length + 1}/{appointment.max_people}명 참여
          </div>
          {status === "OPEN" && (
            <span className="text-sm font-medium text-postech-orange">
              {spotsLeft}자리 남음
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

import { getAllAppointments } from "@/lib/sheets";
import type { Appointment } from "@/lib/types";
import { getAppointmentStatus } from "@/lib/types";
import AppointmentCard from "@/components/AppointmentCard";
import PastAppointments from "@/components/PastAppointments";

export const revalidate = 0;

export default async function HomePage() {
  let appointments: Appointment[] = [];
  let fetchError: string | null = null;

  try {
    appointments = await getAllAppointments();
  } catch (err) {
    console.error("Failed to load appointments:", err);
    fetchError = "약속 목록을 불러오지 못했습니다. Google Sheets 설정을 확인해주세요.";
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">오늘 같이 밥 먹을 사람을 찾아보세요</h1>
      </div>

      <a
        href="https://open.kakao.com/o/sSgGxFki"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-5 hover:bg-yellow-100 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm text-yellow-800">
          <span>💬</span>
          <span>불편한 점이나 건의사항이 있으면 편하게 알려주세요!</span>
        </div>
        <span className="text-xs text-yellow-600 font-medium shrink-0">피드백 보내기 →</span>
      </a>

      {fetchError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
          {fetchError}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🍽️</div>
          <p className="font-medium">아직 약속이 없어요</p>
          <p className="text-sm mt-1">첫 번째 약속을 만들어보세요!</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {appointments
              .filter((appt) => getAppointmentStatus(appt) !== "PAST")
              .map((appt) => (
                <AppointmentCard key={appt.id} appointment={appt} />
              ))}
          </div>
          <PastAppointments
            appointments={appointments.filter((appt) => getAppointmentStatus(appt) === "PAST")}
          />
        </>
      )}
    </div>
  );
}

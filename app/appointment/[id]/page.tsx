import { notFound } from "next/navigation";
import { getAppointmentById } from "@/lib/sheets";
import { getAppointmentStatus } from "@/lib/types";
import JoinForm from "@/components/JoinForm";
import Link from "next/link";

export const revalidate = 0;

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appointment = await getAppointmentById(id);

  if (!appointment) notFound();

  const status = getAppointmentStatus(appointment);
  const spotsLeft = appointment.max_people - 1 - appointment.participants.length;

  const dateObj = new Date(appointment.datetime);
  const dateStr = dateObj.toLocaleDateString("ko-KR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = dateObj.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusLabel = { OPEN: "자리가 남았어요", FULL: "자리가 찼어요", PAST: "지난 약속" };
  const statusStyles = {
    OPEN: "bg-green-100 text-green-700",
    FULL: "bg-red-100 text-red-700",
    PAST: "bg-gray-100 text-postech-gray",
  };

  const disabledReason =
    status === "FULL" ? "이미 인원이 꽉 찼어요."
    : status === "PAST" ? "이미 지난 약속이에요."
    : null;

  return (
    <div className="max-w-lg mx-auto">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-postech-gray hover:text-gray-700 mb-4">
        ← 목록으로
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <h1 className="text-xl font-bold text-gray-900">{appointment.title}</h1>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md shrink-0 ${statusStyles[status]}`}>
            {statusLabel[status]}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-postech-gray mb-5">
          <div className="flex items-center gap-2">
            <span className="w-5">📍</span>
            <span>{appointment.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5">🕐</span>
            <span>{dateStr} {timeStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5">👤</span>
            <span>호스트: <strong className="text-gray-800">{appointment.host}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5">👥</span>
            <span>
              {appointment.participants.length + 1} / {appointment.max_people}명 참여
              {status === "OPEN" && (
                <span className="ml-1 text-postech-orange font-medium">
                  ({spotsLeft}자리 남음)
                </span>
              )}
            </span>
          </div>
          {appointment.notes && (
            <div className="flex items-start gap-2">
              <span className="w-5">📝</span>
              <span>{appointment.notes}</span>
            </div>
          )}
          {appointment.kakao_open_chat && (
            <div className="flex items-center gap-2">
              <span className="w-5">💬</span>
              <a
                href={appointment.kakao_open_chat}
                target="_blank"
                rel="noopener noreferrer"
                className="text-postech-orange font-medium hover:underline"
              >
                카카오톡 오픈채팅 참여하기
              </a>
            </div>
          )}
        </div>

        {/* Participants */}
        <div className="border-t border-gray-100 pt-4 mb-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">참여자</h2>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 text-sm">
              <span className="w-6 h-6 bg-postech-red-light text-postech-red rounded-full flex items-center justify-center text-xs font-bold">
                {appointment.host[0]?.toUpperCase()}
              </span>
              <span className="text-gray-700">{appointment.host}</span>
              <span className="text-xs text-postech-gray">(호스트)</span>
            </li>
            {appointment.participants.length === 0 ? (
              <li className="text-sm text-postech-gray italic pl-1">아직 참여자가 없어요.</li>
            ) : (
              appointment.participants.map((p, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 bg-postech-red-light text-postech-red rounded-full flex items-center justify-center text-xs font-bold">
                    {p.nickname[0]?.toUpperCase()}
                  </span>
                  <span className="text-gray-700">{p.nickname}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Join */}
        <div className="border-t border-gray-100 pt-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">닉네임 입력하고 참여하기</h2>
          {disabledReason ? (
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-postech-gray">{disabledReason}</div>
          ) : (
            <JoinForm appointmentId={appointment.id} />
          )}
        </div>
      </div>
    </div>
  );
}

import { Resend } from "resend";
import { Appointment } from "./sheets";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendJoinNotification(
  appointment: Appointment,
  joinerNickname: string
) {
  if (!appointment.host_email) return;

  const spotsLeft = appointment.max_people - appointment.participants.length;
  const isFull = spotsLeft === 0;

  const dateStr = new Date(appointment.datetime).toLocaleString("ko-KR", {
    weekday: "short",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "가치모고 <notifications@yourdomain.com>",
    to: appointment.host_email,
    subject: `${joinerNickname}님이 "${appointment.title}"에 참여했어요!`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#f97316;margin-bottom:4px">🍱 가치모고</h2>
        <p style="color:#6b7280;margin-top:0">누군가 내 약속에 참여했어요!</p>

        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px;margin:16px 0">
          <p style="margin:0 0 8px 0">
            <strong>${joinerNickname}</strong>님이 <strong>${appointment.title}</strong>에 참여했어요
          </p>
          <p style="margin:0;color:#6b7280;font-size:14px">
            📍 ${appointment.location} &nbsp;·&nbsp; 🕐 ${dateStr}
          </p>
        </div>

        <p style="font-size:15px">
          현재 <strong>${appointment.participants.length} / ${appointment.max_people}명</strong> 참여 중
          ${
            isFull
              ? ' — <span style="color:#ef4444">자리가 꽉 찼어요! 🎉</span>'
              : ` — <span style="color:#22c55e">${spotsLeft}자리 남았어요</span>`
          }
        </p>

        <p style="font-size:13px;color:#9ca3af;margin-top:24px">
          가치모고에서 약속을 만들었기 때문에 이 메일이 발송되었습니다.
        </p>
      </div>
    `,
  });
}

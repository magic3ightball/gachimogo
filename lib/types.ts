export interface Participant {
  nickname: string;
  joined_at: string;
}

export function getAppointmentStatus(
  appointment: Appointment
): "OPEN" | "FULL" | "PAST" {
  const now = new Date();
  if (new Date(appointment.datetime) < now) return "PAST";
  if (appointment.participants.length >= appointment.max_people - 1) return "FULL";
  return "OPEN";
}

export interface Appointment {
  id: string;
  title: string;
  host: string;
  location: string;
  datetime: string;
  max_people: number;
  notes: string;
  created_at: string;
  participants: Participant[];
  host_email: string;
  kakao_open_chat: string;
}

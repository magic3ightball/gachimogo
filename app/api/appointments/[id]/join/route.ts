import { NextRequest, NextResponse } from "next/server";
import { addParticipant } from "@/lib/sheets";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { nickname } = body;

    if (!nickname || typeof nickname !== "string" || !nickname.trim()) {
      return NextResponse.json(
        { error: "닉네임을 입력해주세요" },
        { status: 400 }
      );
    }

    const appointment = await addParticipant(id, nickname.trim());
    return NextResponse.json(appointment);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "참여에 실패했습니다";

    const statusMap: Record<string, number> = {
      "Appointment is full": 409,
      "Appointment is in the past": 410,
      "You have already joined this appointment": 409,
      "호스트는 본인 약속에 참여할 수 없어요": 400,
    };

    const status = statusMap[message] ?? 500;
    return NextResponse.json({ error: message }, { status });
  }
}

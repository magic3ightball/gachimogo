import { NextRequest, NextResponse } from "next/server";
import { getAllAppointments, createAppointment } from "@/lib/sheets";

export async function GET() {
  try {
    const appointments = await getAllAppointments();
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("GET /api/appointments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, host, location, datetime, max_people, notes, host_email, kakao_open_chat } = body;

    if (!title || !host || !location || !datetime || !max_people) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해주세요" },
        { status: 400 }
      );
    }

    const maxPeopleNum = parseInt(max_people, 10);
    if (maxPeopleNum < 2 || maxPeopleNum > 20) {
      return NextResponse.json(
        { error: "최대 인원은 2~20명 사이여야 합니다" },
        { status: 400 }
      );
    }

    if (kakao_open_chat && !kakao_open_chat.startsWith("https://open.kakao.com/")) {
      return NextResponse.json(
        { error: "카카오톡 오픈채팅 링크가 올바르지 않아요 (https://open.kakao.com/ 으로 시작해야 해요)" },
        { status: 400 }
      );
    }

    const appointment = await createAppointment({
      title,
      host,
      location,
      datetime,
      max_people: maxPeopleNum,
      notes: notes ?? "",
      host_email: host_email ?? "",
      kakao_open_chat: kakao_open_chat ?? "",
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("POST /api/appointments error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

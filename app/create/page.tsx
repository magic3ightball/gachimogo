"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toLocalDatetimeString(date: Date) {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  }

  function defaultDatetime() {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
    return toLocalDatetimeString(d);
  }

  function minDatetime() {
    return toLocalDatetimeString(new Date());
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      host: (form.elements.namedItem("host") as HTMLInputElement).value,
      location: (form.elements.namedItem("location") as HTMLInputElement).value,
      datetime: new Date((form.elements.namedItem("datetime") as HTMLInputElement).value).toISOString(),
      max_people: (form.elements.namedItem("max_people") as HTMLInputElement).value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value,
      kakao_open_chat: (form.elements.namedItem("kakao_open_chat") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error ?? "오류가 발생했습니다");
      } else {
        router.push(`/appointment/${result.id}`);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-postech-red";

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">새 약속 만들기</h1>
        <p className="text-sm text-postech-gray mt-0.5">같이 밥 먹을 자리를 만들어보세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            제목 <span className="text-postech-red">*</span>
          </label>
          <input name="title" type="text" required placeholder="예: GS25에서 점심" maxLength={80} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            닉네임 (호스트) <span className="text-postech-red">*</span>
          </label>
          <input name="host" type="text" required placeholder="예: 지민" maxLength={30} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            장소 <span className="text-postech-red">*</span>
          </label>
          <input name="location" type="text" required placeholder="예: GS25 1층, 카페테리아 B" maxLength={100} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            날짜 &amp; 시간 <span className="text-postech-red">*</span>
          </label>
          <input
            name="datetime"
            type="datetime-local"
            required
            defaultValue={defaultDatetime()}
            min={minDatetime()}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            최대 인원 <span className="text-postech-red">*</span>
          </label>
          <input name="max_people" type="number" required defaultValue={4} min={2} max={190} className={inputClass} />
          <p className="text-xs text-postech-gray mt-1">호스트 본인 포함 인원이에요.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">메모 (선택)</label>
          <textarea name="notes" rows={3} placeholder="예: 더치페이, 식이 제한 등..." maxLength={300} className={`${inputClass} resize-none`} />
        </div>

<div>
          <label className="block text-sm font-medium text-gray-700 mb-1">카카오톡 오픈채팅 링크 (선택)</label>
          <input name="kakao_open_chat" type="url" placeholder="https://open.kakao.com/o/..." className={inputClass} />
          <p className="text-xs text-postech-gray mt-1">참여자들이 서로 연락할 수 있어요.</p>
        </div>

        {error && (
          <div className="bg-postech-red-light border border-postech-red rounded-lg p-3 text-sm text-postech-red">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-postech-red text-white font-medium py-2.5 rounded-lg hover:bg-postech-red-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "만드는 중…" : "약속 만들기"}
        </button>
      </form>
    </div>
  );
}

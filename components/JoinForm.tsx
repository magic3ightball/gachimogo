"use client";

import { useState } from "react";

export default function JoinForm({ appointmentId }: { appointmentId: string }) {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/appointments/${appointmentId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "참여에 실패했습니다");
      } else {
        setJoined(true);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  if (joined) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 font-medium">
        ✅ 참여 완료!
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 입력"
          maxLength={30}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-postech-red"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !nickname.trim()}
          className="bg-postech-red text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-postech-red-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "참여 중…" : "참여하기"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}

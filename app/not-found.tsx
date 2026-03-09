import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">🍽️</div>
      <h1 className="text-xl font-bold text-gray-800 mb-2">약속을 찾을 수 없어요</h1>
      <p className="text-postech-gray text-sm mb-6">삭제된 약속이거나 잘못된 링크예요.</p>
      <Link
        href="/"
        className="inline-block bg-postech-red text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-postech-red-dark transition-colors"
      >
        목록으로 돌아가기
      </Link>
    </div>
  );
}

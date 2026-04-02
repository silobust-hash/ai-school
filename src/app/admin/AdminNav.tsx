"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminNav() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 bg-teal-600 text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="text-lg font-bold">
            AI업무학교 관리자
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-sm text-teal-100 hover:text-white transition-colors"
          >
            대시보드
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-100 hover:text-white transition-colors"
          >
            사이트 보기
          </a>
          <button
            onClick={handleLogout}
            className="text-sm bg-teal-500 hover:bg-teal-400 px-4 py-1.5 rounded-lg transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
}

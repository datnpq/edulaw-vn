"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  GraduationCap,
  Info,
  XCircle,
} from "lucide-react";

const SCHOOL_LEVELS = [
  { id: "th", label: "Giáo viên Tiểu học (phổ thông)", quota: 23, yearly: 805 },
  { id: "thcs", label: "Giáo viên THCS (phổ thông)", quota: 19, yearly: 665 },
  { id: "thpt", label: "Giáo viên THPT (phổ thông)", quota: 17, yearly: 595 },
  { id: "th-bt", label: "Tiểu học PTDT bán trú", quota: 21, yearly: 735 },
  { id: "thcs-nt", label: "THCS PTDT nội trú / bán trú", quota: 17, yearly: 595 },
  { id: "thpt-nt", label: "THPT PTDT nội trú", quota: 15, yearly: 525 },
];

const CONCURRENT_ROLES = [
  { id: "gvcn", label: "Giáo viên chủ nhiệm lớp phổ thông", reduce: 4, note: "Điều 9" },
  { id: "ttcm", label: "Tổ trưởng chuyên môn / bộ môn", reduce: 3, note: "Điều 9 (vẫn hưởng phụ cấp chức vụ)" },
  { id: "tpcm", label: "Tổ phó chuyên môn / bộ môn", reduce: 1, note: "Điều 9 (vẫn hưởng phụ cấp chức vụ)" },
  { id: "phong-bm", label: "Phụ trách phòng học bộ môn / phòng thiết bị", reduce: 3, note: "Điều 9 (trừ phòng Tin học)" },
  { id: "btcb-lon", label: "Bí thư Chi bộ/Đảng bộ (trường quy mô lớn)", reduce: 4, note: "Điều 10 (≥28 lớp vùng 2-3 hoặc ≥19 lớp vùng 1)" },
  { id: "btcb-thuong", label: "Bí thư Chi bộ/Đảng bộ (trường còn lại)", reduce: 3, note: "Điều 10" },
  { id: "hdt", label: "Chủ tịch / Thư ký Hội đồng trường", reduce: 2, note: "Điều 10" },
  { id: "ttnd", label: "Trưởng Ban thanh tra nhân dân", reduce: 2, note: "Điều 10" },
];

interface TeacherCalculatorsProps {
  onOpenCircular: (circularId: string) => void;
}

export function TeacherCalculators({ onOpenCircular }: TeacherCalculatorsProps) {
  const [levelId, setLevelId] = useState("thcs");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["gvcn"]);

  const selectedLevel =
    SCHOOL_LEVELS.find((l) => l.id === levelId) ?? SCHOOL_LEVELS[1];

  function toggleRole(id: string) {
    setSelectedRoles((prev) => {
      if (prev.includes(id)) return prev.filter((r) => r !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  }

  const totalReduce = selectedRoles.reduce((sum, id) => {
    const role = CONCURRENT_ROLES.find((r) => r.id === id);
    return sum + (role?.reduce ?? 0);
  }, 0);

  const effectiveWeekly = Math.max(0, selectedLevel.quota - totalReduce);
  const maxOvertimeWeekly = Math.round(selectedLevel.quota * 0.5 * 10) / 10;

  const [eduStatus, setEduStatus] = useState<
    "bachelor-done" | "bachelor-studying" | "college-done" | "college-studying"
  >("bachelor-studying");
  const [creditPercent, setCreditPercent] = useState(75);
  const [subjectGroup, setSubjectGroup] = useState<
    "general" | "special-4" | "pe-primary"
  >("general");

  const isStudying =
    eduStatus === "bachelor-studying" || eduStatus === "college-studying";
  const isCollege =
    eduStatus === "college-done" || eduStatus === "college-studying";

  let nvspEligible = false;
  let nvspReason = "";

  if (isStudying && creditPercent < 70) {
    nvspEligible = false;
    nvspReason = `Bạn mới tích lũy ${creditPercent}% khối lượng học tập. Theo Thông tư 91/2026/TT-BGDĐT, sinh viên cần tích lũy tối thiểu 70% tổng khối lượng chương trình đào tạo mới đủ điều kiện đăng ký học chứng chỉ NVSP.`;
  } else if (isCollege && subjectGroup !== "special-4") {
    nvspEligible = false;
    nvspReason =
      subjectGroup === "pe-primary"
        ? "Môn Giáo dục thể chất cấp Tiểu học yêu cầu người có bằng Cử nhân (hoặc sinh viên Đại học tích lũy ≥ 70%) ngành phù hợp."
        : "Các môn phổ thông chung (Toán, Văn, Tiếng Anh, Lý, Hóa, Sinh, Sử, Địa...) yêu cầu trình độ Đại học (đã tốt nghiệp hoặc sinh viên ĐH tích lũy ≥ 70% tín chỉ) ngành phù hợp.";
  } else {
    nvspEligible = true;
    nvspReason = isStudying
      ? `ĐỦ ĐIỀU KIỆN đăng ký học ngay từ mốc 08/12/2026 (TT 91/2026/TT-BGDĐT) mà không cần chờ nhận bằng tốt nghiệp! Chương trình bồi dưỡng gồm 32 tín chỉ (bao gồm thực tập sư phạm).`
      : `ĐỦ ĐIỀU KIỆN đăng ký chương trình bồi dưỡng nghiệp vụ sư phạm 32 tín chỉ theo Thông tư 91/2026/TT-BGDĐT (hiệu lực từ 08/12/2026).`;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Công cụ tra cứu & tính toán nhanh
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Tự động tính định mức tiết dạy theo TT 05/2025 và kiểm tra điều kiện học chứng chỉ NVSP theo TT 91/2026.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tool 1 */}
        <section className="rounded-2xl border border-[#383945] bg-[#2a2b34] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
                  <Calculator className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Tính định mức tiết dạy & kiêm nhiệm
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Thông tư 05/2025/TT-BGDĐT (Điều 7, 9, 10, 11)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenCircular("tt-05-2025")}
                className="shrink-0 text-xs font-medium text-sky-300 hover:underline cursor-pointer"
              >
                Xem TT 05
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                1. Chọn cấp học / loại hình trường
              </label>
              <select
                value={levelId}
                onChange={(e) => setLevelId(e.target.value)}
                className="w-full rounded-xl border border-[#3e404e] bg-[#1e1f27] px-3 py-2.5 text-xs text-zinc-100 focus:border-zinc-400 focus:outline-none"
              >
                {SCHOOL_LEVELS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label} — Chuẩn {l.quota} tiết/tuần
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  2. Chọn nhiệm vụ kiêm nhiệm (tối đa 02)
                </label>
                <span className="text-xs font-semibold text-amber-300">
                  {selectedRoles.length}/2
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
                {CONCURRENT_ROLES.map((role) => {
                  const checked = selectedRoles.includes(role.id);
                  const disabled = !checked && selectedRoles.length >= 2;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleRole(role.id)}
                      className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition ${
                        checked
                          ? "border-white/60 bg-white/10 text-white"
                          : disabled
                            ? "border-[#2f303c] bg-[#23242d] text-zinc-600 cursor-not-allowed"
                            : "border-[#383945] bg-[#1e1f27] text-zinc-300 hover:border-zinc-500 cursor-pointer"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-medium">{role.label}</p>
                        <p className="text-[10px] text-zinc-400">{role.note}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          checked
                            ? "bg-white text-black"
                            : "bg-[#2a2b34] text-zinc-400"
                        }`}
                      >
                        -{role.reduce}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#181920] border border-[#343542] p-3.5 space-y-2.5">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-[#24252f] p-2">
                <span className="block text-[10px] text-zinc-400">Định mức gốc</span>
                <span className="text-base font-bold text-white">{selectedLevel.quota} tiết</span>
              </div>
              <div className="rounded-lg bg-[#24252f] p-2">
                <span className="block text-[10px] text-zinc-400">Được giảm</span>
                <span className="text-base font-bold text-amber-300">-{totalReduce} tiết</span>
              </div>
              <div className="rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/40 p-2">
                <span className="block text-[10px] text-emerald-300">Thực dạy/tuần</span>
                <span className="text-base font-bold text-white">{effectiveWeekly} tiết</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-[11px] text-zinc-400 leading-relaxed">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sky-400" />
              <span>
                Cả năm: <strong className="text-zinc-200">{selectedLevel.yearly} tiết</strong>.
                Trần dạy vượt định mức: tối đa{" "}
                <strong className="text-zinc-200">{maxOvertimeWeekly} tiết/tuần</strong> (50%).
              </span>
            </div>
          </div>
        </section>

        {/* Tool 2 */}
        <section className="rounded-2xl border border-[#383945] bg-[#2a2b34] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-black">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Kiểm tra điều kiện học Chứng chỉ NVSP
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Thông tư 91/2026/TT-BGDĐT (hiệu lực 08/12/2026)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenCircular("tt-91-2026")}
                className="shrink-0 text-xs font-medium text-sky-300 hover:underline cursor-pointer"
              >
                Xem TT 91
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                1. Trình độ đào tạo hiện tại (ngành phù hợp môn dạy)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  { id: "bachelor-studying", label: "Đang học Đại học" },
                  { id: "bachelor-done", label: "Đã có bằng Cử nhân ĐH" },
                  { id: "college-studying", label: "Đang học Cao đẳng" },
                  { id: "college-done", label: "Đã có bằng Cao đẳng" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setEduStatus(
                        opt.id as
                          | "bachelor-done"
                          | "bachelor-studying"
                          | "college-done"
                          | "college-studying"
                      )
                    }
                    className={`rounded-xl border px-3 py-2 text-left text-xs transition cursor-pointer ${
                      eduStatus === opt.id
                        ? "border-white/60 bg-white/10 text-white font-semibold"
                        : "border-[#383945] bg-[#1e1f27] text-zinc-300 hover:border-zinc-500"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {isStudying && (
              <div className="rounded-xl border border-[#383945] bg-[#1e1f27] p-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-zinc-300">2. Tỷ lệ tín chỉ đã tích lũy</span>
                  <span
                    className={`font-bold ${
                      creditPercent >= 70 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {creditPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={creditPercent}
                  onChange={(e) => setCreditPercent(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                  <span>10%</span>
                  <span className="text-amber-300">Mốc tối thiểu: 70%</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                {isStudying ? "3." : "2."} Nhóm môn dự kiến giảng dạy
              </label>
              <select
                value={subjectGroup}
                onChange={(e) =>
                  setSubjectGroup(
                    e.target.value as "general" | "special-4" | "pe-primary"
                  )
                }
                className="w-full rounded-xl border border-[#3e404e] bg-[#1e1f27] px-3 py-2.5 text-xs text-zinc-100 focus:border-zinc-400 focus:outline-none"
              >
                <option value="general">
                  Các môn phổ thông chung (Toán, Văn, Anh, Lý, Hóa, Sinh...)
                </option>
                <option value="special-4">
                  4 môn đặc thù: Mỹ thuật, Âm nhạc, Tin học, Công nghệ
                </option>
                <option value="pe-primary">
                  Môn Giáo dục thể chất cấp Tiểu học
                </option>
              </select>
            </div>
          </div>

          <div
            className={`rounded-xl border p-3.5 space-y-2 ${
              nvspEligible
                ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-100"
                : "border-rose-500/35 bg-rose-500/10 text-rose-100"
            }`}
          >
            <div className="flex items-center gap-2">
              {nvspEligible ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
              )}
              <span className="text-xs font-bold text-white">
                {nvspEligible
                  ? "Đủ điều kiện đăng ký học NVSP (32 tín chỉ)"
                  : "Chưa đủ điều kiện theo quy định"}
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">{nvspReason}</p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] opacity-75">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Hiệu lực thi hành TT 91/2026: từ ngày 08/12/2026.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

# EduLaw VN — Nền tảng Hỏi đáp & Tra cứu Thông tư Bộ Giáo dục và Đào tạo

Nền tảng tra cứu và hỏi đáp pháp lý giáo dục Việt Nam dựa trên các Thông tư mới nhất của Bộ Giáo dục và Đào tạo (cập nhật đến tháng 11/2026), thiết kế tối ưu cho **giáo viên đang công tác** và **người có nguyện vọng trở thành giáo viên**.

## Tech Stack
- **Next.js 15 (App Router) + React 19 + TypeScript**
- **Tailwind CSS v4** + **Lucide React Icons** + Font **Be Vietnam Pro** (tối ưu dấu tiếng Việt)
- **Hybrid RAG Engine (`src/lib/rag-engine.ts`)**:
  - Tìm kiếm tiếng Việt có dấu & không dấu, mở rộng từ đồng nghĩa chuyên ngành (`NVSP`, `GVCN`, `CDNN`, `HSG`...), ưu tiên ngữ cảnh theo đối tượng người dùng (`Giáo viên` / `Người muốn làm giáo viên`).
  - Hoạt động ngay lập tức không cần API Key.
  - Tự động nâng cấp sang **Gemini 2.5 Flash RAG** khi cấu hình `GEMINI_API_KEY` trong `.env.local`.

## Danh mục Thông tư cốt lõi đã tích hợp (2024–2026)
1. **Thông tư 93/2026/TT-BGDĐT** (30/10/2026): Sửa đổi chuẩn nghề nghiệp, bổ nhiệm chức danh và xếp lương nhà giáo.
2. **Thông tư 91/2026/TT-BGDĐT** (hiệu lực 08/12/2026, thay thế TT 11/2021 & TT 12/2021): Chương trình bồi dưỡng nghiệp vụ sư phạm 32 tín chỉ, mở rộng cho sinh viên tích lũy ≥ 70% tín chỉ.
3. **Thông tư 89/2026/TT-BGDĐT** (hiệu lực 01/12/2026): Sửa đổi TT 27/2020 & TT 22/2021 về đánh giá học sinh, pháp lý hóa Học bạ số & ký số, đề kiểm tra chung Sở GD&ĐT, thi trên máy tính.
4. **Thông tư 30/2026/TT-BGDĐT** (thay thế TT 20/2018): Chuẩn nghề nghiệp giáo viên cơ sở giáo dục phổ thông.
5. **Thông tư 19/2026/TT-BGDĐT & Thông tư 29/2024/TT-BGDĐT (VBHN 04/VBHN-BGDĐT)**: Quy định dạy thêm, học thêm.
6. **Thông tư 18/2026/TT-BGDĐT**: Khung năng lực số đối với giáo viên và cán bộ quản lý.
7. **Thông tư 05/2025/TT-BGDĐT**: Chế độ làm việc của giáo viên phổ thông (định mức 23/19/17 tiết, giảm trừ kiêm nhiệm, giới hạn tối đa 2 nhiệm vụ và vượt định mức 50%).
8. **Thông tư 13/2024/TT-BGDĐT**: Tiêu chuẩn, điều kiện xét thăng hạng chức danh nghề nghiệp giáo viên.
9. **Chùm Thông tư 01–04/2021 & Thông tư 08/2023/TT-BGDĐT**: Mã số, tiêu chuẩn CDNN, chuẩn bằng cấp tuyển dụng.
10. **Luật Nhà giáo (hiệu lực 01/01/2026), Nghị định 182/2026/NĐ-CP & Nghị định 161/2026/NĐ-CP**: Lương xếp cao nhất, 9 mức phụ cấp ưu đãi nghề 20%–80%, lương cơ sở 2,53 triệu đồng/tháng.

## Chạy dự án
```bash
npm install
npm run dev
```
Mở trình duyệt tại `http://localhost:3000`.

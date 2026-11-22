# Hướng dẫn đóng góp cho EduLaw VN

Cảm ơn bạn đã quan tâm và muốn chung tay phát triển **EduLaw VN** — dự án mã nguồn mở phi lợi nhuận giúp giáo viên và người có nguyện vọng trở thành giáo viên tại Việt Nam tra cứu Thông tư Bộ Giáo dục và Đào tạo nhanh chóng, chính xác.

Mọi đóng góp từ **lập trình viên**, **giáo viên**, **sinh viên sư phạm** đến **chuyên viên pháp lý giáo dục** đều được trân trọng!

---

## 1. Các cách bạn có thể đóng góp

### A. Dành cho Giáo viên / Sinh viên / Người không chuyên lập trình
- **Báo cáo văn bản hết hiệu lực hoặc mới ban hành:** Mở một [GitHub Issue](https://github.com/datnpq/edulaw-vn/issues) kèm số hiệu Thông tư (VD: `.../2026/TT-BGDĐT`) và link nguồn chính thức (`moet.gov.vn`, `chinhphu.vn`).
- **Đề xuất câu hỏi thường gặp (FAQ):** Gửi các tình huống thực tế giáo viên hay vướng mắc (kiêm nhiệm, nghỉ hè, dạy thêm, học bạ số, xét thăng hạng, tuyển dụng viên chức...).
- **Góp ý tính năng:** Đề xuất công cụ tính toán mới (ví dụ: tính lương & phụ cấp ưu đãi nghề theo NĐ 182/2026, tính điểm xét thăng hạng...).

### B. Dành cho Lập trình viên (Developers)
- Bổ sung / cập nhật dữ liệu Thông tư trong `src/data/circulars.ts`.
- Cải thiện chất lượng tìm kiếm tiếng Việt (`src/lib/rag-engine.ts`) hoặc tích hợp thêm nhà cung cấp LLM / vector database.
- Xây dựng tính năng mới: upload PDF Thông tư, xuất file trích dẫn, PWA cho di động, kiểm thử tự động...
- Sửa lỗi giao diện, tối ưu hiệu năng và khả năng truy cập (a11y).

---

## 2. Quy trình gửi Pull Request (PR)

1. **Fork** repository này về tài khoản GitHub của bạn.
2. **Clone** về máy và cài đặt thư viện:
   ```bash
   git clone https://github.com/<your-username>/edulaw-vn.git
   cd edulaw-vn
   npm install
   npm run dev
   ```
3. Tạo nhánh mới mô tả rõ công việc:
   ```bash
   git checkout -b feat/bo-sung-thong-tu-moi
   # hoặc: fix/sua-dinh-muc-tiet-day
   ```
4. Thực hiện chỉnh sửa và đảm bảo build không có lỗi TypeScript/lint:
   ```bash
   npm run build
   ```
5. Commit rõ ràng theo chuẩn Conventional Commits (`feat:`, `fix:`, `docs:`, `data:`) và đẩy lên fork của bạn:
   ```bash
   git push origin feat/bo-sung-thong-tu-moi
   ```
6. Mở **Pull Request** về nhánh `main` của `datnpq/edulaw-vn` kèm mô tả ngắn gọn thay đổi và link văn bản gốc (nếu cập nhật dữ liệu pháp lý).

---

## 3. Quy chuẩn khi cập nhật dữ liệu Thông tư (`src/data/circulars.ts`)

- Luôn đối chiếu trực tiếp từ nguồn chính thống (`moet.gov.vn`, `chinhphu.vn`, Công báo).
- Ghi rõ `code` (số hiệu), `issuedDate` (ngày ban hành), `effectiveDate` (ngày hiệu lực), `status` (`active` | `upcoming` | `consolidated`) và `replacesOrAmends` nếu văn bản thay thế/sửa đổi Thông tư cũ.
- Nội dung tóm tắt rõ ràng, khách quan, dễ hiểu cho giáo viên tra cứu nhanh.

---

Cảm ơn bạn đã góp phần xây dựng một công cụ hữu ích cho cộng đồng giáo dục Việt Nam!

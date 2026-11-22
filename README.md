# EduLaw VN — Nền tảng Hỏi đáp & Tra cứu Thông tư Bộ GD&ĐT (Open Source)

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

**EduLaw VN** là dự án **mã nguồn mở phi lợi nhuận vì cộng đồng**, giúp **giáo viên đang công tác** và **người có nguyện vọng trở thành giáo viên** (sinh viên sư phạm, cử nhân học nghiệp vụ sư phạm, ứng viên thi tuyển viên chức) tra cứu và hỏi đáp nhanh các Thông tư mới nhất của Bộ Giáo dục và Đào tạo Việt Nam.

> Dự án hoàn toàn miễn phí, công khai mã nguồn theo giấy phép **MIT**, chào đón mọi lập trình viên, giáo viên và chuyên gia giáo dục cùng đóng góp phát triển!

---

## Tính năng nổi bật

- **Giao diện hội thoại tối giản dạng ChatGPT / Open WebUI:** Hỗ trợ dark mode dịu mắt, lịch sử nhiều cuộc trò chuyện lưu cục bộ (`localStorage`), tìm kiếm nhanh và ngăn trượt xem chi tiết Thông tư ngay trên nền chat.
- **Đa nền tảng LLM thực tế & Real-time Streaming:**
  - **Ollama Local (miễn phí, chạy trực tiếp trên máy cá nhân):** Hỗ trợ mặc định `qwen2.5:3b` (nhanh, 100% tiếng Việt) và nút bật/tắt 1 chạm sang `qwen3:4b` (suy luận sâu).
  - **Google Gemini (`gemini-2.5-flash` / `gemini-2.5-pro`):** Hỗ trợ **Tư duy pháp lý (Thinking/Reasoning)** + **Tìm kiếm web trực tiếp (Google Search Grounding)** để tự tra cứu Thông tư mới nhất không phụ thuộc kho dữ liệu tĩnh.
  - **OpenAI-Compatible:** Tương thích OpenAI, DeepSeek (`deepseek-reasoner`), OpenRouter...
- **Cá nhân hóa theo đối tượng người dùng:** Chuyển đổi nhanh giữa `Tất cả`, `Giáo viên đang công tác` và `Người muốn làm giáo viên`.
- **Kho Thông tư cập nhật (2024–2026):** Lọc theo chủ đề, trạng thái hiệu lực (`Đang có hiệu lực`, `Sắp có hiệu lực`, `Hợp nhất / Sửa đổi`), sao chép trích dẫn chuẩn và hỏi tiếp AI ngay trên từng điều khoản.
- **Công cụ tra cứu & tính toán nhanh:**
  1. **Tính định mức tiết dạy & giảm trừ kiêm nhiệm** (theo **Thông tư 05/2025/TT-BGDĐT** — kiểm soát giới hạn tối đa 2 nhiệm vụ kiêm nhiệm & trần vượt định mức 50%).
  2. **Kiểm tra điều kiện học Chứng chỉ Nghiệp vụ Sư phạm** (theo **Thông tư 91/2026/TT-BGDĐT** — mốc tích lũy 70% tín chỉ, chương trình 32 tín chỉ, hiệu lực 08/12/2026).

---

## Kho Thông tư cốt lõi đã tích hợp (2024–2026)

| Văn bản | Trạng thái | Trọng tâm |
| :--- | :--- | :--- |
| **TT 91/2026/TT-BGDĐT** | Sắp có hiệu lực (08/12/2026) | Bồi dưỡng NVSP 32 tín chỉ, mở rộng cho sinh viên tích lũy ≥ 70% tín chỉ (thay thế TT 11/2021 & TT 12/2021). |
| **TT 89/2026/TT-BGDĐT** | Sắp có hiệu lực (01/12/2026) | Sửa đổi TT 27/2020 & TT 22/2021: pháp lý hóa Học bạ số, quy trình ký số, đề kiểm tra chung, thi trên máy tính. |
| **TT 93/2026/TT-BGDĐT** | Sắp có hiệu lực (15/12/2026) | Sửa đổi chuẩn nghề nghiệp, tháo gỡ bổ nhiệm lại hạng & xếp lương nhà giáo. |
| **TT 30/2026/TT-BGDĐT** | Đang có hiệu lực | Chuẩn nghề nghiệp giáo viên cơ sở giáo dục phổ thông mới (thay thế TT 20/2018). |
| **TT 19/2026 & TT 29/2024** *(VBHN 04)* | Hợp nhất / Sửa đổi | Quy định dạy thêm, học thêm trong và ngoài nhà trường; phân định hoạt động STEM, kỹ năng sống. |
| **TT 18/2026/TT-BGDĐT** | Đang có hiệu lực | Khung năng lực số đối với giáo viên và cán bộ quản lý. |
| **TT 05/2025/TT-BGDĐT** | Đang có hiệu lực | Chế độ làm việc của giáo viên phổ thông (định mức 23/19/17 tiết, giảm trừ kiêm nhiệm). |
| **TT 13/2024/TT-BGDĐT** | Đang có hiệu lực | Tiêu chuẩn, điều kiện xét thăng hạng chức danh nghề nghiệp giáo viên. |
| **TT 01–04/2021 & TT 08/2023** | Hợp nhất / Sửa đổi | Mã số, tiêu chuẩn CDNN, chuẩn bằng cấp tuyển dụng viên chức giáo dục. |
| **Luật Nhà giáo & NĐ 182/2026, NĐ 161/2026** | Đang có hiệu lực | Lương xếp cao nhất thang bậc HCSN, 9 mức phụ cấp ưu đãi nghề 20%–80%, lương cơ sở 2,53 triệu đồng. |

---

## Cài đặt & Chạy trên máy cá nhân

### Yêu cầu
- **Node.js** `>= 18` (khuyên dùng Node 20+ / 24+)
- Một trong các nguồn LLM:
  - **Chạy Local miễn phí:** [Ollama](https://ollama.com) + model `qwen2.5:3b` (nhanh, 100% tiếng Việt) hoặc `qwen3:4b` (suy luận sâu).
  - **Chạy Cloud (nhanh & có tìm kiếm web):** API Key miễn phí từ [Google AI Studio (Gemini)](https://aistudio.google.com/apikey).

### Bước 1: Clone & cài đặt
```bash
git clone https://github.com/datnpq/edulaw-vn.git
cd edulaw-vn
npm install
```

### Bước 2: Cấu hình LLM (chọn 1 trong 2 cách)
- **Cách A — Chạy Local với Ollama (miễn phí, riêng tư):**
  ```bash
  ollama serve
  ollama pull qwen2.5:3b
  # (Tùy chọn) tải thêm model suy luận sâu:
  ollama pull qwen3:4b
  ```
- **Cách B — Dùng Gemini API / OpenAI:**
  Sao chép `.env.example` thành `.env.local` và điền `GEMINI_API_KEY` (hoặc nhập trực tiếp trong nút **⚙ Cài đặt LLM** trên giao diện web):
  ```bash
  cp .env.example .env.local
  ```

### Bước 3: Khởi chạy ứng dụng
```bash
npm run dev
```
Mở trình duyệt tại **`http://localhost:3000`**.

---

## Lộ trình phát triển cùng cộng đồng (Roadmap)

- [ ] Tự động thu thập & cập nhật Thông tư mới từ Cổng thông tin Bộ GD&ĐT (`moet.gov.vn`).
- [ ] Upload file PDF Thông tư / Công văn địa phương để AI đọc và hỏi đáp tức thì.
- [ ] Công cụ ước tính lương & phụ cấp ưu đãi nghề theo **Nghị định 182/2026/NĐ-CP** và **Luật Nhà giáo**.
- [ ] Bộ đề trắc nghiệm pháp luật giáo dục cho ứng viên ôn thi viên chức giáo dục.
- [ ] Hỗ trợ PWA cài đặt trên điện thoại cho giáo viên tra cứu nhanh.

---

## Đóng góp cho dự án (Contributing)

Đây là **dự án cộng đồng mở** — mọi đóng góp về code, cập nhật Thông tư mới, sửa lỗi hay góp ý trải nghiệm đều vô cùng quý giá!

Vui lòng xem hướng dẫn chi tiết tại **[CONTRIBUTING.md](./CONTRIBUTING.md)** hoặc mở ngay một [Issue](https://github.com/datnpq/edulaw-vn/issues) / [Pull Request](https://github.com/datnpq/edulaw-vn/pulls).

---

## Ủng hộ dự án (Donate / Sponsor)

**EduLaw VN** được phát triển và duy trì hoàn toàn miễn phí cho cộng đồng giáo viên và sinh viên sư phạm Việt Nam. Nếu dự án giúp ích cho công việc giảng dạy hoặc học tập của bạn, bạn có thể ủng hộ một ly cà phê để duy trì máy chủ, tên miền và chi phí API AI cộng đồng:

- **GitHub Sponsors:** [github.com/sponsors/datnpq](https://github.com/sponsors/datnpq)
- **Chuyển khoản ngân hàng / VietQR / MoMo:** *(Chủ dự án có thể cập nhật thông tin tài khoản hoặc ảnh mã VietQR tại đây)*
- **Cách ủng hộ miễn phí:** Bấm **Star ⭐** cho repository và chia sẻ EduLaw VN đến đồng nghiệp, bạn bè trong ngành giáo dục!

> Toàn bộ đóng góp được sử dụng minh bạch để duy trì hạ tầng hosting, tên miền và mở rộng kho dữ liệu pháp lý giáo dục mở.

---

## Miễn trừ trách nhiệm & Giấy phép

- **Lưu ý pháp lý:** Thông tin do AI tổng hợp mang tính hỗ trợ tra cứu nhanh. Với các quyết định hành chính, hồ sơ thi tuyển hoặc giải quyết chế độ, vui lòng đối chiếu văn bản công báo chính thức tại [moet.gov.vn](https://moet.gov.vn).
- **Giấy phép:** Phát hành theo giấy phép mã nguồn mở **[MIT License](./LICENSE)** — bạn được tự do sử dụng, chỉnh sửa, phân phối và đóng góp lại cho cộng đồng.

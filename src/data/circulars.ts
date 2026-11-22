import { CircularDocument, LegalCategory } from "@/types/legal";

export const CATEGORY_META: Record<
  LegalCategory,
  { label: string; shortLabel: string; description: string }
> = {
  "che-do-lam-viec": {
    label: "Chế độ làm việc & Định mức",
    shortLabel: "Chế độ làm việc",
    description: "Định mức tiết dạy, giảm trừ kiêm nhiệm, thời gian nghỉ hè, dạy vượt giờ.",
  },
  "day-them-hoc-them": {
    label: "Dạy thêm, học thêm",
    shortLabel: "Dạy thêm học thêm",
    description: "Quy định dạy thêm trong và ngoài nhà trường, đối tượng, thu phí và minh bạch.",
  },
  "chuan-nghe-nghiep-luong": {
    label: "Chuẩn nghề nghiệp, Lương & Thăng hạng",
    shortLabel: "Chuẩn & Lương",
    description: "Chuẩn nghề nghiệp mới, bổ nhiệm hạng CDNN, xét thăng hạng, Luật Nhà giáo & phụ cấp.",
  },
  "nghiep-vu-su-pham-tuyen-dung": {
    label: "Nghiệp vụ sư phạm & Tuyển dụng",
    shortLabel: "NVSP & Tuyển dụng",
    description: "Chứng chỉ nghiệp vụ sư phạm 32 tín chỉ, sinh viên tích lũy 70%, điều kiện thi tuyển viên chức.",
  },
  "danh-gia-hoc-sinh": {
    label: "Đánh giá học sinh & Học bạ số",
    shortLabel: "Đánh giá & Học bạ số",
    description: "Quy định đánh giá Tiểu học/THCS/THPT, pháp lý hóa học bạ số, ký số, kiểm tra trên máy tính.",
  },
  "nang-luc-so": {
    label: "Khung năng lực số nhà giáo",
    shortLabel: "Năng lực số",
    description: "Chuẩn năng lực ứng dụng CNTT, AI và chuyển đổi số cho giáo viên & cán bộ quản lý.",
  },
};

export const SUGGESTED_QUESTIONS: {
  question: string;
  persona: "teacher" | "aspiring";
  tag: string;
}[] = [
  {
    question: "Sinh viên năm cuối chưa tốt nghiệp đại học có được học chứng chỉ nghiệp vụ sư phạm không?",
    persona: "aspiring",
    tag: "TT 91/2026",
  },
  {
    question: "Giáo viên THCS kiêm chủ nhiệm lớp và tổ trưởng chuyên môn được giảm bao nhiêu tiết dạy/tuần?",
    persona: "teacher",
    tag: "TT 05/2025",
  },
  {
    question: "Dạy thêm trong nhà trường có được thu tiền không và dành cho những đối tượng học sinh nào?",
    persona: "teacher",
    tag: "TT 19/2026 & TT 29/2024",
  },
  {
    question: "Học bạ số và quy trình ký số của giáo viên bộ môn, giáo viên chủ nhiệm quy định thế nào?",
    persona: "teacher",
    tag: "TT 89/2026",
  },
  {
    question: "Điều kiện bằng cấp để tuyển dụng làm giáo viên Mầm non, Tiểu học, THCS, THPT là gì?",
    persona: "aspiring",
    tag: "Luật GD & TT 93/2026",
  },
  {
    question: "Phụ cấp ưu đãi nghề giáo viên năm 2026 có bao nhiêu mức và lương cơ sở mới là bao nhiêu?",
    persona: "teacher",
    tag: "NĐ 182/2026 & Luật Nhà giáo",
  },
  {
    question: "Các hoạt động STEM, kỹ năng sống, tăng cường ngoại ngữ có bị coi là dạy thêm không?",
    persona: "teacher",
    tag: "TT 19/2026",
  },
  {
    question: "Khi bổ nhiệm chức danh nghề nghiệp hạng mới có bắt buộc có chứng chỉ bồi dưỡng ngay không?",
    persona: "teacher",
    tag: "TT 08/2023 & TT 93/2026",
  },
];

export const CIRCULARS: CircularDocument[] = [
  {
    id: "tt-91-2026",
    code: "91/2026/TT-BGDĐT",
    shortTitle: "Bồi dưỡng nghiệp vụ sư phạm phổ thông (mở rộng cho sinh viên)",
    fullTitle:
      "Thông tư số 91/2026/TT-BGDĐT ban hành Chương trình và thực hiện bồi dưỡng nghiệp vụ sư phạm cho người có nguyện vọng trở thành giáo viên phổ thông",
    issuingBody: "Bộ Giáo dục và Đào tạo",
    issuedDate: "23/10/2026",
    effectiveDate: "08/12/2026",
    status: "upcoming",
    category: "nghiep-vu-su-pham-tuyen-dung",
    audience: ["aspiring", "teacher"],
    replacesOrAmends: "Thay thế Thông tư 11/2021/TT-BGDĐT và Thông tư 12/2021/TT-BGDĐT",
    summary:
      "Bước ngoặt lớn cho người có nguyện vọng làm giáo viên: cho phép sinh viên đại học/cao đẳng ngành phù hợp đã tích lũy tối thiểu 70% tín chỉ được học song song chương trình bồi dưỡng nghiệp vụ sư phạm (32 tín chỉ) mà không phải chờ có bằng tốt nghiệp.",
    highlights: [
      "Sinh viên chưa tốt nghiệp đã tích lũy tối thiểu 70% khối lượng chương trình đào tạo ngành phù hợp được đăng ký học NVSP.",
      "Chương trình bồi dưỡng thống nhất có khối lượng 32 tín chỉ (kiến thức chung, nghiệp vụ bộ môn và thực hành/thực tập sư phạm).",
      "Mở rộng đối tượng trình độ cao đẳng (hoặc tích lũy ≥ 70% cao đẳng) cho các môn đặc thù: Mỹ thuật, Âm nhạc, Tin học và Công nghệ.",
      "Thay thế hoàn toàn Thông tư 11/2021/TT-BGDĐT (Tiểu học) và Thông tư 12/2021/TT-BGDĐT (THCS, THPT) từ ngày 08/12/2026.",
    ],
    practicalNote:
      "Sinh viên năm 3–4 các ngành ngoài sư phạm (Ngôn ngữ Anh, Công nghệ thông tin, Toán ứng dụng, Vật lý, Mỹ thuật, Âm nhạc...) nên chuẩn bị bảng điểm tích lũy ≥ 70% để đăng ký học ngay từ mốc hiệu lực 08/12/2026, rút ngắn 1 năm chờ đợi so với trước đây.",
    sourceUrl: "https://moet.gov.vn",
    articles: [
      {
        id: "tt-91-2026-d1",
        articleNumber: "Điều 2 & Điều 3",
        title: "Đối tượng học chứng chỉ nghiệp vụ sư phạm (mở rộng cho sinh viên)",
        content:
          "Người có bằng cử nhân chuyên ngành phù hợp hoặc sinh viên đang học chương trình đào tạo trình độ đại học ngành phù hợp với môn học/cấp học dự kiến giảng dạy đã tích lũy tối thiểu 70% tổng khối lượng học tập của chương trình đào tạo được phép đăng ký tham gia chương trình bồi dưỡng nghiệp vụ sư phạm.",
        keyPoints: [
          "Không còn bắt buộc phải chờ nhận bằng cử nhân mới được nộp hồ sơ học NVSP như TT 11/2021 và TT 12/2021.",
          "Ngưỡng điều kiện cho sinh viên đang theo học: tích lũy tối thiểu 70% tổng số tín chỉ toàn khóa.",
          "Chứng chỉ NVSP là điều kiện đi kèm bằng tốt nghiệp ngành phù hợp khi dự tuyển viên chức giáo dục.",
        ],
        keywords: [
          "chứng chỉ nghiệp vụ sư phạm",
          "nvsp",
          "sinh viên chưa tốt nghiệp",
          "70% tín chỉ",
          "ngoài sư phạm",
          "muốn làm giáo viên",
          "91/2026",
          "11/2021",
          "12/2021",
        ],
        audience: ["aspiring"],
      },
      {
        id: "tt-91-2026-d2",
        articleNumber: "Điều 4",
        title: "Đối tượng đặc thù cấp Cao đẳng cho môn Mỹ thuật, Âm nhạc, Tin học, Công nghệ",
        content:
          "Người có bằng cao đẳng trở lên hoặc sinh viên đã tích lũy tối thiểu 70% chương trình đào tạo cao đẳng/đại học ngành phù hợp được tham gia bồi dưỡng nghiệp vụ sư phạm để giảng dạy các môn đặc thù gồm Mỹ thuật, Âm nhạc, Tin học và Công nghệ. Riêng môn Giáo dục thể chất cấp Tiểu học áp dụng đối với cử nhân hoặc sinh viên đại học tích lũy đủ 70% ngành phù hợp.",
        keyPoints: [
          "Cao đẳng ngành phù hợp (hoặc sinh viên cao đẳng tích lũy ≥ 70%) được học NVSP cho 4 môn đặc thù: Mỹ thuật, Âm nhạc, Tin học, Công nghệ.",
          "Môn Giáo dục thể chất Tiểu học yêu cầu trình độ đại học hoặc sinh viên ĐH tích lũy ≥ 70%.",
        ],
        keywords: [
          "cao đẳng",
          "mỹ thuật",
          "âm nhạc",
          "tin học",
          "công nghệ",
          "giáo dục thể chất",
          "môn đặc thù",
          "tiểu học",
        ],
        audience: ["aspiring"],
      },
      {
        id: "tt-91-2026-d3",
        articleNumber: "Điều 5 & Điều 6",
        title: "Thời lượng 32 tín chỉ và cấu trúc chương trình bồi dưỡng",
        content:
          "Chương trình bồi dưỡng nghiệp vụ sư phạm phổ thông có tổng khối lượng 32 tín chỉ, bao gồm: khối kiến thức nghiệp vụ sư phạm chung (tâm lý học, giáo dục học, quản lý nhà nước về giáo dục), khối kiến thức phương pháp dạy học bộ môn/cấp học, và học phần thực hành, thực tập sư phạm tại cơ sở giáo dục phổ thông.",
        keyPoints: [
          "Tổng thời lượng: 32 tín chỉ.",
          "Bắt buộc có học phần thực hành và thực tập sư phạm tại trường phổ thông.",
          "Hiệu lực thi hành từ ngày 08/12/2026.",
        ],
        keywords: [
          "32 tín chỉ",
          "chương trình bồi dưỡng",
          "thực tập sư phạm",
          "thời lượng học nvsp",
          "hiệu lực 08/12/2026",
        ],
        audience: ["aspiring", "teacher"],
      },
    ],
  },
  {
    id: "tt-05-2025",
    code: "05/2025/TT-BGDĐT",
    shortTitle: "Chế độ làm việc của giáo viên phổ thông, dự bị đại học",
    fullTitle:
      "Thông tư số 05/2025/TT-BGDĐT quy định chế độ làm việc đối với giáo viên phổ thông, dự bị đại học",
    issuingBody: "Bộ Giáo dục và Đào tạo",
    issuedDate: "07/03/2025",
    effectiveDate: "22/04/2025",
    status: "active",
    category: "che-do-lam-viec",
    audience: ["teacher", "aspiring"],
    replacesOrAmends: "Thay thế Thông tư 28/2009/TT-BGDĐT và Thông tư 15/2017/TT-BGDĐT",
    summary:
      "Quy định toàn diện về quỹ thời gian làm việc 40 giờ/tuần, định mức tiết dạy chuẩn (Tiểu học 23, THCS 19, THPT 17), chế độ giảm định mức tiết dạy kiêm nhiệm (tối đa 2 nhiệm vụ), quy đổi hoạt động chuyên môn và giới hạn dạy vượt định mức.",
    highlights: [
      "Định mức tiết dạy phổ thông: Tiểu học 23 tiết/tuần, THCS 19 tiết/tuần, THPT 17 tiết/tuần.",
      "Giáo viên chủ nhiệm lớp phổ thông được giảm 04 tiết/tuần; Tổ trưởng chuyên môn giảm 03 tiết/tuần; Tổ phó giảm 01 tiết/tuần.",
      "Mỗi giáo viên không kiêm nhiệm quá 02 nhiệm vụ thuộc các Điều 9, 10, 11.",
      "Giới hạn dạy vượt định mức: không quá 50% định mức trung bình/tuần và không vượt tổng giờ làm thêm năm theo Bộ luật Lao động.",
    ],
    practicalNote:
      "Riêng Tổ trưởng/Tổ phó chuyên môn vẫn được hưởng đồng thời cả phụ cấp chức vụ/trách nhiệm và chế độ giảm định mức tiết dạy. Hiệu trưởng (2 tiết/tuần) và Phó hiệu trưởng (4 tiết/tuần) không được dùng tiết quy đổi kiêm nhiệm để thay thế số tiết dạy bắt buộc này.",
    sourceUrl: "https://moet.gov.vn",
    articles: [
      {
        id: "tt-05-2025-d7",
        articleNumber: "Điều 7 & Điều 8",
        title: "Định mức tiết dạy chuẩn của giáo viên và cán bộ quản lý",
        content:
          "Định mức tiết dạy bình quân 01 tuần: Giáo viên Tiểu học 23 tiết/tuần (805 tiết/năm học); Giáo viên THCS 19 tiết/tuần (665 tiết/năm học); Giáo viên THPT 17 tiết/tuần (595 tiết/năm học). Trường PTDT bán trú/nội trú: Tiểu học bán trú 21 tiết, THCS bán trú/nội trú 17 tiết, THPT nội trú 15 tiết. Cán bộ quản lý (Điều 8): Hiệu trưởng 02 tiết/tuần, Phó hiệu trưởng 04 tiết/tuần.",
        keyPoints: [
          "Tiểu học: 23 tiết/tuần (805 tiết/năm); THCS: 19 tiết/tuần (665 tiết/năm); THPT: 17 tiết/tuần (595 tiết/năm).",
          "Trường bán trú/nội trú: Tiểu học 21 tiết; THCS 17 tiết; THPT 15 tiết.",
          "Hiệu trưởng: 2 tiết/tuần; Phó hiệu trưởng: 4 tiết/tuần (không được quy đổi kiêm nhiệm thay thế).",
        ],
        keywords: [
          "định mức tiết dạy",
          "23 tiết",
          "19 tiết",
          "17 tiết",
          "tiểu học",
          "thcs",
          "thpt",
          "hiệu trưởng",
          "phó hiệu trưởng",
          "05/2025",
          "40 giờ",
        ],
        audience: ["teacher", "aspiring"],
      },
      {
        id: "tt-05-2025-d9",
        articleNumber: "Điều 9",
        title: "Giảm định mức tiết dạy khi kiêm nhiệm công tác chuyên môn",
        content:
          "Giáo viên chủ nhiệm lớp ở trường phổ thông được giảm 04 tiết/tuần (trường dự bị đại học giảm 03 tiết/tuần). Tổ trưởng chuyên môn (hoặc tổ trưởng quản lý học sinh trường DTNT/BT) được giảm 03 tiết/tuần; Tổ phó giảm 01 tiết/tuần. Giáo viên kiêm phụ trách phòng học bộ môn (trừ phòng tin học) khi không có nhân viên thiết bị riêng được giảm 03 tiết/môn/tuần; phụ trách phòng thiết bị giáo dục giảm 03 tiết/tuần.",
        keyPoints: [
          "Chủ nhiệm lớp phổ thông: giảm 04 tiết/tuần.",
          "Tổ trưởng chuyên môn: giảm 03 tiết/tuần; Tổ phó: giảm 01 tiết/tuần.",
          "Phụ trách phòng học bộ môn / phòng thiết bị giáo dục: giảm 03 tiết/tuần.",
          "Tổ trưởng/Tổ phó chuyên môn được hưởng đồng thời phụ cấp chức vụ và giảm tiết dạy.",
        ],
        keywords: [
          "giảm định mức",
          "kiêm nhiệm",
          "chủ nhiệm lớp",
          "4 tiết",
          "tổ trưởng chuyên môn",
          "tổ phó",
          "phòng bộ môn",
          "thiết bị giáo dục",
        ],
        audience: ["teacher"],
      },
      {
        id: "tt-05-2025-d10",
        articleNumber: "Điều 10 & Điều 11",
        title: "Giảm tiết công tác Đảng, đoàn thể, Hội đồng trường và giới hạn kiêm nhiệm",
        content:
          "Bí thư Đảng bộ/Chi bộ trường từ 28 lớp trở lên (vùng 2, 3) hoặc từ 19 lớp trở lên (vùng 1) giảm 04 tiết/tuần; trường còn lại giảm 03 tiết/tuần. Chủ tịch hoặc Thư ký Hội đồng trường giảm 02 tiết/tuần. Trưởng Ban thanh tra nhân dân giảm 02 tiết/tuần. Mỗi giáo viên không được kiêm nhiệm quá 02 nhiệm vụ thuộc các Điều 9, 10, 11. Nếu thiếu giáo viên phải dạy vượt định mức thì số tiết vượt không quá 50% định mức trung bình/tuần.",
        keyPoints: [
          "Bí thư Chi bộ/Đảng bộ: giảm 03 hoặc 04 tiết/tuần tùy quy mô lớp.",
          "Chủ tịch/Thư ký Hội đồng trường, Trưởng Ban TTND: giảm 02 tiết/tuần.",
          "Tối đa chỉ được kiêm nhiệm 02 nhiệm vụ hưởng giảm tiết.",
          "Dạy vượt định mức tối đa không quá 50% định mức tuần và tuân thủ trần giờ làm thêm Bộ luật Lao động.",
        ],
        keywords: [
          "bí thư chi bộ",
          "hội đồng trường",
          "thanh tra nhân dân",
          "quá 2 nhiệm vụ",
          "tối đa 2 kiêm nhiệm",
          "vượt định mức",
          "50%",
          "nghỉ hè",
        ],
        audience: ["teacher"],
      },
    ],
  },
  {
    id: "tt-19-2026-day-them",
    code: "19/2026/TT-BGDĐT & 29/2024/TT-BGDĐT",
    shortTitle: "Quy định về dạy thêm, học thêm (VBHN 04/VBHN-BGDĐT)",
    fullTitle:
      "Thông tư số 29/2024/TT-BGDĐT sửa đổi, bổ sung bởi Thông tư số 19/2026/TT-BGDĐT (hợp nhất tại VBHN 04/VBHN-BGDĐT) quy định về dạy thêm, học thêm",
    issuingBody: "Bộ Giáo dục và Đào tạo",
    issuedDate: "30/03/2026",
    effectiveDate: "15/05/2026",
    status: "consolidated",
    category: "day-them-hoc-them",
    audience: ["teacher", "aspiring"],
    replacesOrAmends: "Sửa đổi, bổ sung TT 29/2024/TT-BGDĐT; hợp nhất tại VBHN 04/VBHN-BGDĐT",
    summary:
      "Thiết lập hành lang pháp lý minh bạch cho hoạt động dạy thêm, học thêm: không thu tiền dạy thêm trong nhà trường, phân định rạch ròi giữa dạy thêm với hoạt động giáo dục tăng cường (STEM, ngoại ngữ, kỹ năng sống, AI), và yêu cầu minh bạch khi dạy thêm ngoài nhà trường.",
    highlights: [
      "Dạy thêm trong nhà trường KHÔNG được thu tiền của học sinh và chỉ dành cho 3 nhóm đối tượng cụ thể.",
      "Mỗi lớp dạy thêm trong trường tối đa 45 học sinh, không xếp xen kẽ thời khóa biểu chính khóa, không dạy trước chương trình.",
      "Hoạt động văn hóa, nghệ thuật, thể thao, STEM/STEAM, năng lực số, AI, kỹ năng sống, tăng cường ngoại ngữ KHÔNG bị coi là dạy thêm.",
      "Không cấm dạy thêm ngoài nhà trường chính đáng nhưng phải minh bạch địa điểm, thời gian, nội dung và tránh xung đột lợi ích.",
    ],
    practicalNote:
      "Cơ quan quản lý giáo dục đã thiết lập đường dây nóng tiếp nhận phản ánh hành vi ép buộc học sinh học thêm. Giáo viên cần báo cáo minh bạch khi tham gia giảng dạy tại cơ sở ngoài nhà trường để tuân thủ Luật Nhà giáo.",
    sourceUrl: "https://moet.gov.vn",
    articles: [
      {
        id: "tt-19-2026-d1",
        articleNumber: "Điều 2 & Điều 3",
        title: "Phân định dạy thêm và các hoạt động giáo dục bổ trợ/tăng cường",
        content:
          "Các hoạt động giáo dục phát triển toàn diện ngoài chương trình môn học bắt buộc của Bộ GD&ĐT như: văn hóa, nghệ thuật, thể thao; tăng cường năng lực ngoại ngữ; giáo dục STEM/STEAM, năng lực số, trí tuệ nhân tạo (AI); kỹ năng sống... không bị coi là dạy thêm, học thêm và không thuộc phạm vi cấm hay hạn chế của Thông tư này.",
        keyPoints: [
          "STEM/STEAM, năng lực số, AI, kỹ năng sống, thể thao, nghệ thuật không phải là dạy thêm.",
          "Tăng cường năng lực ngoại ngữ ngoài chương trình bắt buộc không bị điều chỉnh bởi quy định cấm dạy thêm.",
        ],
        keywords: [
          "stem",
          "steam",
          "kỹ năng sống",
          "ngoại ngữ tăng cường",
          "năng lực số",
          "ai",
          "phân định dạy thêm",
          "19/2026",
          "29/2024",
        ],
        audience: ["teacher", "aspiring"],
      },
      {
        id: "tt-19-2026-d5",
        articleNumber: "Điều 5",
        title: "Quy định dạy thêm trong nhà trường (Không thu tiền, 3 nhóm đối tượng)",
        content:
          "Dạy thêm, học thêm trong nhà trường không được thu tiền của học sinh và chỉ áp dụng cho 03 nhóm đối tượng: (1) Học sinh có kết quả học tập môn học cuối học kỳ liền kề ở mức chưa đạt; (2) Học sinh được nhà trường tuyển chọn để bồi dưỡng học sinh giỏi; (3) Học sinh lớp cuối cấp (lớp 9, lớp 12) tự nguyện đăng ký ôn thi tuyển sinh, thi tốt nghiệp theo kế hoạch giáo dục của nhà trường. Mỗi lớp không quá 45 học sinh, không xếp giờ dạy thêm xen kẽ thời khóa biểu chính khóa và không dạy trước phân phối chương trình.",
        keyPoints: [
          "Tuyệt đối không thu tiền học thêm trong nhà trường.",
          "Chỉ 3 nhóm: HS chưa đạt, HS bồi dưỡng HSG, HS cuối cấp (lớp 9, 12) tự nguyện ôn thi.",
          "Sĩ số tối đa 45 học sinh/lớp; không dạy trước chương trình.",
        ],
        keywords: [
          "dạy thêm trong trường",
          "thu tiền",
          "3 nhóm đối tượng",
          "học sinh chưa đạt",
          "bồi dưỡng học sinh giỏi",
          "ôn thi lớp 9",
          "ôn thi lớp 12",
          "45 học sinh",
        ],
        audience: ["teacher"],
      },
      {
        id: "tt-19-2026-d6",
        articleNumber: "Điều 6",
        title: "Dạy thêm ngoài nhà trường và nguyên tắc minh bạch",
        content:
          "Pháp luật không cấm hoạt động dạy thêm ngoài nhà trường chính đáng. Tuy nhiên, giáo viên công lập tham gia dạy thêm ngoài nhà trường phải bảo đảm minh bạch về nội dung, địa điểm, thời gian, tuân thủ quy tắc ứng xử, đạo đức nhà giáo và Luật Nhà giáo, nghiêm cấm hành vi ép buộc học sinh hoặc gây xung đột lợi ích với học sinh mình đang trực tiếp giảng dạy chính khóa.",
        keyPoints: [
          "Không cấm dạy thêm ngoài nhà trường nếu hợp pháp và minh bạch.",
          "Phải công khai/báo cáo địa điểm, thời gian, nội dung giảng dạy.",
          "Nghiêm cấm ép buộc học sinh học thêm dưới mọi hình thức.",
        ],
        keywords: [
          "dạy thêm ngoài nhà trường",
          "trung tâm dạy thêm",
          "xung đột lợi ích",
          "ép buộc học thêm",
          "báo cáo hiệu trưởng",
          "đạo đức nhà giáo",
        ],
        audience: ["teacher", "aspiring"],
      },
    ],
  },
  {
    id: "tt-89-2026",
    code: "89/2026/TT-BGDĐT",
    shortTitle: "Sửa đổi đánh giá học sinh & Pháp lý hóa Học bạ số",
    fullTitle:
      "Thông tư số 89/2026/TT-BGDĐT sửa đổi, bổ sung một số điều của Quy định đánh giá học sinh tiểu học (TT 27/2020) và học sinh THCS, THPT (TT 22/2021)",
    issuingBody: "Bộ Giáo dục và Đào tạo",
    issuedDate: "16/10/2026",
    effectiveDate: "01/12/2026",
    status: "upcoming",
    category: "danh-gia-hoc-sinh",
    audience: ["teacher", "aspiring"],
    replacesOrAmends: "Sửa đổi, bổ sung TT 27/2020/TT-BGDĐT và TT 22/2021/TT-BGDĐT",
    summary:
      "Chính thức pháp lý hóa Học bạ số là thành phần của hồ sơ đánh giá học sinh, chuẩn hóa quy trình ký số của giáo viên bộ môn và giáo viên chủ nhiệm, cho phép kiểm tra định kỳ trên máy tính và Sở GD&ĐT ra đề chung cuối kỳ.",
    highlights: [
      "Học bạ số là thành phần pháp lý chính thức của hồ sơ đánh giá học sinh từ ngày 01/12/2026.",
      "Quy trình ký số chặt chẽ: Giáo viên môn học ký số kết quả môn mình phụ trách trước, sau đó Giáo viên chủ nhiệm ký số xác nhận toàn bộ học bạ lớp.",
      "Sở GD&ĐT chủ trì xây dựng, cung cấp đề kiểm tra định kỳ cuối học kỳ I và II cho một số môn đánh giá bằng điểm số do Sở lựa chọn.",
      "Cho phép cơ sở giáo dục tổ chức kiểm tra định kỳ trên máy tính khi đủ điều kiện hạ tầng CNTT.",
    ],
    practicalNote:
      "Giáo viên cần chuẩn bị chữ ký số cá nhân (chữ ký số chuyên dùng hoặc công cộng theo hướng dẫn của trường/Sở) để thực hiện ký duyệt Học bạ số đúng quy trình từ tháng 12/2026.",
    sourceUrl: "https://moet.gov.vn",
    articles: [
      {
        id: "tt-89-2026-d1",
        articleNumber: "Điều 1 (Học bạ số)",
        title: "Pháp lý hóa Học bạ số và quy trình ký số của giáo viên",
        content:
          "Học bạ số là thành phần chính thức của hồ sơ đánh giá học sinh. Ở cấp Tiểu học, hồ sơ từng năm gồm Học bạ số và Bảng tổng hợp kết quả đánh giá giáo dục của lớp; việc xác nhận hoàn thành chương trình lớp 5/Tiểu học thực hiện trên Học bạ số. Về quy trình ký số: Giáo viên bộ môn chịu trách nhiệm dữ liệu môn học và trực tiếp ký số xác nhận; tiếp theo Giáo viên chủ nhiệm ký số xác nhận toàn bộ học bạ số của lớp.",
        keyPoints: [
          "Học bạ số có giá trị pháp lý chính thức thay thế dần học bạ giấy.",
          "Thứ tự ký số: Giáo viên môn học ký số trước → Giáo viên chủ nhiệm ký số sau.",
          "Trong giai đoạn chuyển tiếp THCS/THPT vẫn duy trì hướng dẫn song song cho tới khi hoàn thiện hạ tầng.",
        ],
        keywords: [
          "học bạ số",
          "ký số",
          "giáo viên bộ môn",
          "giáo viên chủ nhiệm",
          "89/2026",
          "27/2020",
          "22/2021",
          "đánh giá học sinh",
        ],
        audience: ["teacher"],
      },
      {
        id: "tt-89-2026-d2",
        articleNumber: "Điều 2 (Kiểm tra định kỳ)",
        title: "Sở GD&ĐT ra đề kiểm tra chung và kiểm tra trên máy tính",
        content:
          "Sở Giáo dục và Đào tạo chủ trì xây dựng, thẩm định và cung cấp đề kiểm tra định kỳ cuối học kỳ I và cuối học kỳ II đối với một số môn học đánh giá bằng điểm số do Sở lựa chọn. Cơ sở giáo dục được tổ chức kiểm tra định kỳ trên máy tính nếu bảo đảm đầy đủ điều kiện cơ sở vật chất, hạ tầng kỹ thuật và tính công bằng.",
        keyPoints: [
          "Đề kiểm tra chung cuối kỳ I và II do Sở GD&ĐT cung cấp cho các môn được chọn.",
          "Cho phép kiểm tra định kỳ trên máy tính nếu đủ hạ tầng CNTT.",
          "Lịch kiểm tra, đánh giá lại trong hè linh hoạt hơn; đánh giá học sinh khuyết tật dựa trên tiến bộ cá nhân, không so sánh với HS bình thường.",
        ],
        keywords: [
          "đề kiểm tra chung",
          "sở giáo dục ra đề",
          "kiểm tra trên máy tính",
          "thi lại trong hè",
          "học sinh khuyết tật",
          "kiểm tra định kỳ",
        ],
        audience: ["teacher", "aspiring"],
      },
    ],
  },
  {
    id: "tt-93-2026",
    code: "93/2026/TT-BGDĐT",
    shortTitle: "Sửa đổi chuẩn nghề nghiệp, bổ nhiệm chức danh & xếp lương nhà giáo",
    fullTitle:
      "Thông tư số 93/2026/TT-BGDĐT sửa đổi, bổ sung một số điều của các Thông tư quy định về chuẩn nghề nghiệp, bổ nhiệm chức danh và xếp lương đối với nhà giáo",
    issuingBody: "Bộ Giáo dục và Đào tạo",
    issuedDate: "30/10/2026",
    effectiveDate: "15/12/2026",
    status: "upcoming",
    category: "chuan-nghe-nghiep-luong",
    audience: ["teacher", "aspiring"],
    replacesOrAmends: "Sửa đổi, bổ sung các Thông tư chuẩn nghề nghiệp, bổ nhiệm và xếp lương nhà giáo",
    summary:
      "Thông tư mới nhất cuối năm 2026 nhằm tháo gỡ các vướng mắc thực tiễn về bổ nhiệm lại hạng chức danh nghề nghiệp, xếp lương cho giáo viên từng bị vướng tỷ lệ cơ cấu hạng, đồng thời điều chỉnh tiêu chuẩn trình độ đào tạo giáo viên mầm non.",
    highlights: [
      "Tháo gỡ vướng mắc bổ nhiệm lại hạng và xếp lại lương cho giáo viên từng được bổ nhiệm hạng cao trước đây hoặc vướng tỷ lệ cơ cấu hạng tại địa phương.",
      "Làm rõ nhóm đối tượng đủ điều kiện được bổ nhiệm lại hạng và chuyển xếp lương bảo đảm quyền lợi nhà giáo.",
      "Điều chỉnh, đồng bộ tiêu chuẩn trình độ đào tạo cho giáo viên mầm non ở các hạng theo Luật Nhà giáo.",
    ],
    practicalNote:
      "Giáo viên từng gặp bất cập khi chuyển hạng từ chùm Thông tư 01–04/2021 hoặc bị vướng cơ cấu tỷ lệ hạng nên đối chiếu hồ sơ với Thông tư 93/2026/TT-BGDĐT để đề xuất nhà trường/Phòng Nội vụ rà soát xếp lại hạng và lương.",
    sourceUrl: "https://moet.gov.vn",
    articles: [
      {
        id: "tt-93-2026-d1",
        articleNumber: "Điều 1 & Điều 2",
        title: "Tháo gỡ vướng mắc bổ nhiệm lại hạng và xếp lương nhà giáo",
        content:
          "Sửa đổi, bổ sung nguyên tắc bổ nhiệm chức danh và xếp lương nhà giáo để giải quyết các trường hợp giáo viên từng gặp vướng mắc do tỷ lệ cơ cấu hạng chức danh nghề nghiệp tại địa phương hoặc đã được bổ nhiệm ngay vào hạng cao trước đây. Quy định rõ tiêu chí đối tượng được xem xét bổ nhiệm lại hạng và xếp lại hệ số lương tương ứng.",
        keyPoints: [
          "Gỡ nút thắt tỷ lệ cơ cấu hạng khi bổ nhiệm, xếp lương giáo viên.",
          "Bảo vệ quyền lợi cho giáo viên từng được bổ nhiệm hạng cao trước thời điểm chuyển đổi.",
          "Đồng bộ hóa chuẩn trình độ đào tạo giáo viên mầm non các hạng.",
        ],
        keywords: [
          "93/2026",
          "bổ nhiệm chức danh",
          "xếp lương",
          "cơ cấu hạng",
          "bổ nhiệm lại hạng",
          "giáo viên mầm non",
          "chuẩn nghề nghiệp",
        ],
        audience: ["teacher", "aspiring"],
      },
    ],
  },
  {
    id: "tt-30-2026",
    code: "30/2026/TT-BGDĐT",
    shortTitle: "Chuẩn nghề nghiệp giáo viên cơ sở giáo dục phổ thông (mới)",
    fullTitle:
      "Thông tư số 30/2026/TT-BGDĐT quy định Chuẩn nghề nghiệp giáo viên cơ sở giáo dục phổ thông",
    issuingBody: "Bộ Giáo dục và Đào tạo",
    issuedDate: "14/04/2026",
    effectiveDate: "30/05/2026",
    status: "active",
    category: "chuan-nghe-nghiep-luong",
    audience: ["teacher", "aspiring"],
    replacesOrAmends: "Thay thế Thông tư 20/2018/TT-BGDĐT",
    summary:
      "Ban hành hệ thống tiêu chuẩn, tiêu chí đánh giá Chuẩn nghề nghiệp mới dành cho giáo viên Tiểu học, THCS, THPT nhằm đồng bộ với Luật Nhà giáo 2026 và yêu cầu đổi mới chương trình giáo dục phổ thông, chuyển đổi số.",
    highlights: [
      "Chính thức thay thế Thông tư 20/2018/TT-BGDĐT sau 8 năm áp dụng.",
      "Quy định rõ hệ thống tiêu chuẩn phẩm chất, năng lực chuyên môn, nghiệp vụ sư phạm và năng lực số cho giáo viên Tiểu học, THCS, THPT.",
      "Là căn cứ trực tiếp cho đánh giá viên chức hằng năm, quy hoạch, bồi dưỡng và xét thăng hạng.",
    ],
    sourceUrl: "https://moet.gov.vn",
    articles: [
      {
        id: "tt-30-2026-d1",
        articleNumber: "Điều 3 – Điều 8",
        title: "Hệ thống tiêu chuẩn Chuẩn nghề nghiệp giáo viên phổ thông mới",
        content:
          "Chuẩn nghề nghiệp giáo viên phổ thông theo Thông tư 30/2026/TT-BGDĐT quy định các nhóm tiêu chuẩn về phẩm chất nhà giáo, phát triển chuyên môn nghiệp vụ, xây dựng môi trường giáo dục an toàn – hạnh phúc, phát triển mối quan hệ nhà trường – gia đình – xã hội, và năng lực sử dụng ngoại ngữ/công nghệ thông tin – chuyển đổi số theo Luật Nhà giáo.",
        keyPoints: [
          "Áp dụng thống nhất cho giáo viên Tiểu học, THCS và THPT.",
          "Thay thế hoàn toàn Thông tư 20/2018/TT-BGDĐT từ ngày 30/05/2026.",
          "Kết quả đánh giá chuẩn nghề nghiệp là căn cứ bồi dưỡng thường xuyên và xét thăng hạng.",
        ],
        keywords: [
          "chuẩn nghề nghiệp",
          "30/2026",
          "20/2018",
          "đánh giá giáo viên",
          "tiêu chuẩn giáo viên phổ thông",
        ],
        audience: ["teacher", "aspiring"],
      },
    ],
  },
  {
    id: "tt-18-2026",
    code: "18/2026/TT-BGDĐT",
    shortTitle: "Khung năng lực số đối với giáo viên và cán bộ quản lý",
    fullTitle:
      "Thông tư số 18/2026/TT-BGDĐT ban hành Khung năng lực số đối với giáo viên, cán bộ quản lý cơ sở giáo dục mầm non, giáo dục phổ thông và giáo dục thường xuyên",
    issuingBody: "Bộ Giáo dục và Đào tạo",
    issuedDate: "27/03/2026",
    effectiveDate: "12/05/2026",
    status: "active",
    category: "nang-luc-so",
    audience: ["teacher", "aspiring"],
    summary:
      "Lần đầu tiên chuẩn hóa Khung năng lực số dành riêng cho giáo viên và cán bộ quản lý từ mầm non đến phổ thông và GDTX, làm căn cứ đào tạo, bồi dưỡng ứng dụng CNTT, dạy học số và quản trị số.",
    highlights: [
      "Áp dụng cho giáo viên và cán bộ quản lý Mầm non, Tiểu học, THCS, THPT và Giáo dục thường xuyên.",
      "Chuẩn hóa các miền năng lực: ứng dụng CNTT, thiết kế học liệu số, phương pháp dạy học số, an toàn số và quản trị trường học số.",
      "Là căn cứ để giáo viên tự đánh giá, lập kế hoạch bồi dưỡng thường xuyên và là lợi thế lớn cho ứng viên mới ra trường.",
    ],
    sourceUrl: "https://moet.gov.vn",
    articles: [
      {
        id: "tt-18-2026-d1",
        articleNumber: "Điều 1 – Điều 5",
        title: "Mục tiêu, đối tượng và ứng dụng Khung năng lực số nhà giáo",
        content:
          "Khung năng lực số quy định các miền năng lực và bậc trình độ năng lực số cần thiết đối với giáo viên, cán bộ quản lý cơ sở giáo dục mầm non, phổ thông và giáo dục thường xuyên. Các cơ sở giáo dục sử dụng Khung này để xây dựng kế hoạch bồi dưỡng chuyển đổi số; giáo viên sử dụng để tự đánh giá và phát triển kỹ năng dạy học số, khai thác học liệu số và công cụ AI có trách nhiệm.",
        keyPoints: [
          "Có hiệu lực từ ngày 12/05/2026.",
          "Áp dụng cho cả giáo viên và cán bộ quản lý từ mầm non đến GDTX.",
          "Hỗ trợ triển khai đồng bộ với Học bạ số (TT 89/2026) và Chuẩn nghề nghiệp (TT 30/2026).",
        ],
        keywords: [
          "khung năng lực số",
          "18/2026",
          "chuyển đổi số",
          "dạy học số",
          "học liệu số",
          "công nghệ thông tin",
          "cán bộ quản lý",
        ],
        audience: ["teacher", "aspiring"],
      },
    ],
  },
  {
    id: "tt-13-2024",
    code: "13/2024/TT-BGDĐT",
    shortTitle: "Tiêu chuẩn, điều kiện xét thăng hạng chức danh nghề nghiệp giáo viên",
    fullTitle:
      "Thông tư số 13/2024/TT-BGDĐT quy định tiêu chuẩn, điều kiện xét thăng hạng chức danh nghề nghiệp giáo viên mầm non, phổ thông công lập và giáo viên dự bị đại học",
    issuingBody: "Bộ Giáo dục và Đào tạo",
    issuedDate: "30/10/2024",
    effectiveDate: "15/12/2024",
    status: "active",
    category: "chuan-nghe-nghiep-luong",
    audience: ["teacher"],
    replacesOrAmends: "Thay thế Thông tư 34/2021/TT-BGDĐT",
    summary:
      "Quy định chi tiết, rõ ràng và minh bạch các tiêu chuẩn, điều kiện xét thăng hạng từ hạng III lên hạng II và từ hạng II lên hạng I đối với giáo viên mầm non, phổ thông công lập.",
    highlights: [
      "Bãi bỏ hình thức thi thăng hạng cũ, thống nhất xét thăng hạng dựa trên tiêu chuẩn năng lực, thời gian giữ hạng và chất lượng hoàn thành nhiệm vụ.",
      "Làm rõ yêu cầu về xếp loại chất lượng viên chức, danh hiệu thi đua, bằng khen/chiến sĩ thi đua phù hợp thực tế từng cấp học.",
      "Tạo hành lang pháp lý thuận lợi để các tỉnh/thành phố tổ chức xét thăng hạng định kỳ hằng năm.",
    ],
    sourceUrl: "https://moet.gov.vn",
    articles: [
      {
        id: "tt-13-2024-d3",
        articleNumber: "Điều 3 – Điều 6",
        title: "Điều kiện chung và tiêu chuẩn xét thăng hạng II, hạng I",
        content:
          "Giáo viên được đăng ký dự xét thăng hạng chức danh nghề nghiệp khi đáp ứng: cơ sở giáo dục có nhu cầu vị trí việc làm ở hạng dự xét; được xếp loại chất lượng ở mức hoàn thành tốt nhiệm vụ trở lên trong năm công tác liền kề; có phẩm chất chính trị, đạo đức nghề nghiệp tốt; không trong thời hạn xử lý kỷ luật; và đáp ứng đủ tiêu chuẩn về trình độ đào tạo, bồi dưỡng, năng lực chuyên môn và thời gian giữ hạng liền kề theo quy định từng cấp học.",
        keyPoints: [
          "Thực hiện theo hình thức XÉT thăng hạng (không thi).",
          "Yêu cầu xếp loại Hoàn thành tốt nhiệm vụ trở lên trong năm liền kề trước năm xét.",
          "Đáp ứng đủ thời gian giữ hạng dưới liền kề và minh chứng năng lực chuyên môn/thi đua theo từng hạng.",
        ],
        keywords: [
          "thăng hạng",
          "xét thăng hạng",
          "13/2024",
          "hạng ii",
          "hạng i",
          "hoàn thành tốt nhiệm vụ",
          "chức danh nghề nghiệp",
        ],
        audience: ["teacher"],
      },
    ],
  },
  {
    id: "tt-01-04-2021-08-2023",
    code: "01–04/2021 & 08/2023/TT-BGDĐT",
    shortTitle: "Mã số, tiêu chuẩn chức danh nghề nghiệp & bổ nhiệm hạng giáo viên",
    fullTitle:
      "Chùm Thông tư 01, 02, 03, 04/2021/TT-BGDĐT (sửa đổi bởi Thông tư 08/2023/TT-BGDĐT) quy định mã số, tiêu chuẩn CDNN và bổ nhiệm, xếp lương viên chức giảng dạy",
    issuingBody: "Bộ Giáo dục và Đào tạo",
    issuedDate: "14/04/2023",
    effectiveDate: "30/05/2023",
    status: "consolidated",
    category: "chuan-nghe-nghiep-luong",
    audience: ["teacher", "aspiring"],
    replacesOrAmends: "Được sửa đổi, bổ sung tiếp bởi Thông tư 93/2026/TT-BGDĐT",
    summary:
      "Khung nền tảng về phân hạng III, II, I cho giáo viên Mầm non (TT 01), Tiểu học (TT 02), THCS (TT 03), THPT (TT 04); bỏ yêu cầu bắt buộc chứng chỉ bồi dưỡng CDNN ngay tại thời điểm chuyển hạng cũ sang mới và quy định chuẩn trình độ tuyển dụng.",
    highlights: [
      "Mỗi cấp học công lập chia thành 3 hạng: Hạng III, Hạng II, Hạng I.",
      "Theo TT 08/2023: Không yêu cầu giáo viên phải có chứng chỉ bồi dưỡng theo tiêu chuẩn CDNN ngay tại thời điểm chuyển xếp từ hạng cũ sang hạng mới tương ứng.",
      "Thời gian giữ hạng cũ được tính cộng dồn vào thời gian giữ hạng mới.",
      "Chuẩn trình độ tuyển dụng theo Luật Giáo dục 2019: Cao đẳng sư phạm trở lên đối với Mầm non; Cử nhân trở lên đối với Tiểu học, THCS, THPT.",
    ],
    sourceUrl: "https://moet.gov.vn",
    articles: [
      {
        id: "tt-08-2023-d1",
        articleNumber: "Chùm TT 01–04/2021 & TT 08/2023",
        title: "Chứng chỉ CDNN khi chuyển hạng và chuẩn bằng cấp tuyển dụng giáo viên",
        content:
          "Khi bổ nhiệm từ chức danh nghề nghiệp giáo viên hạng cũ sang hạng mới tương ứng, giáo viên không bị yêu cầu phải có ngay chứng chỉ bồi dưỡng theo tiêu chuẩn chức danh nghề nghiệp của hạng; chỉ sử dụng 01 chứng chỉ bồi dưỡng chung cho các hạng của mỗi cấp học đối với giáo viên mới tuyển dụng hoặc thăng hạng. Về chuẩn trình độ tuyển dụng viên chức giáo dục: Giáo viên Mầm non cần bằng Cao đẳng sư phạm trở lên; Giáo viên Tiểu học, THCS, THPT cần bằng Cử nhân thuộc ngành đào tạo giáo viên (hoặc bằng Cử nhân chuyên ngành phù hợp kèm chứng chỉ nghiệp vụ sư phạm).",
        keyPoints: [
          "Mầm non: Cao đẳng sư phạm trở lên.",
          "Tiểu học, THCS, THPT: Cử nhân sư phạm HOẶC Cử nhân ngành phù hợp + Chứng chỉ NVSP.",
          "Chuyển hạng cũ sang mới không bị đòi chứng chỉ CDNN ngay tại thời điểm bổ nhiệm; cộng dồn thời gian giữ hạng.",
        ],
        keywords: [
          "chứng chỉ chức danh nghề nghiệp",
          "cdnn",
          "08/2023",
          "01/2021",
          "02/2021",
          "03/2021",
          "04/2021",
          "tuyển dụng giáo viên",
          "bằng cấp",
          "chuẩn trình độ",
        ],
        audience: ["teacher", "aspiring"],
      },
    ],
  },
  {
    id: "luat-nha-giao-2026",
    code: "Luật Nhà giáo & NĐ 182/2026/NĐ-CP",
    shortTitle: "Chính sách lương cao nhất, 9 mức phụ cấp ưu đãi & Lương cơ sở 2026",
    fullTitle:
      "Luật Nhà giáo (hiệu lực 01/01/2026), Nghị định 182/2026/NĐ-CP về phụ cấp ưu đãi theo nghề và Nghị định 161/2026/NĐ-CP về mức lương cơ sở",
    issuingBody: "Quốc hội & Chính phủ",
    issuedDate: "07/07/2026",
    effectiveDate: "01/01/2026",
    status: "active",
    category: "chuan-nghe-nghiep-luong",
    audience: ["teacher", "aspiring"],
    summary:
      "Khung pháp lý cao nhất về đãi ngộ nhà giáo năm 2026: lương giáo viên công lập xếp cao nhất hệ thống hành chính sự nghiệp, 09 mức phụ cấp ưu đãi từ 20% đến 80% (bổ sung 20% cho nhân sự hỗ trợ giáo dục), và mức lương cơ sở tăng lên 2,53 triệu đồng/tháng từ 01/07/2026.",
    highlights: [
      "Điều 23 Luật Nhà giáo: Tiền lương nhà giáo công lập được xếp cao nhất trong hệ thống thang bậc lương hành chính sự nghiệp.",
      "Nghị định 182/2026/NĐ-CP (hưởng tính từ 01/01/2026): Chia 09 mức phụ cấp ưu đãi nghề từ 20% đến 80%.",
      "Lần đầu tiên nhân sự hỗ trợ giáo dục trong trường công lập được hưởng phụ cấp ưu đãi nghề mức 20%.",
      "Nghị định 161/2026/NĐ-CP: Mức lương cơ sở tăng lên 2,53 triệu đồng/tháng từ ngày 01/07/2026.",
    ],
    practicalNote:
      "Nhà giáo công tác ở bậc mầm non, vùng dân tộc thiểu số, miền núi, biên giới, hải đảo, vùng đặc biệt khó khăn, trường chuyên biệt, giáo dục hòa nhập được hưởng chính sách lương và phụ cấp cao hơn mức thông thường.",
    sourceUrl: "https://moet.gov.vn",
    articles: [
      {
        id: "luat-ng-d23",
        articleNumber: "Điều 23 Luật Nhà giáo",
        title: "Nguyên tắc xếp lương cao nhất và chính sách vùng đặc thù",
        content:
          "Tiền lương của nhà giáo trong cơ sở giáo dục công lập được xếp cao nhất trong hệ thống thang bậc lương hành chính sự nghiệp. Nhà giáo công tác ở cấp học mầm non, vùng đồng bào dân tộc thiểu số, miền núi, biên giới, hải đảo, vùng có điều kiện kinh tế - xã hội đặc biệt khó khăn, trường chuyên biệt, giáo dục hòa nhập hoặc ngành nghề đặc thù được hưởng tiền lương và phụ cấp cao hơn nhà giáo làm việc trong điều kiện bình thường.",
        keyPoints: [
          "Lương nhà giáo xếp cao nhất trong thang bậc lương hành chính sự nghiệp.",
          "Ưu tiên cao hơn cho giáo viên mầm non, vùng khó khăn, biên giới, hải đảo, giáo dục hòa nhập.",
          "Có cơ chế pháp lý bảo vệ danh dự, nhân phẩm, thân thể nhà giáo và liên thông công lập – ngoài công lập.",
        ],
        keywords: [
          "luật nhà giáo",
          "lương giáo viên",
          "xếp cao nhất",
          "mầm non",
          "vùng khó khăn",
          "bảo vệ nhà giáo",
        ],
        audience: ["teacher", "aspiring"],
      },
      {
        id: "nd-182-2026-d1",
        articleNumber: "NĐ 182/2026 & NĐ 161/2026",
        title: "09 mức phụ cấp ưu đãi nghề (20%–80%) và Lương cơ sở 2,53 triệu đồng",
        content:
          "Nghị định 182/2026/NĐ-CP (hiệu lực 07/07/2026, áp dụng chi trả tính từ 01/01/2026) quy định 09 mức phụ cấp ưu đãi theo nghề dao động từ 20% đến 80% tùy cấp học, loại hình cơ sở và địa bàn công tác; đặc biệt lần đầu bổ sung mức phụ cấp ưu đãi 20% cho nhân sự hỗ trợ giáo dục công lập. Đồng thời, theo Nghị định 161/2026/NĐ-CP, mức lương cơ sở từ ngày 01/07/2026 là 2,53 triệu đồng/tháng.",
        keyPoints: [
          "09 mức phụ cấp ưu đãi nghề từ 20% đến 80%, áp dụng hồi tố chi trả từ 01/01/2026.",
          "Nhân sự hỗ trợ giáo dục công lập lần đầu được hưởng phụ cấp ưu đãi 20%.",
          "Lương cơ sở từ 01/07/2026 là 2,53 triệu đồng/tháng.",
        ],
        keywords: [
          "phụ cấp ưu đãi",
          "182/2026",
          "20%",
          "80%",
          "nhân sự hỗ trợ giáo dục",
          "lương cơ sở",
          "2,53 triệu",
          "161/2026",
        ],
        audience: ["teacher", "aspiring"],
      },
    ],
  },
];

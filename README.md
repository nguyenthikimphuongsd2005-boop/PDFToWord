# PDF To Word Converter Pro

Dự án này là một ứng dụng web cho phép chuyển đổi các tệp PDF sang định dạng Word (.docx) hoặc Văn bản (.txt). Ứng dụng hỗ trợ cả chuyển đổi thông thường và sử dụng công nghệ OCR (Nhận diện ký tự quang học) để xử lý các tệp PDF dạng ảnh quét (scanned).

## ✨ Tính năng chính

* **Chuyển đổi tệp đơn lẻ**: Hỗ trợ chuyển đổi từng tệp PDF với tùy chọn chọn phạm vi trang cần xử lý.
* **Chuyển đổi hàng loạt**: Cho phép tải lên nhiều tệp PDF cùng lúc và tải về kết quả dưới dạng tệp nén ZIP.
* **Công nghệ OCR**: Tích hợp Tesseract OCR để nhận diện văn bản tiếng Việt và tiếng Anh từ các tệp PDF dạng ảnh.
* **Xử lý hình ảnh**: Tự động tiền xử lý ảnh (chuyển xám, khử nhiễu, nhị phân hóa) trước khi OCR để tăng độ chính xác.
* **Giao diện hiện đại**: Được xây dựng với React và Tailwind CSS, hỗ trợ kéo thả tệp tiện lợi.

## 🛠 Công nghệ sử dụng

### Backend (Python/FastAPI)

* **FastAPI**: Framework web hiệu năng cao.
* **pdf2docx**: Thư viện chính để chuyển đổi PDF sang Word.
* **PyMuPDF & PyPDF2**: Xử lý và đọc tệp PDF.
* **pytesseract**: Giao tiếp với công cụ Tesseract OCR.
* **OpenCV (cv2) & Pillow (PIL)**: Xử lý hình ảnh trước khi nhận diện văn bản.
* **python-docx**: Tạo và chỉnh sửa tệp Word.

### Frontend (React/Vite)

* **React 19**: Thư viện UI.
* **Vite**: Công cụ build nhanh chóng.
* **Tailwind CSS**: Framework CSS để thiết kế giao diện.
* **Lucide React**: Bộ icon đẹp mắt.

## 🚀 Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống

* Python 3.10+
* Node.js 18+
* **Tesseract OCR**: Cần được cài đặt trên máy tính. Đường dẫn mặc định trong mã nguồn là `C:\Program Files\Tesseract-OCR\tesseract.exe`.
* **Poppler**: Cần thiết cho thư viện `pdf2image`.

### 2. Cài đặt Backend

```bash
cd server
pip install -r requirements.txt
uvicorn app.main:app --reload

```

Backend sẽ chạy tại: `http://localhost:8000`.

### 3. Cài đặt Frontend

```bash
cd client
npm install
npm run dev

```

Giao diện sẽ chạy tại: `http://localhost:5173`.

## 📁 Cấu trúc thư mục

* `/client`: Mã nguồn React frontend.
* `/src/components`: Chứa giao diện `SingleTab` (chuyển đơn) và `BatchTab` (chuyển hàng loạt).


* `/server`: Mã nguồn FastAPI backend.
* `/app/core.py`: Chứa logic xử lý PDF và OCR chính.
* `/app/main.py`: Định nghĩa các API endpoints.



## 📝 Lưu ý

* Thư mục `temp/` trong server được sử dụng để lưu trữ tạm thời các tệp trong quá trình xử lý và sẽ tự động được dọn dẹp sau khi hoàn tất.
* Bạn có thể điều chỉnh phạm vi trang theo định dạng: `1-5, 8, 10-12`.
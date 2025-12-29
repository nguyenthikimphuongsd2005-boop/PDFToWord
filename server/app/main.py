from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import zipfile
from typing import List, Optional
from app.core import PDFProcessor
from fastapi import BackgroundTasks  # Nhớ import cái này

app = FastAPI()

# Cấu hình CORS để React gọi được API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp"
os.makedirs(TEMP_DIR, exist_ok=True)


def clear_temp_folder():
    """Dọn dẹp thư mục temp định kỳ hoặc sau khi xử lý"""
    for filename in os.listdir(TEMP_DIR):
        file_path = os.path.join(TEMP_DIR, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f"Không thể xóa {file_path}. Lý do: {e}")


def remove_file(path: str):
    """Hàm này sẽ chạy ngầm sau khi trả file xong"""
    try:
        os.remove(path)
        print(f"Đã xóa file tạm: {path}")
    except Exception as e:
        print(f"Lỗi xóa file {path}: {e}")


@app.post("/api/convert/single")
async def convert_single(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    mode: str = Form("docx"),  # docx hoặc txt
    pages: Optional[str] = Form(None),
    use_ocr: bool = Form(False),
):
    try:
        # 1. Lưu file upload
        input_path = os.path.join(TEMP_DIR, file.filename)
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Định nghĩa file đầu ra
        ext = ".docx" if mode == "docx" else ".txt"
        output_filename = f"converted_{os.path.splitext(file.filename)[0]}{ext}"
        output_path = os.path.join(TEMP_DIR, output_filename)

        # 3. Xử lý
        if mode == "docx":
            success, msg = PDFProcessor.convert_to_word(
                input_path, output_path, pages, use_ocr
            )
        else:
            success, msg = PDFProcessor.convert_to_text(input_path, output_path, pages)

        if not success:
            raise HTTPException(status_code=500, detail=msg)

        # 4. Trả về file
        background_tasks.add_task(remove_file, input_path)
        background_tasks.add_task(remove_file, output_path)

        return FileResponse(output_path, filename=output_filename)

    except Exception as e:
        if os.path.exists(input_path):
            os.remove(input_path)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/convert/batch")
async def convert_batch(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    use_ocr: bool = Form(False),
):
    try:
        # Tạo thư mục con cho batch này để tránh trùng lặp
        batch_id = "converted_batch"
        batch_dir = os.path.join(TEMP_DIR, batch_id)
        os.makedirs(batch_dir, exist_ok=True)

        converted_files = []

        for file in files:
            # Lưu file gốc
            input_path = os.path.join(batch_dir, file.filename)
            with open(input_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Tạo đường dẫn output
            output_filename = os.path.splitext(file.filename)[0] + ".docx"
            output_path = os.path.join(batch_dir, output_filename)

            # Chuyển đổi (Mặc định là DOCX cho batch, giống code cũ của bạn)
            success, msg = PDFProcessor.convert_to_word(
                input_path, output_path, None, use_ocr
            )

            if success:
                converted_files.append(output_path)
                # Xóa file pdf gốc để tiết kiệm chỗ
                os.remove(input_path)

        if not converted_files:
            raise HTTPException(
                status_code=400, detail="Không chuyển đổi được file nào."
            )

        # Nén thành ZIP
        zip_filename = "converted_batch.zip"
        zip_path = os.path.join(TEMP_DIR, zip_filename)

        with zipfile.ZipFile(zip_path, "w") as zipf:
            for file_path in converted_files:
                zipf.write(file_path, os.path.basename(file_path))

        # Dọn dẹp folder batch
        shutil.rmtree(batch_dir)
        background_tasks.add_task(remove_file, zip_path)

        return FileResponse(zip_path, filename=zip_filename)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import {
	AlertCircle,
	CheckCircle,
	FileText,
	Loader2,
	Upload,
	Zap
} from "lucide-react";
import { useState } from "react";

const SingleTab = () => {
	const [file, setFile] = useState(null);
	const [pages, setPages] = useState("");
	const [useOcr, setUseOcr] = useState(false);
	const [mode, setMode] = useState("docx");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const droppedFiles = e.dataTransfer.files;
		if (
			droppedFiles.length > 0 &&
			droppedFiles[0].type === "application/pdf"
		) {
			setFile(droppedFiles[0]);
		} else {
			setMessage({ type: "error", text: "Vui lòng chọn file PDF!" });
		}
	};

	const handleConvert = async () => {
		if (!file) {
			setMessage({ type: "error", text: "Vui lòng chọn file PDF!" });
			return;
		}

		setLoading(true);
		setMessage(null);

		const formData = new FormData();
		formData.append("file", file);
		formData.append("mode", mode);
		formData.append("use_ocr", useOcr);
		if (pages) formData.append("pages", pages);

		try {
			const response = await fetch(
				"http://localhost:8000/api/convert/single",
				{
					method: "POST",
					body: formData,
				}
			);

			if (!response.ok) throw new Error("Conversion failed");

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			const ext = mode === "docx" ? ".docx" : ".txt";
			link.setAttribute("download", file.name.replace(".pdf", ext));
			document.body.appendChild(link);
			link.click();
			link.remove();
			setMessage({
				type: "success",
				text: "Chuyển đổi thành công! File đã được tải xuống.",
			});
		} catch (error) {
			console.error(error);
			setMessage({
				type: "error",
				text: "Lỗi khi chuyển đổi. Hãy kiểm tra lại file hoặc backend.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* File Upload Area */}
			<div className="relative group">
				<input
					type="file"
					accept=".pdf"
					onChange={(e) => setFile(e.target.files[0])}
					className="hidden"
					id="single-file-upload"
				/>
				<label
					htmlFor="single-file-upload"
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
						isDragging
							? "border-blue-500 bg-blue-100 scale-105"
							: "border-gray-300 bg-linear-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 group-hover:border-blue-400"
					}`}>
					<div className="flex flex-col items-center justify-center pt-5 pb-6">
						<Upload className="w-12 h-12 mb-3 text-blue-500 group-hover:scale-110 transition-transform" />
						<p className="mb-2 text-sm font-semibold text-gray-700">
							<span className="text-blue-600">
								Nhấn để chọn file
							</span>{" "}
							hoặc kéo thả vào đây
						</p>
						<p className="text-xs text-gray-500">
							PDF (tối đa 50MB)
						</p>
					</div>
				</label>
				{file && (
					<div className="mt-3 p-3 bg-white rounded-xl border border-green-200 shadow-sm">
						<div className="flex items-center space-x-3">
							<FileText className="w-5 h-5 text-green-600" />
							<span className="text-sm font-medium text-gray-700 flex-1">
								{file.name}
							</span>
							<CheckCircle className="w-5 h-5 text-green-600" />
						</div>
					</div>
				)}
			</div>

			{/* Page Range */}
			<div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
				<label className="block text-sm font-semibold text-gray-700 mb-3">
					Chọn trang cần chuyển đổi
				</label>
				<input
					type="text"
					placeholder="Ví dụ: 1-5, 8, 10-12"
					value={pages}
					onChange={(e) => setPages(e.target.value)}
					className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
				/>
				<p className="text-xs text-gray-500 mt-2 flex items-center">
					<span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
					Để trống để chuyển đổi toàn bộ tài liệu
				</p>
			</div>

			{/* Options */}
			<div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-2xl p-6 space-y-4">
				<div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
					<input
						type="checkbox"
						checked={useOcr}
						onChange={(e) => setUseOcr(e.target.checked)}
						className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
						id="ocr-toggle"
					/>
					<label
						htmlFor="ocr-toggle"
						className="flex-1 cursor-pointer">
						<span className="text-sm font-semibold text-gray-800">
							Sử dụng OCR
						</span>
						<p className="text-xs text-gray-500 mt-0.5">
							Nhận diện văn bản từ hình ảnh scan
						</p>
					</label>
					<Zap className="w-5 h-5 text-yellow-500" />
				</div>

				<div className="space-y-3">
					<p className="text-sm font-semibold text-gray-700">
						Định dạng đầu ra:
					</p>
					<div className="grid grid-cols-2 gap-3">
						<label
							className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all ${
								mode === "docx"
									? "bg-blue-600 text-white shadow-lg scale-105"
									: "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
							}`}>
							<input
								type="radio"
								name="mode"
								value="docx"
								checked={mode === "docx"}
								onChange={(e) => setMode(e.target.value)}
								className="hidden"
							/>
							<FileText className="w-5 h-5" />
							<span className="text-sm font-medium">
								Word (.docx)
							</span>
						</label>
						<label
							className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all ${
								mode === "txt"
									? "bg-blue-600 text-white shadow-lg scale-105"
									: "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
							}`}>
							<input
								type="radio"
								name="mode"
								value="txt"
								checked={mode === "txt"}
								onChange={(e) => setMode(e.target.value)}
								className="hidden"
							/>
							<FileText className="w-5 h-5" />
							<span className="text-sm font-medium">
								Text (.txt)
							</span>
						</label>
					</div>
				</div>
			</div>

			{/* Convert Button */}
			<button
				onClick={handleConvert}
				disabled={loading}
				className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 ${
					loading
						? "bg-gray-400 cursor-not-allowed"
						: "bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:scale-105"
				}`}>
				{loading ? (
					<span className="flex items-center justify-center">
						<Loader2 className="animate-spin mr-2 h-5 w-5" />
						Đang xử lý...
					</span>
				) : (
					<span className="flex items-center justify-center">
						<Zap className="mr-2 h-5 w-5" />
						CHUYỂN ĐỔI NGAY
					</span>
				)}
			</button>

			{/* Message */}
			{message && (
				<div
					className={`p-4 rounded-xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-2 ${
						message.type === "success"
							? "bg-green-50 border border-green-200"
							: "bg-red-50 border border-red-200"
					}`}>
					{message.type === "success" ? (
						<CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
					) : (
						<AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
					)}
					<p
						className={`text-sm font-medium ${
							message.type === "success"
								? "text-green-700"
								: "text-red-700"
						}`}>
						{message.text}
					</p>
				</div>
			)}
		</div>
	);
};
export default SingleTab;

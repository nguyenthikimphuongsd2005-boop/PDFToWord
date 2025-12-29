import {
	AlertCircle,
	CheckCircle,
	FileText,
	Loader2,
	Package,
	Zap
} from "lucide-react";
import { useState } from "react";

const BatchTab = () => {
	const [files, setFiles] = useState(null);
	const [useOcr, setUseOcr] = useState(false);
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
		const pdfFiles = Array.from(droppedFiles).filter(
			(f) => f.type === "application/pdf"
		);

		if (pdfFiles.length > 0) {
			const fileList = new DataTransfer();
			pdfFiles.forEach((f) => fileList.items.add(f));
			setFiles(fileList.files);
		} else {
			setMessage({ type: "error", text: "Vui lòng chọn file PDF!" });
		}
	};

	const handleConvert = async () => {
		if (!files || files.length === 0) {
			setMessage({
				type: "error",
				text: "Vui lòng chọn ít nhất 1 file!",
			});
			return;
		}

		setLoading(true);
		setMessage(null);

		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append("files", files[i]);
		}
		formData.append("use_ocr", useOcr);

		try {
			const response = await fetch(
				"http://localhost:8000/api/convert/batch",
				{
					method: "POST",
					body: formData,
				}
			);

			if (!response.ok) throw new Error("Batch conversion failed");

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "converted_batch.zip");
			document.body.appendChild(link);
			link.click();
			link.remove();
			setMessage({
				type: "success",
				text: "Hoàn tất! Đã tải xuống file ZIP.",
			});
		} catch (error) {
			console.error(error);
			setMessage({ type: "error", text: "Lỗi xử lý hàng loạt." });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Batch Upload Area */}
			<div className="relative group">
				<input
					type="file"
					multiple
					accept=".pdf"
					onChange={(e) => setFiles(e.target.files)}
					className="hidden"
					id="batch-upload"
				/>
				<label
					htmlFor="batch-upload"
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className={`flex flex-col items-center justify-center w-full min-h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 p-8 ${
						isDragging
							? "border-purple-500 bg-purple-100 scale-105"
							: "border-gray-300 bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 hover:from-purple-100 hover:via-blue-100 hover:to-indigo-100 group-hover:border-purple-400"
					}`}>
					<div className="flex flex-col items-center justify-center">
						<Package className="w-16 h-16 mb-4 text-purple-500 group-hover:scale-110 transition-transform" />
						<p className="mb-2 text-lg font-bold text-gray-700">
							<span className="text-purple-600">
								Chọn nhiều file PDF
							</span>
						</p>
						<p className="text-sm text-gray-500 mb-4">
							Kéo thả hoặc nhấn để chọn
						</p>
						{files && (
							<div className="mt-4 w-full bg-white rounded-xl p-5 shadow-lg border border-purple-200">
								<div className="flex items-center justify-between mb-3">
									<p className="font-bold text-gray-800 flex items-center">
										<CheckCircle className="w-5 h-5 text-green-600 mr-2" />
										Đã chọn {files.length} file
									</p>
								</div>
								<div className="max-h-40 overflow-y-auto space-y-2">
									{Array.from(files).map((f, index) => (
										<div
											key={index}
											className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
											<FileText className="w-4 h-4 text-blue-600 shrink-0" />
											<span className="text-sm text-gray-700 truncate">
												{f.name}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</label>
			</div>

			{/* OCR Option */}
			<div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-2xl p-6 shadow-sm border border-orange-200">
				<label
					htmlFor="batch-ocr"
					className="flex items-center space-x-3 cursor-pointer">
					<input
						type="checkbox"
						checked={useOcr}
						onChange={(e) => setUseOcr(e.target.checked)}
						className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500 cursor-pointer"
						id="batch-ocr"
					/>
					<div className="flex-1">
						<span className="text-sm font-semibold text-gray-800">
							OCR Tự động
						</span>
						<p className="text-xs text-gray-600 mt-0.5">
							Tự động nhận diện file scan và áp dụng OCR
						</p>
					</div>
					<Zap className="w-6 h-6 text-orange-500" />
				</label>
			</div>

			{/* Batch Convert Button */}
			<button
				onClick={handleConvert}
				disabled={loading}
				className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 ${
					loading
						? "bg-gray-400 cursor-not-allowed"
						: "bg-linear-to-r from-green-500 to-blue-500 hover:from-red-500 hover:to-blue-500 hover:shadow-xl hover:scale-105"
				}`}>
				{loading ? (
					<span className="flex items-center justify-center">
						<Loader2 className="animate-spin mr-2 h-5 w-5" />
						Đang xử lý hàng loạt...
					</span>
				) : (
					<span className="flex items-center justify-center">
						<Package className="mr-2 h-5 w-5" />
						CHUYỂN ĐỔI & TẢI ZIP
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
export default BatchTab;

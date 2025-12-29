import {
	FileText,
	Package,
	Zap
} from "lucide-react";
import { useState } from "react";
import SingleTab from "./components/SingleTab";
import BatchTab from "./components/BatchTab";

function App() {
	const [activeTab, setActiveTab] = useState("single");

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden">
				{/* Header */}
				<div className="bg-linear-to-r from-red-500 to-blue-500 p-8 text-white relative overflow-hidden">
					<div className="absolute inset-0 opacity-20">
						<div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
						<div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl"></div>
					</div>
					<div className="relative z-10 text-center">
						<div className="flex items-center justify-center mb-3">
							<Zap className="w-10 h-10 mr-3" />
							<h1 className="text-4xl font-bold">
								PDF Converter Pro
							</h1>
						</div>
						<p className="opacity-90 text-sm">
							Chuyển đổi PDF sang Word/Text với công nghệ AI tiên
							tiến
						</p>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex border-b-2 border-gray-100 bg-gray-50">
					<button
						className={`flex-1 py-5 text-center font-bold transition-all duration-300 relative ${
							activeTab === "single"
								? "text-blue-600 bg-white"
								: "text-gray-500 hover:text-blue-500 hover:bg-white/50"
						}`}
						onClick={() => setActiveTab("single")}>
						{activeTab === "single" && (
							<div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 to-indigo-600"></div>
						)}
						<div className="flex items-center justify-center space-x-2">
							<FileText className="w-5 h-5" />
							<span>Chuyển đổi 1 File</span>
						</div>
					</button>
					<button
						className={`flex-1 py-5 text-center font-bold transition-all duration-300 relative ${
							activeTab === "batch"
								? "text-purple-600 bg-white"
								: "text-gray-500 hover:text-purple-500 hover:bg-white/50"
						}`}
						onClick={() => setActiveTab("batch")}>
						{activeTab === "batch" && (
							<div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-purple-600 to-blue-600"></div>
						)}
						<div className="flex items-center justify-center space-x-2">
							<Package className="w-5 h-5" />
							<span>Chuyển đổi Hàng loạt</span>
						</div>
					</button>
				</div>

				{/* Content */}
				<div className="p-8">
					{activeTab === "single" ? <SingleTab /> : <BatchTab />}
				</div>
			</div>
		</div>
	);
}

export default App;

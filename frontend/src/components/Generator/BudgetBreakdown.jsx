import { z } from "zod";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

export const BudgetBreakdown = ({
    totalBudget = 2000,
    spent = 1450,
    furniture = 1200,
    decor = 500,
    labor = 300,
    roomName = "Bedroom",
    designType = "Luxury",
}) => {
    const data = [
        { name: "Furniture", value: furniture, color: "#3B82F6" },
        { name: "Decor", value: decor, color: "#6366F1" },
        { name: "Labor", value: labor, color: "#EC4899" },
    ];

    const remaining = totalBudget - spent;

    // ===== EXPORT PDF FUNCTION =====
    const exportBudgetPDF = async () => {
        try {
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            let yPosition = 20;

            // HEADER
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(24);
            pdf.setTextColor(51, 51, 51);
            pdf.text(`${roomName} - ${designType}`, 20, yPosition);

            yPosition += 12;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(14);
            pdf.setTextColor(100, 100, 100);
            pdf.text("Budget Breakdown Report", 20, yPosition);

            // DIVIDER
            yPosition += 10;
            pdf.setDrawColor(180, 180, 180);
            pdf.line(20, yPosition, pageWidth - 20, yPosition);

            // SUMMARY CARDS
            yPosition += 15;
            pdf.setFontSize(12);
            pdf.setTextColor(51, 51, 51);
            pdf.setFont("helvetica", "bold");

            // Total Budget
            pdf.text("Total Budget:", 20, yPosition);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(51, 51, 51);
            pdf.setFontSize(16);
            pdf.text(`$${totalBudget.toLocaleString()}`, 80, yPosition);

            yPosition += 12;
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(51, 51, 51);
            pdf.text("Amount Spent:", 20, yPosition);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(200, 120, 0);
            pdf.setFontSize(16);
            pdf.text(`$${spent.toLocaleString()}`, 80, yPosition);

            yPosition += 12;
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(51, 51, 51);
            pdf.text("Remaining:", 20, yPosition);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(34, 197, 94);
            pdf.setFontSize(16);
            pdf.text(`$${remaining.toLocaleString()}`, 80, yPosition);

            // PERCENTAGE
            yPosition += 15;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            const percentage = Math.round((spent / totalBudget) * 100);
            pdf.text(`Budget Usage: ${percentage}% of total budget`, 20, yPosition);

            // BREAKDOWN TABLE
            yPosition += 15;
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(51, 51, 51);
            pdf.text("Budget Breakdown", 20, yPosition);

            yPosition += 10;

            // Table header
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(10);
            pdf.setFillColor(240, 240, 240);
            pdf.rect(20, yPosition - 5, pageWidth - 40, 8, "F");
            pdf.setTextColor(51, 51, 51);
            pdf.text("Category", 25, yPosition);
            pdf.text("Amount", 100, yPosition);
            pdf.text("Percentage", 150, yPosition);

            yPosition += 10;

            // Table rows
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);

            data.forEach((item, index) => {
                if (index % 2 === 0) {
                    pdf.setFillColor(250, 250, 250);
                    pdf.rect(20, yPosition - 5, pageWidth - 40, 8, "F");
                }

                pdf.setTextColor(80, 80, 80);
                pdf.text(item.name, 25, yPosition);
                pdf.text(`$${item.value.toLocaleString()}`, 100, yPosition);

                const itemPercentage = Math.round((item.value / totalBudget) * 100);
                pdf.text(`${itemPercentage}%`, 150, yPosition);

                yPosition += 8;
            });

            // TOTAL ROW
            yPosition += 3;
            pdf.setDrawColor(150, 150, 150);
            pdf.line(20, yPosition, pageWidth - 20, yPosition);

            yPosition += 8;
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(11);
            pdf.setTextColor(51, 51, 51);
            pdf.text("TOTAL:", 25, yPosition);
            pdf.text(`$${spent.toLocaleString()}`, 100, yPosition);
            pdf.text(`${Math.round((spent / totalBudget) * 100)}%`, 150, yPosition);

            // NOTES
            yPosition += 20;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text("Notes:", 20, yPosition);

            yPosition += 6;
            pdf.setFontSize(9);
            const notes = [
                `• Total investment for your ${designType} ${roomName} design`,
                `• Furniture costs: $${furniture.toLocaleString()}`,
                `• Decor and accessories: $${decor.toLocaleString()}`,
                `• Professional installation/labor: $${labor.toLocaleString()}`,
                `• Remaining budget available: $${remaining.toLocaleString()}`,
            ];

            notes.forEach((note) => {
                pdf.text(note, 25, yPosition);
                yPosition += 6;
            });

            // FOOTER
            yPosition += 10;
            pdf.setFontSize(9);
            pdf.setTextColor(150, 150, 150);
            pdf.text(
                "Generated by AI Interior Designer",
                20,
                pdf.internal.pageSize.getHeight() - 15
            );

            // SAVE
            pdf.save(`${roomName}-${designType}-Budget-Breakdown.pdf`);
            toast.success("✅ Budget breakdown PDF exported successfully!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        } catch (error) {
            console.error("Export error:", error);
            toast.error("❌ Failed to export PDF. Make sure jspdf is installed.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    return (
        <div className="w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            <div className="p-8 space-y-8">
                {/* ===== HEADER SECTION ===== */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">💰</span>
                        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Budget Breakdown</h3>
                    </div>
                    <p className="text-gray-600 font-light">Complete cost analysis of your design</p>
                </div>

                {/* ===== SUMMARY CARDS - ENHANCED ===== */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* TOTAL BUDGET CARD */}
                    <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full -mr-10 -mt-10 opacity-20 group-hover:scale-125 transition-transform duration-300"></div>
                        <div className="relative">
                            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Total Budget</p>
                            <p className="text-3xl font-bold text-blue-600 mb-2">${totalBudget.toLocaleString()}</p>
                            <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold">
                                <span>📈</span>
                                <span>Complete allocation</span>
                            </div>
                        </div>
                    </div>

                    {/* SPENT CARD */}
                    <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 hover:shadow-lg">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200 rounded-full -mr-10 -mt-10 opacity-20 group-hover:scale-125 transition-transform duration-300"></div>
                        <div className="relative">
                            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Amount Spent</p>
                            <p className="text-3xl font-bold text-amber-600 mb-2">${spent.toLocaleString()}</p>
                            <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                                <span>💳</span>
                                <span>{Math.round((spent / totalBudget) * 100)}% utilized</span>
                            </div>
                        </div>
                    </div>

                    {/* REMAINING CARD */}
                    <div className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full -mr-10 -mt-10 opacity-20 group-hover:scale-125 transition-transform duration-300"></div>
                        <div className="relative">
                            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Remaining Balance</p>
                            <p className="text-3xl font-bold text-green-600 mb-2">${remaining.toLocaleString()}</p>
                            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                                <span>✓</span>
                                <span>Available funds</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== PROGRESS BAR - ENHANCED ===== */}
                <div className="space-y-3 p-5 bg-white/60 backdrop-blur rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900">Budget Utilization</p>
                        <p className="text-sm font-bold text-blue-600">{Math.round((spent / totalBudget) * 100)}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                        <div
                            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 h-full transition-all duration-500 ease-out rounded-full shadow-lg"
                            style={{ width: `${(spent / totalBudget) * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-600 font-light">
                        {remaining >= 0
                            ? `💚 You have $${remaining.toLocaleString()} left to spend`
                            : `⚠️ Budget exceeded by $${Math.abs(remaining).toLocaleString()}`}
                    </p>
                </div>

                {/* ===== PIE CHART - ENHANCED ===== */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200 shadow-sm">
                    <div className="mb-4">
                        <h4 className="text-sm font-bold text-gray-900 mb-1">Distribution Overview</h4>
                        <p className="text-xs text-gray-600 font-light">Visual breakdown of budget allocation</p>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={3}
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={800}
                                animationEasing="ease-out"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        className="hover:opacity-80 transition-opacity duration-300"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => `$${value.toLocaleString()}`}
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                    fontFamily: 'inherit'
                                }}
                                labelStyle={{ color: '#1f2937', fontWeight: '600' }}
                            />
                            <Legend
                                wrapperStyle={{ paddingTop: '20px' }}
                                formatter={(value, entry) => (
                                    <span style={{ color: '#4b5563', fontSize: '13px', fontWeight: '500' }}>
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* ===== DETAILED BREAKDOWN TABLE - ENHANCED ===== */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">📋</span>
                        <h4 className="font-bold text-lg text-gray-900">Detailed Item Breakdown</h4>
                    </div>

                    <div className="space-y-2">
                        {data.map((item, index) => (
                            <div
                                key={item.name}
                                className="group p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    {/* LEFT SIDE */}
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* COLOR DOT */}
                                        <div className="relative">
                                            <div
                                                className="w-4 h-4 rounded-full shadow-md group-hover:scale-125 transition-transform duration-300"
                                                style={{ backgroundColor: item.color }}
                                            />
                                        </div>

                                        {/* ITEM NAME */}
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                                                {item.name}
                                            </p>
                                        </div>

                                        {/* PROGRESS BAR */}
                                        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full transition-all duration-300"
                                                    style={{
                                                        width: `${(item.value / totalBudget) * 100}%`,
                                                        backgroundColor: item.color
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                                                {Math.round((item.value / totalBudget) * 100)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* RIGHT SIDE - PRICE */}
                                    <div className="text-right ml-4">
                                        <p className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300">
                                            ${item.value.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500 font-light">
                                            {Math.round((item.value / totalBudget) * 100)}% of total
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== SUMMARY STATS ===== */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{data.length}</p>
                        <p className="text-xs text-gray-600 font-light">Items</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">${Math.max(...data.map(d => d.value)).toLocaleString()}</p>
                        <p className="text-xs text-gray-600 font-light">Highest Item</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">${Math.round(spent / data.length).toLocaleString()}</p>
                        <p className="text-xs text-gray-600 font-light">Avg. Per Item</p>
                    </div>
                    <div className="text-center">
                        <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {remaining >= 0 ? '✓' : '⚠️'}
                        </p>
                        <p className="text-xs text-gray-600 font-light">Budget Status</p>
                    </div>
                </div>

                {/* ===== ACTION BUTTONS - ENHANCED ===== */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-200">
                    {/* PRIMARY BUTTON */}
                    <div className="flex-1 group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        <button
                            onClick={exportBudgetPDF}
                            className="relative w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 active:scale-95 cursor-pointer"
                        >
                            <span className="text-xl">📥</span>
                            <div>
                                <p className="font-bold">Export as PDF</p>
                                <p className="text-xs text-blue-100 font-light">Download complete breakdown</p>
                            </div>
                        </button>
                    </div>

                    {/* SECONDARY BUTTON */}
                    <button className="flex-1 px-6 py-4 border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-700 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-50 flex items-center justify-center gap-3 active:scale-95 cursor-pointer">
                        <span className="text-xl">📊</span>
                        <div className="text-left">
                            <p className="font-bold">View Full Report</p>
                            <p className="text-xs text-gray-600 font-light hidden sm:block">Detailed analytics</p>
                        </div>
                    </button>
                </div>

                {/* ===== INFO BANNER ===== */}
                <div className="p-5 bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-xl">
                    <div className="flex gap-3">
                        <span className="text-2xl flex-shrink-0">💡</span>
                        <div>
                            <p className="text-sm font-semibold text-blue-900 mb-1">Pro Tip</p>
                            <p className="text-xs text-blue-800 font-light">
                                Export your budget as PDF to share with designers or use as a shopping reference. All prices are from verified sources!
                            </p>
                        </div>
                    </div>
                </div>

                {/* ===== FOOTER NOTE ===== */}
                <div className="text-center p-3 text-xs text-gray-600 font-light border-t border-gray-200">
                    <p>Last updated: {new Date().toLocaleDateString()} • All prices are estimates and subject to change</p>
                </div>
            </div>
        </div>
    );
};

export const BudgetBreakdownSchema = z.object({
    totalBudget: z.number().describe("Total budget").optional().default(2000),
    spent: z.number().describe("Amount spent so far").optional().default(1450),
    furniture: z.number().describe("Furniture cost").optional().default(1200),
    decor: z.number().describe("Decor cost").optional().default(500),
    labor: z.number().describe("Labor/service cost").optional().default(300),
    roomName: z.string().describe("Room name").optional().default("Bedroom"),
    designType: z.string().describe("Design type").optional().default("Luxury"),
});
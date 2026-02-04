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
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Budget Breakdown</h3>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                            <p className="text-xs text-gray-600 font-light mb-1">Total Budget</p>
                            <p className="text-2xl font-bold text-blue-600">${totalBudget.toLocaleString()}</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                            <p className="text-xs text-gray-600 font-light mb-1">Spent</p>
                            <p className="text-2xl font-bold text-amber-600">${spent.toLocaleString()}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                            <p className="text-xs text-gray-600 font-light mb-1">Remaining</p>
                            <p className="text-2xl font-bold text-green-600">${remaining.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300"
                            style={{ width: `${(spent / totalBudget) * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 font-light mt-2">
                        {Math.round((spent / totalBudget) * 100)}% of budget used
                    </p>
                </div>

                {/* Pie Chart */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => `$${value.toLocaleString()}`}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Breakdown Table */}
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Detailed Breakdown</h4>
                    <div className="space-y-2">
                        {data.map((item) => (
                            <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="font-light text-gray-700">{item.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">${item.value.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">
                                        {Math.round((item.value / totalBudget) * 100)}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={exportBudgetPDF}
                        className="flex items-center justify-center gap-2 flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-semibold text-sm"
                    >
                        <Download size={18} />
                        📥 Export as PDF
                    </button>
                    <button className="flex-1 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-light text-sm">
                        📊 View Full Report
                    </button>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-900 font-light">
                        💡 Click "Export as PDF" to download your complete budget breakdown with all details!
                    </p>
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
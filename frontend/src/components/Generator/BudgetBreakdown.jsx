import { z } from "zod";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

export const BudgetBreakdown = ({
    totalBudget = 2000,
    spent = 1450,
    furniture = 1200,
    decor = 500,
    labor = 300
}) => {
    const data = [
        { name: "Furniture", value: furniture, color: "#3B82F6" },
        { name: "Decor", value: decor, color: "#6366F1" },
        { name: "Labor", value: labor, color: "#EC4899" },
    ];

    const remaining = totalBudget - spent;

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
                <div className="flex space-x-3 pt-4 border-t border-gray-100">
                    <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-light text-sm">
                        📥 Export PDF
                    </button>
                    <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-light text-sm">
                        📊 Full Report
                    </button>
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
});
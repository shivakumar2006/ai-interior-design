import { z } from "zod";

export const Stats = ({ title = "Metric", value = "0", unit = "", trend = null, icon = "📊" }) => {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">{icon}</span>
                        <p className="text-gray-600 text-sm font-light">{title}</p>
                    </div>
                    {trend && (
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${trend > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}>
                            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
                        </span>
                    )}
                </div>
                <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-light text-gray-900">{value}</span>
                    {unit && <span className="text-gray-500 text-sm font-light">{unit}</span>}
                </div>
            </div>
        </div>
    );
};

export const StatsSchema = z.object({
    title: z.string().describe("Metric title").optional().default("Metric"),
    value: z.string().describe("Metric value").optional().default("0"),
    unit: z.string().describe("Unit of measurement").optional().default(""),
    trend: z.number().describe("Trend percentage (positive or negative)").optional().default(null),
    icon: z.string().describe("Emoji icon").optional().default("📊"),
});
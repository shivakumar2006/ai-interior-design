import { z } from "zod";

export const Alert = ({ title = "Alert", message = "This is an alert", type = "info" }) => {
    const typeStyles = {
        info: "bg-blue-50 border-blue-200 text-blue-900",
        success: "bg-green-50 border-green-200 text-green-900",
        warning: "bg-amber-50 border-amber-200 text-amber-900",
        error: "bg-red-50 border-red-200 text-red-900",
    };

    const iconStyles = {
        info: "text-blue-500",
        success: "text-green-500",
        warning: "text-amber-500",
        error: "text-red-500",
    };

    const icons = {
        info: "ℹ️",
        success: "✓",
        warning: "⚠️",
        error: "✕",
    };

    return (
        <div className={`border border-l-4 rounded-xl p-5 ${typeStyles[type]}`}>
            <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 text-2xl ${iconStyles[type]}`}>
                    {icons[type]}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-sm">{title}</h4>
                    <p className="text-sm font-light mt-1">{message}</p>
                </div>
            </div>
        </div>
    );
};

export const AlertSchema = z.object({
    title: z.string().describe("Alert title").optional().default("Alert"),
    message: z.string().describe("Alert message").optional().default("This is an alert"),
    type: z.enum(["info", "success", "warning", "error"]).describe("Alert type").optional().default("info"),
});
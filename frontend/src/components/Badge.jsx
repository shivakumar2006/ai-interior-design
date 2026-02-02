import { z } from "zod";

export const Badge = ({ label = "Badge", color = "gray", variant = "solid" }) => {
    const solidStyles = {
        gray: "bg-gray-100 text-gray-900",
        blue: "bg-blue-100 text-blue-900",
        red: "bg-red-100 text-red-900",
        green: "bg-green-100 text-green-900",
        amber: "bg-amber-100 text-amber-900",
        purple: "bg-purple-100 text-purple-900",
    };

    const outlineStyles = {
        gray: "bg-white border border-gray-300 text-gray-900",
        blue: "bg-white border border-blue-300 text-blue-900",
        red: "bg-white border border-red-300 text-red-900",
        green: "bg-white border border-green-300 text-green-900",
        amber: "bg-white border border-amber-300 text-amber-900",
        purple: "bg-white border border-purple-300 text-purple-900",
    };

    const styles = variant === "outline" ? outlineStyles[color] : solidStyles[color];

    return (
        <span className={`${styles} px-4 py-1.5 rounded-full font-light text-sm inline-block`}>
            {label}
        </span>
    );
};

export const BadgeSchema = z.object({
    label: z.string().describe("Badge text").optional().default("Badge"),
    color: z.enum(["gray", "blue", "red", "green", "amber", "purple"]).describe("Badge color").optional().default("gray"),
    variant: z.enum(["solid", "outline"]).describe("Badge style").optional().default("solid"),
});
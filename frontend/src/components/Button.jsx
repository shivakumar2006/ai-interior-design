import { z } from "zod";

export const Button = ({ text = "Click me", variant = "primary", size = "medium" }) => {
    const variantStyles = {
        primary: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm hover:shadow-md",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200",
        outline: "bg-white border-2 border-gray-200 text-gray-900 hover:border-gray-300",
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md",
    };

    const sizeStyles = {
        small: "px-4 py-2 text-sm",
        medium: "px-6 py-3 text-base",
        large: "px-8 py-4 text-lg",
    };

    return (
        <button className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-full font-light transition`}>
            {text}
        </button>
    );
};

export const ButtonSchema = z.object({
    text: z.string().describe("Button label text").optional().default("Click me"),
    variant: z.enum(["primary", "secondary", "outline", "danger"]).describe("Button style variant").optional().default("primary"),
    size: z.enum(["small", "medium", "large"]).describe("Button size").optional().default("medium"),
});
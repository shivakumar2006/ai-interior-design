import { z } from "zod";

export const Card = ({ title = "Untitled", description = "No description", icon = null }) => (
    <div className="w-full">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="space-y-4">
                {icon && (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-2xl">
                        {icon}
                    </div>
                )}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                        {title}
                    </h3>
                    <div className="h-0.5 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-3"></div>
                </div>

                <p className="text-gray-600 font-light leading-relaxed text-base">
                    {description}
                </p>
            </div>
        </div>
    </div>
);

export const CardSchema = z.object({
    title: z.string().describe("The card title").optional().default("Untitled"),
    description: z.string().describe("The card description").optional().default("No description"),
    icon: z.string().describe("Optional emoji or icon").optional().default(null),
});
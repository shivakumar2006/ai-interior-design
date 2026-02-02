import { z } from "zod";

export const Features = ({
    title = "Features",
    description = "Everything you need"
}) => {
    const features = [
        { icon: "⚡", name: "Fast", desc: "Lightning quick performance" },
        { icon: "🔒", name: "Secure", desc: "Enterprise-grade security" },
        { icon: "📱", name: "Responsive", desc: "Works on all devices" },
    ];

    return (
        <div className="py-12">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-light text-gray-900 mb-4">{title}</h2>
                <p className="text-gray-600 font-light text-lg">{description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition">
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h3>
                        <p className="text-gray-600 font-light">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const FeaturesSchema = z.object({
    title: z.string().describe("Section title").optional().default("Features"),
    description: z.string().describe("Section description").optional().default("Everything you need"),
});
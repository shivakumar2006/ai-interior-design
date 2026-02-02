import { z } from "zod";

export const ColorPalette = ({
    primary = "#3B82F6",
    secondary = "#6366F1",
    accent = "#EC4899",
    neutral = "#F3F4F6",
    dark = "#1F2937",
    paletteName = "Modern Blue"
}) => {
    const colors = [
        { name: "Primary", hex: primary, description: "Main color for walls" },
        { name: "Secondary", hex: secondary, description: "Accent walls" },
        { name: "Accent", hex: accent, description: "Decorative elements" },
        { name: "Neutral", hex: neutral, description: "Background surfaces" },
        { name: "Dark", hex: dark, description: "Text and details" },
    ];

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">Color Palette</h3>
                    <p className="text-gray-600 font-light">{paletteName}</p>
                </div>

                {/* Large Color Preview */}
                <div className="grid grid-cols-5 gap-4">
                    {colors.map((color) => (
                        <div key={color.name} className="space-y-2">
                            {/* Color Swatch */}
                            <div
                                className="w-full aspect-square rounded-2xl border-2 border-gray-200 hover:border-gray-400 transition shadow-sm hover:shadow-md cursor-pointer"
                                style={{ backgroundColor: color.hex }}
                                title={color.hex}
                            />
                            {/* Label */}
                            <div>
                                <p className="font-semibold text-sm text-gray-900">{color.name}</p>
                                <p className="text-xs text-gray-500 font-light">{color.description}</p>
                                <p className="text-xs font-mono text-gray-400 mt-1">{color.hex.toUpperCase()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Color Info Grid */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Usage Guide</h4>
                    <div className="space-y-3">
                        <div className="flex items-start space-x-4 p-3 border border-gray-200 rounded-lg">
                            <div
                                className="w-6 h-6 rounded flex-shrink-0"
                                style={{ backgroundColor: primary }}
                            />
                            <div>
                                <p className="font-light text-sm text-gray-900">Primary Color</p>
                                <p className="text-xs text-gray-500">Use for main walls, large furniture pieces</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-3 border border-gray-200 rounded-lg">
                            <div
                                className="w-6 h-6 rounded flex-shrink-0"
                                style={{ backgroundColor: secondary }}
                            />
                            <div>
                                <p className="font-light text-sm text-gray-900">Secondary Color</p>
                                <p className="text-xs text-gray-500">Use for accent walls, medium furnishings</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-3 border border-gray-200 rounded-lg">
                            <div
                                className="w-6 h-6 rounded flex-shrink-0"
                                style={{ backgroundColor: accent }}
                            />
                            <div>
                                <p className="font-light text-sm text-gray-900">Accent Color</p>
                                <p className="text-xs text-gray-500">Use for decorative items, artwork</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Room */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Room Preview</h4>
                    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ backgroundColor: neutral }}>
                        <div className="p-8 space-y-4">
                            {/* Wall */}
                            <div
                                className="rounded-lg p-6 text-white flex items-center justify-center font-light"
                                style={{ backgroundColor: primary, minHeight: "150px" }}
                            >
                                Wall
                            </div>

                            {/* Furniture Layout */}
                            <div className="grid grid-cols-3 gap-3">
                                <div
                                    className="rounded-lg p-4 text-white flex items-center justify-center text-sm font-light"
                                    style={{ backgroundColor: secondary }}
                                >
                                    Sofa
                                </div>
                                <div
                                    className="rounded-lg p-4 text-white flex items-center justify-center text-sm font-light"
                                    style={{ backgroundColor: accent }}
                                >
                                    Lamp
                                </div>
                                <div
                                    className="rounded-lg p-4 text-gray-900 flex items-center justify-center text-sm font-light"
                                    style={{ backgroundColor: "#E5E7EB" }}
                                >
                                    Table
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Export Button */}
                <button className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-light text-sm">
                    🎨 Export Color Codes
                </button>
            </div>
        </div>
    );
};

export const ColorPaletteSchema = z.object({
    primary: z.string().describe("Primary color hex code").optional().default("#3B82F6"),
    secondary: z.string().describe("Secondary color hex code").optional().default("#6366F1"),
    accent: z.string().describe("Accent color hex code").optional().default("#EC4899"),
    neutral: z.string().describe("Neutral background color").optional().default("#F3F4F6"),
    dark: z.string().describe("Dark text color").optional().default("#1F2937"),
    paletteName: z.string().describe("Name of the palette").optional().default("Modern Blue"),
});
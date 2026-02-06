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
        <div className="w-full bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 border-2 border-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="space-y-8">
                {/* ===== HEADER SECTION ===== */}
                <div className="space-y-3 pb-6 border-b-2 border-gray-200">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🎨</span>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Color Palette</h3>
                            <p className="text-gray-600 font-light mt-1">{paletteName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 px-3 py-1.5 rounded-full w-fit">
                        <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                        <span className="text-purple-700 font-semibold">Professional Color Scheme</span>
                    </div>
                </div>

                {/* ===== LARGE COLOR PREVIEW - ENHANCED ===== */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <span>🌈</span>
                            Color Swatches
                        </h4>
                        <p className="text-xs text-gray-600 font-light">Click to copy hex code</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {colors.map((color) => (
                            <div key={color.name} className="group space-y-3">
                                {/* Color Swatch */}
                                <div
                                    className="relative w-full aspect-square rounded-2xl border-2 border-gray-300 hover:border-gray-500 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer overflow-hidden group-hover:scale-105"
                                    style={{ backgroundColor: color.hex }}
                                    title={`Click to copy ${color.hex}`}
                                    onClick={() => {
                                        navigator.clipboard.writeText(color.hex);
                                    }}
                                >
                                    {/* OVERLAY ON HOVER */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-white text-center">
                                            <p className="text-xs font-bold">Click to copy</p>
                                            <p className="text-xs font-mono mt-1">{color.hex}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Label */}
                                <div className="space-y-1">
                                    <p className="font-bold text-sm text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                                        {color.name}
                                    </p>
                                    <p className="text-xs text-gray-600 font-light">{color.description}</p>
                                    <p className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors duration-300 inline-block mt-1">
                                        {color.hex.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== COLOR INFO GRID - ENHANCED ===== */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <span>📖</span>
                        Usage Guide
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* PRIMARY COLOR */}
                        <div className="relative group overflow-hidden rounded-xl p-5 bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full -mr-10 -mt-10 opacity-20 group-hover:scale-125 transition-transform duration-300"></div>
                            <div className="relative space-y-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg shadow-md border-2 border-gray-300"
                                        style={{ backgroundColor: primary }}
                                    />
                                    <p className="font-bold text-gray-900">Primary Color</p>
                                </div>
                                <p className="text-sm text-gray-700 font-light leading-relaxed">
                                    Use for main walls, large furniture pieces, and dominant design elements
                                </p>
                                <div className="pt-2 border-t border-gray-200">
                                    <p className="text-xs text-gray-600 font-semibold">🎯 Best For:</p>
                                    <p className="text-xs text-gray-600 font-light mt-1">Walls, large sofas, rugs</p>
                                </div>
                            </div>
                        </div>

                        {/* SECONDARY COLOR */}
                        <div className="relative group overflow-hidden rounded-xl p-5 bg-white border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full -mr-10 -mt-10 opacity-20 group-hover:scale-125 transition-transform duration-300"></div>
                            <div className="relative space-y-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg shadow-md border-2 border-gray-300"
                                        style={{ backgroundColor: secondary }}
                                    />
                                    <p className="font-bold text-gray-900">Secondary Color</p>
                                </div>
                                <p className="text-sm text-gray-700 font-light leading-relaxed">
                                    Use for accent walls, medium furnishings, and complementary pieces
                                </p>
                                <div className="pt-2 border-t border-gray-200">
                                    <p className="text-xs text-gray-600 font-semibold">🎯 Best For:</p>
                                    <p className="text-xs text-gray-600 font-light mt-1">Accent walls, chairs, cushions</p>
                                </div>
                            </div>
                        </div>

                        {/* ACCENT COLOR */}
                        <div className="relative group overflow-hidden rounded-xl p-5 bg-white border-2 border-gray-200 hover:border-pink-400 hover:shadow-lg transition-all duration-300">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-200 rounded-full -mr-10 -mt-10 opacity-20 group-hover:scale-125 transition-transform duration-300"></div>
                            <div className="relative space-y-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg shadow-md border-2 border-gray-300"
                                        style={{ backgroundColor: accent }}
                                    />
                                    <p className="font-bold text-gray-900">Accent Color</p>
                                </div>
                                <p className="text-sm text-gray-700 font-light leading-relaxed">
                                    Use for decorative items, artwork, and eye-catching accents
                                </p>
                                <div className="pt-2 border-t border-gray-200">
                                    <p className="text-xs text-gray-600 font-semibold">🎯 Best For:</p>
                                    <p className="text-xs text-gray-600 font-light mt-1">Lamps, plants, artwork</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== PREVIEW ROOM - ENHANCED ===== */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <span>🏠</span>
                        Room Preview
                    </h4>

                    <div className="relative rounded-2xl overflow-hidden border-2 border-gray-300 shadow-xl">
                        {/* BACKGROUND */}
                        <div
                            className="p-8 space-y-4 min-h-96"
                            style={{ backgroundColor: neutral }}
                        >
                            {/* WALL - ENHANCED */}
                            <div
                                className="rounded-2xl p-8 text-white flex items-center justify-center font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 relative group overflow-hidden"
                                style={{ backgroundColor: primary, minHeight: "180px" }}
                            >
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                                <div className="relative text-center">
                                    <p className="text-2xl font-bold">Wall</p>
                                    <p className="text-xs text-white/80 mt-2">Primary Color</p>
                                </div>
                            </div>

                            {/* FURNITURE LAYOUT - ENHANCED */}
                            <div className="grid grid-cols-3 gap-4">
                                {/* SOFA */}
                                <div
                                    className="rounded-2xl p-6 text-white flex flex-col items-center justify-center text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 relative group overflow-hidden hover:scale-105"
                                    style={{ backgroundColor: secondary, minHeight: "120px" }}
                                >
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                                    <div className="relative text-center space-y-1">
                                        <p className="text-xl">🛋️</p>
                                        <p>Sofa</p>
                                        <p className="text-xs text-white/80 font-light">Secondary</p>
                                    </div>
                                </div>

                                {/* LAMP */}
                                <div
                                    className="rounded-2xl p-6 text-white flex flex-col items-center justify-center text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 relative group overflow-hidden hover:scale-105"
                                    style={{ backgroundColor: accent, minHeight: "120px" }}
                                >
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                                    <div className="relative text-center space-y-1">
                                        <p className="text-xl">💡</p>
                                        <p>Lamp</p>
                                        <p className="text-xs text-white/80 font-light">Accent</p>
                                    </div>
                                </div>

                                {/* TABLE */}
                                <div
                                    className="rounded-2xl p-6 text-gray-900 flex flex-col items-center justify-center text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 relative group overflow-hidden hover:scale-105"
                                    style={{ backgroundColor: "#E5E7EB" }}
                                >
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
                                    <div className="relative text-center space-y-1">
                                        <p className="text-xl">🪑</p>
                                        <p>Table</p>
                                        <p className="text-xs text-gray-600 font-light">Neutral</p>
                                    </div>
                                </div>
                            </div>

                            {/* LEGEND */}
                            <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-300">
                                <p className="text-xs font-bold text-gray-900 mb-2">Color Distribution:</p>
                                <div className="flex gap-4 flex-wrap text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: primary }}></div>
                                        <span className="text-gray-700">Primary 40%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: secondary }}></div>
                                        <span className="text-gray-700">Secondary 30%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: accent }}></div>
                                        <span className="text-gray-700">Accent 15%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: "#E5E7EB" }}></div>
                                        <span className="text-gray-700">Neutral 15%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== COLOR HARMONY INFO ===== */}
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <div className="space-y-3">
                        <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                            <span>✨</span>
                            Color Harmony
                        </p>
                        <p className="text-sm text-blue-800 font-light">
                            This palette uses a harmonious color scheme with complementary colors that work together to create a balanced, professional interior design. The primary color dominates, secondary provides contrast, and accents add visual interest.
                        </p>
                    </div>
                </div>

                {/* ===== ACTION BUTTONS ===== */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-200">
                    {/* EXPORT BUTTON */}
                    <div className="flex-1 group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        <button
                            onClick={() => {
                                const colorCodes = colors.map(c => `${c.name}: ${c.hex}`).join('\n');
                                navigator.clipboard.writeText(colorCodes);
                            }}
                            className="relative w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95"
                        >
                            <span className="text-xl">🎨</span>
                            <div>
                                <p className="font-bold">Export Color Codes</p>
                                <p className="text-xs text-purple-100 font-light">Copy all hex values</p>
                            </div>
                        </button>
                    </div>

                    {/* DOWNLOAD BUTTON */}
                    <button className="flex-1 px-6 py-4 border-2 border-gray-300 hover:border-purple-400 text-gray-900 hover:text-purple-700 rounded-lg font-bold transition-all duration-300 hover:bg-purple-50 flex items-center justify-center gap-2 active:scale-95">
                        <span className="text-xl">📥</span>
                        <div>
                            <p className="font-bold">Download Palette</p>
                            <p className="text-xs text-gray-600 font-light hidden sm:block">As image</p>
                        </div>
                    </button>
                </div>

                {/* ===== PRO TIP ===== */}
                <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                    <div className="flex gap-3">
                        <span className="text-2xl flex-shrink-0">💡</span>
                        <div>
                            <p className="text-sm font-bold text-amber-900 mb-1">Pro Tip</p>
                            <p className="text-sm text-amber-800 font-light">
                                Use the 60-30-10 rule: 60% primary color, 30% secondary, and 10% accent colors for the most balanced interior design!
                            </p>
                        </div>
                    </div>
                </div>
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
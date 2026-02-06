import { useState } from "react";
import { z } from "zod";

export const DesignComparison = ({
    roomName = "Bedroom",
    luxuryDesign = {},
    budgetDesign = {},
    minimalistDesign = {},
}) => {
    const [activeTab, setActiveTab] = useState("luxury");

    const designs = {
        luxury: {
            name: "Luxury",
            icon: "👑",
            description: "Premium materials, designer pieces",
            price: luxuryDesign.totalPrice || 8500,
            colors: luxuryDesign.colors || {
                primary: "#faf8f3",
                secondary: "#d4c4b0",
                accent: "#b5a642",
            },
            highlights: [
                "Italian leather sofa",
                "Marble accents",
                "Designer lighting",
                "Premium finishes",
                "Luxury bedding",
            ],
            best_for: "Those who want the best",
            component: luxuryDesign.component,
        },
        budget: {
            name: "Budget",
            icon: "💰",
            description: "Smart choices, great value",
            price: budgetDesign.totalPrice || 1350,
            colors: {
                primary: "#f0f0f0",
                secondary: "#e0e0e0",
                accent: "#606060",
            },
            highlights: [
                "Quality affordable furniture",
                "Smart storage",
                "Functional design",
                "Great value for money",
                "Easy maintenance",
            ],
            best_for: "Budget-conscious shoppers",
            component: budgetDesign.component,
        },
        minimalist: {
            name: "Minimalist",
            icon: "📐",
            description: "Essential items, clean aesthetic",
            price: minimalistDesign.totalPrice || 630,
            colors: {
                primary: "#ffffff",
                secondary: "#f5f5f5",
                accent: "#000000",
            },
            highlights: [
                "Minimal clutter",
                "Zen aesthetic",
                "Space-saving design",
                "Easy to clean",
                "Peaceful atmosphere",
            ],
            best_for: "Simplicity lovers",
            component: minimalistDesign.component,
        },
    };

    const currentDesign = designs[activeTab];

    return (
        <div className="w-full space-y-8">
            {/* ===== TABS - ENHANCED ===== */}
            <div className="relative">
                {/* BACKGROUND DECORATION */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 via-blue-100/20 to-pink-100/20 rounded-2xl blur-xl pointer-events-none"></div>

                <div className="relative flex gap-2 bg-white/70 backdrop-blur-sm p-2 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300">
                    {Object.entries(designs).map(([key, design]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 relative group
                            ${activeTab === key
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                                    : "bg-transparent text-gray-700 hover:text-gray-950 hover:bg-white/50"
                                }
                        `}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span className={`text-2xl transition-transform duration-300 ${activeTab === key ? 'scale-125' : 'group-hover:scale-110'}`}>
                                    {design.icon}
                                </span>
                                <div className="text-left">
                                    <p className="font-bold text-sm">{design.name}</p>
                                    <p className={`text-xs font-light ${activeTab === key ? 'text-purple-100' : 'text-gray-600'}`}>
                                        ${design.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* ===== DESIGN DISPLAY ===== */}
            <div className="space-y-6">
                {/* HEADER WITH ANIMATION */}
                <div className="space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{currentDesign.icon}</span>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-950">
                                {roomName}
                            </h3>
                            <p className="text-sm text-gray-600 font-light">
                                {currentDesign.name} Style • {currentDesign.description.substring(0, 50)}...
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3D ROOM - ENHANCED */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <span>🎨</span>
                            3D Room Preview
                        </p>
                        <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                            Interactive
                        </span>
                    </div>

                    {currentDesign.component ? (
                        <div className="rounded-2xl overflow-hidden border-2 border-gray-300 shadow-xl hover:shadow-2xl transition-all duration-300">
                            {currentDesign.component}
                        </div>
                    ) : (
                        <div className="relative h-96 rounded-2xl overflow-hidden border-2 border-gray-300 shadow-xl group"
                            style={{
                                backgroundImage: `linear-gradient(135deg, ${currentDesign.colors.primary}30 0%, ${currentDesign.colors.secondary}30 100%)`
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center space-y-3">
                                    <p className="text-5xl">{currentDesign.icon}</p>
                                    <p className="text-2xl font-light text-gray-700">3D Room Preview</p>
                                    <p className="text-sm text-gray-600 font-light">Interact with the room to explore</p>
                                </div>
                            </div>
                            <div className="absolute inset-0 group-hover:bg-black/5 transition-colors duration-300"></div>
                        </div>
                    )}
                </div>

                {/* INFO CARD - ENHANCED */}
                <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 space-y-6">
                    {/* PRICE SECTION */}
                    <div className="pb-6 border-b-2 border-gray-200">
                        <p className="text-gray-700 font-light text-sm uppercase tracking-wide mb-2">Total Investment</p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                ${currentDesign.price.toLocaleString()}
                            </span>
                            <div className="space-y-1">
                                <p className="text-xs text-green-600 font-bold">✓ Best Value</p>
                                <p className="text-xs text-gray-600">Complete setup</p>
                            </div>
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-gray-700 font-light leading-relaxed text-base">
                        {currentDesign.description}
                    </p>

                    {/* BEST FOR - ENHANCED */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 group hover:shadow-md transition-all duration-300">
                        <p className="text-xs text-blue-700 font-bold uppercase tracking-wide mb-2">Perfect For</p>
                        <p className="text-sm text-blue-900 font-semibold">{currentDesign.best_for}</p>
                    </div>

                    {/* HIGHLIGHTS - ENHANCED */}
                    <div className="space-y-3">
                        <p className="text-sm font-bold text-gray-950 flex items-center gap-2">
                            <span>⭐</span>
                            Key Highlights
                        </p>
                        <ul className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {currentDesign.highlights.map((highlight, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                    <span className="text-green-500 font-bold text-lg mt-0.5 flex-shrink-0">✓</span>
                                    <span className="text-sm text-gray-700 font-light leading-relaxed">{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLOR PALETTE - ENHANCED */}
                    <div className="space-y-4 pt-6 border-t-2 border-gray-200">
                        <p className="text-sm font-bold text-gray-950 flex items-center gap-2">
                            <span>🎨</span>
                            Color Scheme
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            {Object.entries(currentDesign.colors).map(([name, color]) => (
                                <div key={name} className="flex flex-col items-center gap-2 group">
                                    <div className="relative">
                                        <div
                                            className="w-16 h-16 rounded-xl border-2 border-gray-300 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 cursor-pointer"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-white border border-gray-200 rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-xs font-mono text-gray-700">{color}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-700 font-semibold capitalize text-center">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA BUTTONS - ENHANCED */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-200">
                        {/* PRIMARY BUTTON */}
                        <div className="flex-1 group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                            <button className="relative w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95">
                                <span className="text-xl">🛍️</span>
                                <div>
                                    <p className="font-bold">Buy Everything</p>
                                    <p className="text-xs text-purple-100 font-light">Complete design set</p>
                                </div>
                            </button>
                        </div>

                        {/* SECONDARY BUTTON */}
                        <button className="flex-1 px-6 py-4 border-2 border-gray-300 hover:border-purple-400 text-gray-900 hover:text-purple-700 rounded-xl font-bold transition-all duration-300 hover:bg-purple-50 flex items-center justify-center gap-2 active:scale-95">
                            <span className="text-xl">❤️</span>
                            <div>
                                <p className="font-bold">Save Design</p>
                                <p className="text-xs text-gray-600 font-light hidden sm:block">For later</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* COMPARISON TABLE - ENHANCED */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">📊</span>
                        <h4 className="font-bold text-2xl text-gray-950">Compare All 3 Styles</h4>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border-2 border-gray-200 shadow-lg">
                        <table className="w-full text-sm bg-white">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-b-2 border-gray-200">
                                    <th className="text-left py-4 px-6 font-bold">Aspect</th>
                                    <th className="text-center py-4 px-6 font-bold">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-xl">👑</span>
                                            Luxury
                                        </div>
                                    </th>
                                    <th className="text-center py-4 px-6 font-bold">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-xl">💰</span>
                                            Budget
                                        </div>
                                    </th>
                                    <th className="text-center py-4 px-6 font-bold">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-xl">📐</span>
                                            Minimalist
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200 hover:bg-purple-50/30 transition-colors duration-300 group">
                                    <td className="py-4 px-6 text-gray-900 font-semibold">Price</td>
                                    <td className="text-center py-4 px-6">
                                        <span className="text-lg font-bold text-gray-950">${designs.luxury.price.toLocaleString()}</span>
                                    </td>
                                    <td className="text-center py-4 px-6">
                                        <span className="text-lg font-bold text-green-600">${designs.budget.price.toLocaleString()}</span>
                                    </td>
                                    <td className="text-center py-4 px-6">
                                        <span className="text-lg font-bold text-blue-600">${designs.minimalist.price.toLocaleString()}</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-200 hover:bg-purple-50/30 transition-colors duration-300">
                                    <td className="py-4 px-6 text-gray-900 font-semibold">Best For</td>
                                    <td className="text-center py-4 px-6">
                                        <span className="text-sm font-medium text-gray-700 bg-purple-100 px-3 py-1 rounded-full inline-block">Premium Taste</span>
                                    </td>
                                    <td className="text-center py-4 px-6">
                                        <span className="text-sm font-medium text-gray-700 bg-green-100 px-3 py-1 rounded-full inline-block">Value Seekers</span>
                                    </td>
                                    <td className="text-center py-4 px-6">
                                        <span className="text-sm font-medium text-gray-700 bg-blue-100 px-3 py-1 rounded-full inline-block">Minimalists</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-200 hover:bg-purple-50/30 transition-colors duration-300">
                                    <td className="py-4 px-6 text-gray-900 font-semibold">Design Feel</td>
                                    <td className="text-center py-4 px-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-gray-900">Opulent</p>
                                            <p className="text-xs text-gray-600">✨ Premium materials</p>
                                        </div>
                                    </td>
                                    <td className="text-center py-4 px-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-gray-900">Practical</p>
                                            <p className="text-xs text-gray-600">💡 Smart choices</p>
                                        </div>
                                    </td>
                                    <td className="text-center py-4 px-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-gray-900">Zen</p>
                                            <p className="text-xs text-gray-600">🧘 Clean & simple</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="hover:bg-purple-50/30 transition-colors duration-300">
                                    <td className="py-4 px-6 text-gray-900 font-semibold">Maintenance</td>
                                    <td className="text-center py-4 px-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-amber-600">High</p>
                                            <p className="text-xs text-gray-600">🧹 Regular care needed</p>
                                        </div>
                                    </td>
                                    <td className="text-center py-4 px-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-orange-600">Medium</p>
                                            <p className="text-xs text-gray-600">🔄 Some upkeep</p>
                                        </div>
                                    </td>
                                    <td className="text-center py-4 px-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-green-600">Easy</p>
                                            <p className="text-xs text-gray-600">✓ Low effort</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* TABLE FOOTER HINT */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                        <p className="text-xs text-blue-900 font-semibold flex items-center gap-2">
                            <span>💡</span>
                            Pro Tip: Hover over table rows to see more details. Each style has unique advantages based on your lifestyle!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DesignComparisonSchema = z.object({
    roomName: z.string().describe("Name of the room").optional().default("Bedroom"),
    luxuryDesign: z.object({
        totalPrice: z.number().optional(),
        colors: z.object({}).optional(),
        component: z.any().optional(),
    }).optional(),
    budgetDesign: z.object({
        totalPrice: z.number().optional(),
        colors: z.object({}).optional(),
        component: z.any().optional(),
    }).optional(),
    minimalistDesign: z.object({
        totalPrice: z.number().optional(),
        colors: z.object({}).optional(),
        component: z.any().optional(),
    }).optional(),
});
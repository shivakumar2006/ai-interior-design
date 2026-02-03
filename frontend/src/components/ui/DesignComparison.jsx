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
        <div className="w-full space-y-6">
            {/* TABS */}
            <div className="flex gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                {Object.entries(designs).map(([key, design]) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${activeTab === key
                            ? "bg-white text-gray-950 shadow-sm"
                            : "bg-transparent text-gray-600 hover:text-gray-950"
                            }`}
                    >
                        <span className="text-lg mr-2">{design.icon}</span>
                        {design.name}
                    </button>
                ))}
            </div>

            {/* DESIGN DISPLAY */}
            <div className="space-y-6">
                {/* 3D ROOM */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-950">
                        {roomName} - {currentDesign.name} Style
                    </h3>

                    {currentDesign.component ? (
                        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                            {currentDesign.component}
                        </div>
                    ) : (
                        <div className="h-96 bg-gradient-to-br rounded-xl border border-gray-200 flex items-center justify-center"
                            style={{
                                backgroundImage: `linear-gradient(135deg, ${currentDesign.colors.primary} 0%, ${currentDesign.colors.secondary} 100%)`
                            }}
                        >
                            <p className="text-white text-lg font-light">3D Room Preview</p>
                        </div>
                    )}
                </div>

                {/* INFO CARD */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                    {/* PRICE */}
                    <div className="flex items-baseline justify-between pb-4 border-b border-gray-100">
                        <span className="text-gray-600 font-light">Total Investment</span>
                        <span className="text-3xl font-bold text-gray-950">
                            ${currentDesign.price.toLocaleString()}
                        </span>
                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-gray-600 font-light">{currentDesign.description}</p>

                    {/* BEST FOR */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-600 font-semibold">PERFECT FOR</p>
                        <p className="text-sm text-blue-900 mt-1">{currentDesign.best_for}</p>
                    </div>

                    {/* HIGHLIGHTS */}
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-950">Highlights</p>
                        <ul className="space-y-1">
                            {currentDesign.highlights.map((highlight, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">✓</span>
                                    <span className="text-sm text-gray-700 font-light">{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLOR PALETTE */}
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                        <p className="text-sm font-semibold text-gray-950">Color Scheme</p>
                        <div className="flex gap-2">
                            {Object.entries(currentDesign.colors).map(([name, color]) => (
                                <div key={name} className="flex flex-col items-center gap-1">
                                    <div
                                        className="w-12 h-12 rounded-lg border border-gray-200 shadow-sm"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-xs text-gray-500 font-light capitalize">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA BUTTONS */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-semibold text-sm">
                            👜 Buy Everything
                        </button>
                        <button className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-light text-sm">
                            ❤️ Save Design
                        </button>
                    </div>
                </div>

                {/* COMPARISON TABLE */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-950">Compare All 3 Styles</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-2 px-3 font-semibold text-gray-950">Aspect</th>
                                    <th className="text-center py-2 px-3 font-semibold text-gray-950">👑 Luxury</th>
                                    <th className="text-center py-2 px-3 font-semibold text-gray-950">💰 Budget</th>
                                    <th className="text-center py-2 px-3 font-semibold text-gray-950">📐 Minimalist</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-2 px-3 text-gray-700 font-light">Price</td>
                                    <td className="text-center py-2 px-3 font-semibold text-gray-950">${designs.luxury.price.toLocaleString()}</td>
                                    <td className="text-center py-2 px-3 font-semibold text-green-600">${designs.budget.price.toLocaleString()}</td>
                                    <td className="text-center py-2 px-3 font-semibold text-blue-600">${designs.minimalist.price.toLocaleString()}</td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-2 px-3 text-gray-700 font-light">Best For</td>
                                    <td className="text-center py-2 px-3 text-xs font-light">Premium taste</td>
                                    <td className="text-center py-2 px-3 text-xs font-light">Value seekers</td>
                                    <td className="text-center py-2 px-3 text-xs font-light">Minimalists</td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-2 px-3 text-gray-700 font-light">Design Feel</td>
                                    <td className="text-center py-2 px-3 text-xs font-light">Opulent</td>
                                    <td className="text-center py-2 px-3 text-xs font-light">Practical</td>
                                    <td className="text-center py-2 px-3 text-xs font-light">Zen</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-2 px-3 text-gray-700 font-light">Maintenance</td>
                                    <td className="text-center py-2 px-3 text-xs font-light">High</td>
                                    <td className="text-center py-2 px-3 text-xs font-light">Medium</td>
                                    <td className="text-center py-2 px-3 text-xs font-light">Easy</td>
                                </tr>
                            </tbody>
                        </table>
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
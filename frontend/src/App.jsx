import { useTamboThread } from "@tambo-ai/react";
import { useState, useMemo, useEffect } from "react";
import { Send, ChevronRight, Sparkles } from "lucide-react";
import StyledComponents from "./components/StyledComponents";
import "./App.css";

function App() {
    const { sendThreadMessage, thread, isLoading } = useTamboThread();
    const [inputValue, setInputValue] = useState("");
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [designStep, setDesignStep] = useState("brief");
    const [renderedDesign, setRenderedDesign] = useState(null);

    useEffect(() => {
        if (!thread?.messages) return;

        // Find latest assistant message WITH renderedComponent
        const messageWithComponent = [...thread.messages]
            .reverse()
            .find(
                (m) => m.role === "assistant" && m.renderedComponent
            );

        if (messageWithComponent) {
            setRenderedDesign(messageWithComponent.renderedComponent);
        }
    }, [thread]);

    const latestAssistantMessage = useMemo(() => {
        return thread?.messages
            ?.slice()
            .reverse()
            .find((m) => m.role === "assistant");
    }, [thread]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        sendThreadMessage(inputValue);
        setInputValue("");
        setDesignStep("viewing");
    };

    // Template prompts for quick design changes
    const designTemplates = [
        {
            label: "✨ Modern Minimalist",
            prompt: "Change to modern minimalist design with clean lines, neutral colors, and minimal furniture. Keep the 3D view and budget calculation, show me budget first of it and when i say yes then show me the color palettes chosen by you and let me choose those as well and then show me the room interior."
        },
        {
            label: "👑 Luxury Style",
            prompt: "Transform into luxury design with premium materials, gold accents, velvet textures, and high-end furniture, show me budget first of it and when i say yes then show me the color palettes chosen by you and let me choose those as well and then show me the room interior."
        },
        {
            label: "💰 Budget-Friendly",
            prompt: "Redesign as budget-friendly with affordable furniture, smart choices, and value-conscious styling. Keep quality high but prices low, show me budget first of it and when i say yes then show me the color palettes chosen by you and let me choose those as well and then show me the room interior."
        },
        // {
        //     label: "💼 Professional Office",
        //     prompt: "Transform into professional home office with productivity focus, ergonomic furniture, organized layout, and professional aesthetic."
        // }
    ];

    const handleTemplateClick = (prompt) => {
        sendThreadMessage(prompt);
        setDesignStep("viewing");
    };

    // Helper to safely render message content
    const renderMessageContent = (content) => {
        if (!content) return "";

        if (typeof content === "string") {
            return content;
        }

        if (Array.isArray(content)) {
            return content
                .map((c) => {
                    if (typeof c === "string") return c;
                    if (c && typeof c === "object" && c.text) return c.text;
                    return "";
                })
                .filter(Boolean)
                .join(" ");
        }

        if (typeof content === "object" && content.text) {
            return content.text;
        }

        return "";
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-white via-purple-50/20 to-blue-50/20">
            {/* ===== MAIN CONTENT AREA ===== */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* ===== ENHANCED HEADER ===== */}
                <header className="h-20 px-8 flex items-center justify-between border-b-2 border-gray-200 bg-white/95 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                        {/* AI LOGO - ENHANCED */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                            <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <Sparkles size={20} className="text-white" />
                            </div>
                        </div>

                        {/* TEXT */}
                        <div>
                            <h1 className="text-base font-bold tracking-wide text-gray-950">
                                AI INTERIOR DESIGNER
                            </h1>
                            <p className="text-xs text-gray-600 font-light">
                                ✨ Powered by Tambo AI
                            </p>
                        </div>
                    </div>

                    {/* TOGGLE BUTTON - ENHANCED */}
                    <button
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                        className="hidden md:flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:text-gray-950 font-semibold hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 rounded-lg transition-all duration-300 border border-gray-200 hover:border-purple-300"
                    >
                        {isPanelOpen ? "💬 Close Chat" : "💬 Open Chat"}
                        <ChevronRight
                            size={14}
                            className={`transition-transform duration-300 ${isPanelOpen ? "rotate-180" : ""}`}
                        />
                    </button>
                </header>

                {/* ===== MAIN CONTENT ===== */}
                <main className="flex-1 overflow-auto bg-gradient-to-b from-white via-purple-50/20 to-blue-50/30">
                    {designStep === "brief" ? (
                        // ===== LANDING PAGE - ENHANCED =====
                        <div className="h-full flex items-center justify-center px-8 py-12">
                            <div className="max-w-2xl text-center space-y-14 animate-fadeIn">
                                {/* AI BADGE - ENHANCED */}
                                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 border-2 border-purple-300 rounded-full px-5 py-3 w-fit mx-auto shadow-lg hover:shadow-xl transition-all duration-300 group cursor-default">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                                    <Sparkles size={16} className="text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                                    <span className="text-sm font-bold text-purple-700">
                                        AI-Powered Design Generator
                                    </span>
                                </div>

                                {/* HERO SECTION - ENHANCED */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h2 className="text-7xl font-bold text-gray-950 leading-tight tracking-tight">
                                            Design Your
                                            <br />
                                            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                                                Perfect Space
                                            </span>
                                        </h2>
                                    </div>
                                    <p className="text-lg font-light text-gray-700 leading-relaxed max-w-xl mx-auto">
                                        Create stunning interior designs with AI. Get personalized furniture recommendations, color palettes, 3D visualization, and complete budget breakdowns in seconds.
                                    </p>
                                </div>

                                {/* CTA BUTTON - ENHANCED */}
                                <div className="group relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                    <button
                                        onClick={() =>
                                            sendThreadMessage(
                                                "Design a modern minimalist bedroom. Budget: $2000. Include 3D room visualization, furniture suggestions, color palette, and complete layout recommendation."
                                            )
                                        }
                                        className="relative group/btn px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto active:scale-95 shadow-xl"
                                    >
                                        <span className="text-2xl group-hover/btn:scale-125 transition-transform duration-300">✨</span>
                                        Generate Design
                                        <ChevronRight
                                            size={20}
                                            className="group-hover/btn:translate-x-1 transition-transform duration-300"
                                        />
                                    </button>
                                </div>

                                {/* FEATURES - ENHANCED */}
                                <div className="grid grid-cols-3 gap-6 pt-12 border-t-2 border-gray-200">
                                    {[
                                        { icon: '🎨', title: 'Color Palettes', desc: 'AI-curated schemes' },
                                        { icon: '🛋️', title: 'Furniture', desc: 'Smart selections' },
                                        { icon: '💰', title: 'Budget', desc: 'Real-time costs' }
                                    ].map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="group p-4 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 border border-gray-200 hover:border-purple-300 transition-all duration-300 cursor-default"
                                        >
                                            <p className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">{feature.icon}</p>
                                            <p className="text-sm font-bold text-gray-950">{feature.title}</p>
                                            <p className="text-xs font-light text-gray-600 mt-1">{feature.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* ADDITIONAL INFO */}
                                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 max-w-xl mx-auto">
                                    <p className="text-sm text-blue-900 font-light flex items-center justify-center gap-2">
                                        <span>🚀</span>
                                        <span>Start with a template or describe your dream room in the chat panel</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // ===== DESIGN OUTPUT - ENHANCED =====
                        <div className="px-8 py-12">
                            <div className="max-w-5xl mx-auto">
                                {/* HEADER - ENHANCED */}
                                <div className="mb-10 flex items-center justify-between animate-fadeIn">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                                            <Sparkles size={18} className="text-purple-600" />
                                            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
                                                AI-Generated Design
                                            </span>
                                        </div>
                                        <h2 className="text-4xl font-bold text-gray-950 tracking-tight">
                                            Your Design
                                        </h2>
                                        <p className="text-base font-light text-gray-600 mt-3">
                                            Rendered with artificial intelligence • Fully customizable • Ready to shop
                                        </p>
                                    </div>
                                </div>

                                {/* CONTENT */}
                                {renderedDesign ? (
                                    <div className="space-y-10 animate-fadeIn">
                                        {Array.isArray(renderedDesign) ? (
                                            renderedDesign.map((component, idx) => (
                                                <div key={idx} className="hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                                                    {component}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                                                {renderedDesign}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full mt-20 flex justify-center items-center text-center py-20">
                                        <div className="space-y-15">
                                            <div className="flex justify-center">
                                                <StyledComponents />
                                            </div>
                                            <p className="text-lg text-gray-600 font-light">
                                                AI is generating your perfect design...
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>

                {/* ===== LOADING INDICATOR - ENHANCED ===== */}
                {isLoading && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 animate-fadeIn">
                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border-2 border-purple-300 shadow-2xl backdrop-blur-sm">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                            <span className="text-sm text-gray-700 font-semibold">AI generating your design...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ===== CHAT PANEL - ENHANCED ===== */}
            {isPanelOpen && (
                <aside className="w-96 border-l-2 border-gray-200 flex flex-col bg-gradient-to-b from-white to-gray-50/50 backdrop-blur-xl shadow-2xl animate-slideIn">
                    {/* HEADER - ENHANCED */}
                    <div className="h-20 px-6 flex items-center border-b-2 border-gray-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
                        <div>
                            <h3 className="text-sm font-bold text-gray-950">💬 CHAT WITH AI</h3>
                            <p className="text-xs text-gray-600 font-light mt-0.5">Refine & customize your design</p>
                        </div>
                    </div>

                    {/* MESSAGES - ENHANCED */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                        {thread?.messages && thread.messages.length > 0 ? (
                            thread.messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-3 rounded-xl text-sm font-light leading-relaxed break-words transition-all duration-300 ${msg.role === "user"
                                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl"
                                            : "bg-white text-gray-900 border-2 border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md"
                                            }`}
                                    >
                                        {renderMessageContent(msg.content)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-xs text-gray-500 text-center font-light">
                                    💡 Messages will appear here<br />
                                    <span className="text-xs text-gray-400">Use templates or type to get started</span>
                                </p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-start animate-fadeIn">
                                <div className="flex gap-1.5 bg-white px-4 py-3 rounded-xl border-2 border-gray-200 shadow-sm">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                    <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* TEMPLATES - ENHANCED */}
                    <div className="border-t-2 border-gray-200 px-4 py-4 space-y-3 bg-white/50 backdrop-blur-sm">
                        <p className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                            <span>⚡</span>
                            Quick Prompts
                        </p>
                        <div className="space-y-2">
                            {designTemplates.map((template, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleTemplateClick(template.prompt)}
                                    disabled={isLoading}
                                    className="w-full text-left px-3 py-2.5 text-xs font-light text-gray-700 bg-white hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 border-2 border-gray-200 hover:border-purple-400 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                                >
                                    {template.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* INPUT - ENHANCED */}
                    <form
                        onSubmit={handleSendMessage}
                        className="border-t-2 border-gray-200 p-4 bg-gradient-to-t from-gray-50 to-white"
                    >
                        <div className="flex gap-2">
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask for changes…"
                                className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 rounded-lg text-sm font-light placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all duration-300"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputValue.trim()}
                                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                            >
                                <Send size={18} className="text-white" />
                            </button>
                        </div>
                    </form>
                </aside>
            )}

            {/* ADD ANIMATIONS TO TAILWIND CONFIG */}
            <style>{`
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .animate-fadeIn {
                animation: fadeIn 0.5s ease-out;
            }

            .animate-slideIn {
                animation: slideIn 0.4s ease-out;
            }`}</style>
        </div>
    );
}

export default App;
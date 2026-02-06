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
        {
            label: "💼 Professional Office",
            prompt: "Transform into professional home office with productivity focus, ergonomic furniture, organized layout, and professional aesthetic."
        }
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
        <div className="flex h-screen bg-white">
            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* HEADER */}
                <header className="h-16 px-8 flex items-center justify-between border-b border-gray-100/80 bg-white/95 backdrop-blur">
                    <div className="flex items-center gap-3">
                        {/* AI LOGO */}
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Sparkles size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-semibold tracking-wide text-gray-950">
                                INTERIOR DESIGN
                            </h1>
                            <p className="text-xs text-gray-500 font-light">
                                Powered by AI
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsPanelOpen(!isPanelOpen)}
                        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-950 font-medium hover:bg-gray-50 rounded-lg transition"
                    >
                        {isPanelOpen ? "Close" : "Open"}
                        <ChevronRight size={14} className={`transition ${isPanelOpen ? "rotate-180" : ""}`} />
                    </button>
                </header>

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-auto bg-gradient-to-b from-white via-white to-gray-50/30">
                    {designStep === "brief" ? (
                        // LANDING PAGE
                        <div className="h-full flex items-center justify-center px-8">
                            <div className="max-w-xl text-center space-y-12">
                                {/* AI BADGE */}
                                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-full px-4 py-2 w-fit mx-auto">
                                    <Sparkles size={16} className="text-purple-600" />
                                    <span className="text-xs font-semibold text-purple-600">
                                        AI-Powered Design
                                    </span>
                                </div>

                                {/* HERO */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h2 className="text-6xl font-light text-gray-950 leading-tight tracking-tight">
                                            Design Your
                                            <br />
                                            <span className="text-gray-400">Perfect Space</span>
                                        </h2>
                                    </div>
                                    <p className="text-base font-light text-gray-600 leading-relaxed">
                                        Describe your room and let AI create personalized interior designs with furniture recommendations, color palettes, and budget breakdowns
                                    </p>
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={() =>
                                        sendThreadMessage(
                                            "Design a modern minimalist bedroom. Budget: $2000. Include 3D room visualization, furniture suggestions, color palette, and complete layout recommendation."
                                        )
                                    }
                                    className="group px-8 py-3.5 bg-gray-950 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition flex items-center justify-center gap-2 mx-auto cursor-pointer"
                                >
                                    Generate Design
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
                                </button>

                                {/* FEATURES */}
                                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                                    <div className="space-y-1">
                                        <p className="text-2xl">🎨</p>
                                        <p className="text-xs font-medium text-gray-950">Color Palettes</p>
                                        <p className="text-xs font-light text-gray-600">Curated schemes</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl">🛋️</p>
                                        <p className="text-xs font-medium text-gray-950">Furniture</p>
                                        <p className="text-xs font-light text-gray-600">AI selected</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl">💰</p>
                                        <p className="text-xs font-medium text-gray-950">Budget</p>
                                        <p className="text-xs font-light text-gray-600">Always smart</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // DESIGN OUTPUT
                        <div className="px-8 py-10">
                            <div className="max-w-4xl mx-auto">
                                {/* HEADER */}
                                <div className="mb-8 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Sparkles size={16} className="text-purple-600" />
                                            <span className="text-xs font-semibold text-purple-600">
                                                AI-GENERATED DESIGN
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-light text-gray-950 tracking-tight">
                                            Your Design
                                        </h2>
                                        <p className="text-sm font-light text-gray-600 mt-2">
                                            Rendered with artificial intelligence
                                        </p>
                                    </div>
                                </div>

                                {/* CONTENT */}
                                {renderedDesign ? (
                                    <div className="space-y-8">
                                        {Array.isArray(renderedDesign) ? (
                                            renderedDesign.map((component, idx) => (
                                                <div key={idx}>
                                                    {component}
                                                </div>
                                            ))
                                        ) : (
                                            renderedDesign
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full mt-50 flex justify-center items-center text-center py-12">
                                        <StyledComponents />
                                        {/* <p className="text-gray-400 font-light">
                                            Waiting for design…
                                        </p> */}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>

                {/* LOADING */}
                {isLoading && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
                        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-lg border border-gray-100 shadow-sm">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "120ms" }}></div>
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "240ms" }}></div>
                            </div>
                            <span className="text-xs text-gray-600 font-light">AI generating…</span>
                        </div>
                    </div>
                )}
            </div>

            {/* CHAT PANEL */}
            {isPanelOpen && (
                <aside className="w-96 border-l border-gray-100/80 flex flex-col bg-gray-50/50 backdrop-blur-sm">
                    {/* HEADER */}
                    <div className="h-16 px-6 flex items-center border-b border-gray-100/80">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-950">CHAT WITH AI</h3>
                            <p className="text-xs text-gray-500 font-light">Refine your design</p>
                        </div>
                    </div>

                    {/* MESSAGES */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                        {thread?.messages && thread.messages.length > 0 ? (
                            thread.messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2.5 rounded-lg text-sm font-light leading-relaxed break-words ${msg.role === "user"
                                            ? "bg-gray-950 text-white"
                                            : "bg-white text-gray-900 border border-gray-100"
                                            }`}
                                    >
                                        {renderMessageContent(msg.content)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 text-center py-10 font-light">
                                Messages appear here
                            </p>
                        )}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-1 bg-white px-4 py-2.5 rounded-lg border border-gray-100">
                                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "120ms" }}></div>
                                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "240ms" }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* TEMPLATES SECTION */}
                    <div className="border-t border-gray-100/80 px-4 py-3 space-y-2 bg-white/50">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Quick Prompts</p>
                        <div className="space-y-1.5">
                            {designTemplates.map((template, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleTemplateClick(template.prompt)}
                                    disabled={isLoading}
                                    className="w-full text-left px-3 py-2 text-xs font-light text-gray-700 bg-white hover:bg-purple-50 border border-gray-100 hover:border-purple-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {template.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* INPUT */}
                    <form
                        onSubmit={handleSendMessage}
                        className="border-t border-gray-100/80 p-4 bg-gray-50/50 backdrop-blur-sm"
                    >
                        <div className="flex gap-2">
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask for changes…"
                                className="flex-1 px-3.5 py-2.5 bg-white border border-gray-100 rounded-lg text-sm font-light placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/10 transition"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputValue.trim()}
                                className="px-3.5 py-2.5 bg-gray-950 text-white rounded-lg hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </aside>
            )}
        </div>
    );
}

export default App;
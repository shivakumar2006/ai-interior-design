import { useTamboThread } from "@tambo-ai/react";
import { useState } from "react";
import "./App.css";

function App() {
    const { sendThreadMessage, thread, isLoading } = useTamboThread();
    const [inputValue, setInputValue] = useState("");
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            sendThreadMessage(inputValue);
            setInputValue("");
        }
    };

    // Get ONLY the LATEST assistant message with renderedComponent
    const latestAssistantMessage = thread?.messages
        ?.slice()
        .reverse()
        .find((msg) => msg.role === "assistant" && msg.renderedComponent);

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* LEFT SIDE - FULL PAGE COMPONENT DISPLAY */}
            <div className={`flex-1 overflow-auto transition-all duration-300`}>
                <div className="w-full h-full flex flex-col">
                    {/* Header with Toggle Button */}
                    <div className="bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between sticky top-0 z-40">
                        <div>
                            <h1 className="text-3xl font-light tracking-tight text-gray-900">
                                Tambo UI Generator
                            </h1>
                            <p className="text-gray-500 text-sm font-light mt-1">
                                {latestAssistantMessage ? "Components loaded" : "No components yet"}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsPanelOpen(!isPanelOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                            title={isPanelOpen ? "Close chat" : "Open chat"}
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isPanelOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Main Content Area - Full Page with LATEST Component ONLY */}
                    <div className="flex-1 overflow-auto bg-gradient-to-b from-white to-gray-50 p-8">
                        {latestAssistantMessage ? (
                            <div className="max-w-7xl mx-auto">
                                {/* Display ONLY latest component */}
                                <div className="animate-fadeIn">
                                    {latestAssistantMessage.renderedComponent}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center">
                                <div className="text-center max-w-md">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-gray-900 font-light text-2xl mb-3">Start Building</h2>
                                    <p className="text-gray-500 text-sm font-light leading-relaxed">
                                        Use the chat panel to describe the components you want to create. They'll render here in full page view.
                                    </p>
                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-xs text-blue-900 font-light">
                                            💡 Try: "Create a header, hero section, 3 feature cards, and a footer"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
                                <div className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-200">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                    </div>
                                    <span className="text-gray-600 text-sm font-light">Generating...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - COLLAPSIBLE CHAT PANEL */}
            <div
                className={`${isPanelOpen ? "w-96" : "w-0"
                    } bg-white border-l border-gray-100 flex flex-col transition-all duration-300 overflow-hidden shadow-lg`}
            >
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-100 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
                    <p className="text-xs text-gray-500 font-light mt-1">Describe your components</p>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {thread?.messages && thread.messages.length > 0 ? (
                        thread.messages.map((message, idx) => (
                            <div key={idx} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`${message.role === "user"
                                        ? "bg-blue-500 text-white rounded-2xl px-4 py-2 max-w-xs"
                                        : "bg-gray-100 text-gray-800 rounded-2xl px-4 py-2 max-w-xs"
                                        }`}
                                >
                                    {Array.isArray(message.content) ? (
                                        message.content.map((part, i) => (
                                            <p key={i} className="text-sm font-light leading-relaxed">
                                                {part.text || part}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-sm font-light leading-relaxed">{message.content}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400 text-xs font-light">No messages yet</p>
                        </div>
                    )}

                    {/* Loading Indicator in Chat */}
                    {isLoading && (
                        <div className="flex justify-start pt-2">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Input */}
                <div className="bg-white border-t border-gray-100 px-6 py-4">
                    <form onSubmit={handleSendMessage} className="space-y-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Describe components..."
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-light"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 transition font-light text-sm"
                        >
                            {isLoading ? "Generating..." : "Send"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;
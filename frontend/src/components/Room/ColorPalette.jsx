import { useState } from "react";
import { z } from "zod";
import { Download, Copy, Check } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

export const ColorPalette = ({
    primary = "#3B82F6",
    secondary = "#6366F1",
    accent = "#EC4899",
    neutral = "#F3F4F6",
    dark = "#1F2937",
    paletteName = "Modern Blue"
}) => {
    const [copiedColor, setCopiedColor] = useState(null);

    const colors = [
        { name: "Primary", hex: primary, description: "Main color for walls" },
        { name: "Secondary", hex: secondary, description: "Accent walls" },
        { name: "Accent", hex: accent, description: "Decorative elements" },
        { name: "Neutral", hex: neutral, description: "Background surfaces" },
        { name: "Dark", hex: dark, description: "Text and details" },
    ];

    // ===== COPY COLOR HEX TO CLIPBOARD =====
    const copyColorHex = (hexCode, colorName) => {
        navigator.clipboard.writeText(hexCode);
        setCopiedColor(colorName);
        toast.success(`✅ Copied ${colorName} (${hexCode})`, {
            position: "top-right",
            autoClose: 2000,
        });
        setTimeout(() => setCopiedColor(null), 2000);
    };

    // ===== EXPORT ALL COLOR CODES =====
    const exportColorCodes = () => {
        try {
            const colorText = colors
                .map(c => `${c.name}: ${c.hex} (${c.description})`)
                .join('\n');

            const jsonData = {
                paletteName,
                colors: colors.reduce((acc, color) => {
                    acc[color.name.toLowerCase()] = {
                        hex: color.hex,
                        description: color.description
                    };
                    return acc;
                }, {})
            };

            // Copy to clipboard
            navigator.clipboard.writeText(colorText);

            // Create download link
            const textBlob = new Blob([colorText], { type: 'text/plain' });
            const textUrl = URL.createObjectURL(textBlob);
            const textLink = document.createElement('a');
            textLink.href = textUrl;
            textLink.download = `${paletteName}-ColorCodes.txt`;
            document.body.appendChild(textLink);
            textLink.click();
            document.body.removeChild(textLink);
            URL.revokeObjectURL(textUrl);

            toast.success("✅ Color codes exported and copied to clipboard!", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Export error:", error);
            toast.error("❌ Failed to export color codes", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    // ===== DOWNLOAD PALETTE AS IMAGE (SIMPLE VERSION) =====
    const downloadPaletteAsImage = () => {
        try {
            toast("📸 Generating palette image...", {
                position: "top-right",
                autoClose: 2000,
            });

            // Create canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = 1200;
            canvas.height = 800;

            // Background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Title
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 48px Arial, sans-serif';
            ctx.fillText(`${paletteName} Color Palette`, 50, 60);

            // Subtitle
            ctx.fillStyle = '#6b7280';
            ctx.font = '20px Arial, sans-serif';
            ctx.fillText('Professional Color Scheme', 50, 95);

            // Draw line
            ctx.strokeStyle = '#d1d5db';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(50, 110);
            ctx.lineTo(1150, 110);
            ctx.stroke();

            // Color swatches
            const swatchSize = 140;
            const swatchSpacing = 20;
            const startX = 50;
            const startY = 150;

            colors.forEach((color, index) => {
                const x = startX + (index * (swatchSize + swatchSpacing));
                const y = startY;

                // Color box
                ctx.fillStyle = color.hex;
                ctx.fillRect(x, y, swatchSize, swatchSize);

                // Border
                ctx.strokeStyle = '#d1d5db';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, swatchSize, swatchSize);

                // Color name (below swatch)
                ctx.fillStyle = '#1f2937';
                ctx.font = 'bold 16px Arial, sans-serif';
                ctx.fillText(color.name, x, y + swatchSize + 30);

                // Hex code (below name)
                ctx.fillStyle = '#6b7280';
                ctx.font = '14px monospace';
                ctx.fillText(color.hex, x, y + swatchSize + 55);
            });

            // Usage section
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 32px Arial, sans-serif';
            ctx.fillText('Usage Guide', 50, 450);

            // Usage descriptions
            const descriptions = [
                `Primary: ${colors[0].description}`,
                `Secondary: ${colors[1].description}`,
                `Accent: ${colors[2].description}`,
                `Neutral: ${colors[3].description}`,
                `Dark: ${colors[4].description}`,
            ];

            ctx.fillStyle = '#4b5563';
            ctx.font = '16px Arial, sans-serif';
            descriptions.forEach((desc, index) => {
                ctx.fillText(desc, 70, 490 + (index * 35));
            });

            // 60-30-10 Rule
            ctx.fillStyle = '#7c3aed';
            ctx.font = 'bold 18px Arial, sans-serif';
            ctx.fillText('Pro Tip: 60-30-10 Rule', 50, 750);

            ctx.fillStyle = '#4b5563';
            ctx.font = '14px Arial, sans-serif';
            ctx.fillText('60% Primary • 30% Secondary • 10% Accent', 250, 753);

            // Download the canvas as image
            canvas.toBlob((blob) => {
                if (!blob) {
                    toast.error("❌ Failed to create image", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                    return;
                }

                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${paletteName}-ColorPalette.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                toast.success("✅ Palette image downloaded successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }, 'image/png');

        } catch (error) {
            console.error("Download error:", error);
            toast.error("❌ Failed to download palette image", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    // ===== EXPORT PALETTE AS PDF =====
    const exportPaletteAsPDF = () => {
        try {
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            let yPosition = 20;

            // TITLE
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(24);
            pdf.setTextColor(51, 51, 51);
            pdf.text(`${paletteName}`, 20, yPosition);

            yPosition += 12;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(12);
            pdf.setTextColor(100, 100, 100);
            pdf.text("Color Palette Guide", 20, yPosition);

            // DIVIDER
            yPosition += 10;
            pdf.setDrawColor(180, 180, 180);
            pdf.line(20, yPosition, pageWidth - 20, yPosition);

            // COLOR SWATCHES WITH HEX CODES
            yPosition += 20;
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            pdf.setTextColor(51, 51, 51);
            pdf.text("Color Swatches", 20, yPosition);

            yPosition += 15;

            colors.forEach((color, index) => {
                // Color box
                pdf.setFillColor(
                    parseInt(color.hex.slice(1, 3), 16),
                    parseInt(color.hex.slice(3, 5), 16),
                    parseInt(color.hex.slice(5, 7), 16)
                );
                pdf.rect(20, yPosition - 5, 15, 15, "F");

                // Color name
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(11);
                pdf.setTextColor(51, 51, 51);
                pdf.text(color.name, 40, yPosition);

                // Hex code
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(10);
                pdf.setTextColor(100, 100, 100);
                pdf.text(color.hex, 95, yPosition);

                // Description
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(9);
                pdf.setTextColor(150, 150, 150);
                pdf.text(color.description, 40, yPosition + 6);

                yPosition += 18;
            });

            // COLOR USAGE SECTION
            yPosition += 10;
            pdf.setDrawColor(180, 180, 180);
            pdf.line(20, yPosition, pageWidth - 20, yPosition);

            yPosition += 12;
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            pdf.setTextColor(51, 51, 51);
            pdf.text("Usage Guide", 20, yPosition);

            yPosition += 10;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(80, 80, 80);

            const usageGuide = [
                "Primary Color: Use for main walls, large furniture pieces, and dominant design elements",
                "Secondary Color: Use for accent walls, medium furnishings, and complementary pieces",
                "Accent Color: Use for decorative items, artwork, and eye-catching accents",
                "Neutral Color: Use for background surfaces and balance",
                "Dark Color: Use for text, details, and contrast"
            ];

            usageGuide.forEach(guide => {
                const splitText = pdf.splitTextToSize(guide, pageWidth - 40);
                pdf.text(splitText, 25, yPosition);
                yPosition += splitText.length * 6 + 4;
            });

            // 60-30-10 RULE
            yPosition += 10;
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(11);
            pdf.setTextColor(51, 51, 51);
            pdf.text("Pro Tip: 60-30-10 Color Rule", 20, yPosition);

            yPosition += 8;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text("Use 60% primary, 30% secondary, and 10% accent colors for balanced interior design", 25, yPosition);

            // FOOTER
            yPosition += 20;
            pdf.setFontSize(9);
            pdf.setTextColor(150, 150, 150);
            pdf.text(
                `Generated by AI Interior Designer • ${new Date().toLocaleDateString()}`,
                20,
                pdf.internal.pageSize.getHeight() - 10
            );

            pdf.save(`${paletteName}-ColorPalette.pdf`);

            toast.success("✅ Color palette PDF exported successfully!", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error("PDF export error:", error);
            toast.error("❌ Failed to export palette as PDF", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

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
                                    onClick={() => copyColorHex(color.hex, color.name)}
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
                                    <div
                                        className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors duration-300 inline-block mt-1 cursor-pointer flex items-center gap-1"
                                        onClick={() => copyColorHex(color.hex, color.name)}
                                    >
                                        {copiedColor === color.name ? (
                                            <>
                                                <Check size={12} />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={12} />
                                                {color.hex.toUpperCase()}
                                            </>
                                        )}
                                    </div>
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

                    <div
                        id="color-palette-preview"
                        className="relative rounded-2xl overflow-hidden border-2 border-gray-300 shadow-xl"
                    >
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

                {/* ===== ACTION BUTTONS - ENHANCED ===== */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-200">
                    {/* EXPORT COLOR CODES BUTTON */}
                    <div className="flex-1 group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        <button
                            onClick={exportColorCodes}
                            className="relative w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                        >
                            <span className="text-xl">🎨</span>
                            <div>
                                <p className="font-bold">Export Color Codes</p>
                                <p className="text-xs text-purple-100 font-light">Copy all hex values</p>
                            </div>
                        </button>
                    </div>

                    {/* DOWNLOAD PALETTE IMAGE BUTTON */}
                    <button
                        onClick={downloadPaletteAsImage}
                        className="flex-1 px-6 py-4 border-2 border-gray-300 hover:border-blue-400 text-gray-900 hover:text-blue-700 rounded-lg font-bold transition-all duration-300 hover:bg-blue-50 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                        <span className="text-xl">📥</span>
                        <div>
                            <p className="font-bold">Download Palette</p>
                            <p className="text-xs text-gray-600 font-light hidden sm:block">As PNG image</p>
                        </div>
                    </button>

                    {/* EXPORT AS PDF BUTTON */}
                    <button
                        onClick={exportPaletteAsPDF}
                        className="flex-1 px-6 py-4 border-2 border-gray-300 hover:border-indigo-400 text-gray-900 hover:text-indigo-700 rounded-lg font-bold transition-all duration-300 hover:bg-indigo-50 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                        <span className="text-xl">📄</span>
                        <div>
                            <p className="font-bold">Export as PDF</p>
                            <p className="text-xs text-gray-600 font-light hidden sm:block">With guide</p>
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
                                Use the 60-30-10 rule: 60% primary color, 30% secondary, and 10% accent colors for the most balanced interior design! Export your colors in all formats for reference.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ===== EXPORT INFO ===== */}
                <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-green-900 flex items-center gap-2">
                            <span>✅</span>
                            Export Options Available
                        </p>
                        <p className="text-sm text-green-800 font-light">
                            Click any hex code to copy instantly • Export as text file (TXT) • Download as PNG image • Export complete guide as PDF
                        </p>
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
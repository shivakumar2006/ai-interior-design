import { z } from "zod";
import { ShoppingCart, Heart, Star, TrendingUp, Filter } from "lucide-react";

export const FurnitureGrid = ({
    columns = 3,
    items = [
        {
            id: 1,
            name: "Modern Minimalist Sofa",
            price: 899,
            originalPrice: 1199,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
            rating: 4.8,
            reviews: 245,
            store: "Amazon",
            amazonLink: "https://www.amazon.com/HONBAY-Convertible-Sectional-Storage-Upholstered/dp/B08GBKX8X3",
            discount: 25,
            inStock: true,
            category: "Sofas"
        },
        {
            id: 2,
            name: "Wooden Coffee Table",
            price: 299,
            originalPrice: 399,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
            rating: 4.6,
            reviews: 189,
            store: "Amazon",
            amazonLink: "https://www.amazon.com/Walker-Edison-Rustic-Coffee-Natural/dp/B00IBCQKZ8",
            discount: 25,
            inStock: true,
            category: "Tables"
        },
        {
            id: 3,
            name: "Modern Floor Lamp",
            price: 199,
            originalPrice: 279,
            image: "https://images.unsplash.com/photo-1565182999555-c71e3bac89d4?w=400&h=400&fit=crop",
            rating: 4.5,
            reviews: 156,
            store: "Amazon",
            amazonLink: "https://www.amazon.com/Brightech-Modern-Adjustable-Brightness-Control/dp/B01F5H8EBU",
            discount: 29,
            inStock: true,
            category: "Lighting"
        },
        {
            id: 4,
            name: "Ergonomic Office Chair",
            price: 249,
            originalPrice: 349,
            image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
            rating: 4.7,
            reviews: 312,
            store: "Amazon",
            amazonLink: "https://www.amazon.com/AmazonBasics-Mesh-Office-Chair-Black/dp/B00BTOXWTM",
            discount: 29,
            inStock: true,
            category: "Chairs"
        },
        {
            id: 5,
            name: "Premium Area Rug",
            price: 179,
            originalPrice: 249,
            image: "https://images.unsplash.com/photo-1609418486288-bfa79e24ead4?w=400&h=400&fit=crop",
            rating: 4.4,
            reviews: 134,
            store: "Amazon",
            amazonLink: "https://www.amazon.com/nuLOOM-Aztec-Trellis-Area-Rug/dp/B01N5INUIU",
            discount: 28,
            inStock: true,
            category: "Rugs"
        },
        {
            id: 6,
            name: "Bookshelf Organizer",
            price: 129,
            originalPrice: 179,
            image: "https://images.unsplash.com/photo-1584622181563-430f63602d4b?w=400&h=400&fit=crop",
            rating: 4.5,
            reviews: 98,
            store: "Amazon",
            amazonLink: "https://www.amazon.com/Tribesigns-Industrial-Bookshelf-Storage-Cabinet/dp/B07JNG7RYJ",
            discount: 28,
            inStock: true,
            category: "Storage"
        },
        {
            id: 7,
            name: "Decorative Wall Art",
            price: 89,
            originalPrice: 149,
            image: "https://images.unsplash.com/photo-1578926078328-123456789012?w=400&h=400&fit=crop",
            rating: 4.3,
            reviews: 67,
            store: "Amazon",
            amazonLink: "https://www.amazon.com/Renditions-Canvas-Painting-Unframed-Bedroom/dp/B08XK7FWKH",
            discount: 40,
            inStock: true,
            category: "Decor"
        },
        {
            id: 8,
            name: "Smart LED Ceiling Light",
            price: 159,
            originalPrice: 229,
            image: "https://images.unsplash.com/photo-1565636192335-14375bc58be0?w=400&h=400&fit=crop",
            rating: 4.6,
            reviews: 201,
            store: "Amazon",
            amazonLink: "https://www.amazon.com/Lutron-Caseta-Wireless-Dimmer-Starter/dp/B00CLAY3MG",
            discount: 31,
            inStock: true,
            category: "Lighting"
        },
        {
            id: 9,
            name: "Plant Pot Set",
            price: 49,
            originalPrice: 79,
            image: "https://images.unsplash.com/photo-1610632360553-fdf8ab51cb3e?w=400&h=400&fit=crop",
            rating: 4.4,
            reviews: 143,
            store: "Amazon",
            amazonLink: "https://www.amazon.com/Greenaholics-Ceramic-Porous-Succulent-Cactus/dp/B07KSGX7FG",
            discount: 38,
            inStock: true,
            category: "Plants"
        }
    ],
    title = "✨ Recommended Furniture"
}) => {
    const gridColsMap = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    const calculateSavings = (original, current) => {
        return Math.round(original - current);
    };

    return (
        <div className="w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-2 border-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="space-y-8">
                {/* ===== HEADER - ENHANCED ===== */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">🛋️</span>
                                <h3 className="text-3xl font-bold text-gray-950">
                                    {title}
                                </h3>
                            </div>
                            <p className="text-gray-700 font-light text-base">
                                Handpicked items based on your design • All prices from Amazon • Real-time availability
                            </p>
                        </div>

                        {/* STATS BADGES */}
                        <div className="flex gap-3 flex-wrap">
                            <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg">
                                <p className="text-xs font-bold text-green-700">
                                    <span className="flex items-center gap-1">
                                        <TrendingUp size={14} />
                                        Up to 40% OFF
                                    </span>
                                </p>
                            </div>
                            <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg">
                                <p className="text-xs font-bold text-blue-700">
                                    {items.length} Items
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3 flex-wrap">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 hover:border-blue-400 text-gray-900 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-50">
                            <Filter size={16} />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 hover:border-blue-400 text-gray-900 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-50">
                            💰 Sort by Price
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 hover:border-blue-400 text-gray-900 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-50">
                            ⭐ Top Rated
                        </button>
                    </div>
                </div>

                {/* ===== GRID - ENHANCED ===== */}
                <div className={`grid ${gridColsMap[columns]} gap-6`}>
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* IMAGE CONTAINER */}
                            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />

                                {/* STORE BADGE */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                        Amazon
                                    </span>
                                </div>

                                {/* DISCOUNT BADGE */}
                                {item.discount && (
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                            -{item.discount}%
                                        </span>
                                    </div>
                                )}

                                {/* IN STOCK INDICATOR */}
                                {item.inStock && (
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-white/90 backdrop-blur text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                            ✓ In Stock
                                        </span>
                                    </div>
                                )}

                                {/* WISHLIST BUTTON */}
                                <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2.5 rounded-full hover:bg-red-50 transition-all duration-300 hover:scale-110 shadow-lg">
                                    <Heart size={18} className="text-gray-600 hover:text-red-600 transition-colors" />
                                </button>
                            </div>

                            {/* CONTENT */}
                            <div className="p-5 space-y-4">
                                {/* CATEGORY & NAME */}
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                                        {item.category}
                                    </p>
                                    <h4 className="font-bold text-gray-950 line-clamp-2 text-base group-hover:text-blue-600 transition-colors">
                                        {item.name}
                                    </h4>
                                </div>

                                {/* RATING */}
                                <div className="flex items-center gap-2 border-t-2 border-gray-100 pt-3">
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold text-gray-900">{item.rating}</span>
                                    </div>
                                    <span className="text-xs text-gray-600 font-light">
                                        ({item.reviews} reviews)
                                    </span>
                                </div>

                                {/* PRICING */}
                                <div className="space-y-2 border-t-2 border-gray-100 pt-3">
                                    <div className="flex items-center gap-3">
                                        <p className="text-3xl font-bold text-green-600">
                                            ${item.price}
                                        </p>
                                        <p className="text-lg text-gray-500 line-through font-light">
                                            ${item.originalPrice}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                                        <p className="text-xs font-bold text-green-700">
                                            💚 You save: ${calculateSavings(item.originalPrice, item.price)}
                                        </p>
                                    </div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="space-y-2 pt-2">
                                    {/* BUY ON AMAZON */}
                                    <a
                                        href={item.amazonLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <ShoppingCart size={18} />
                                        Buy on Amazon
                                    </a>

                                    {/* VIEW DETAILS */}
                                    <button className="w-full border-2 border-gray-300 hover:border-blue-400 text-gray-900 hover:text-blue-700 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-50">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== BULK ACTION SECTION ===== */}
                <div className="space-y-3 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                    <div className="space-y-2 mb-4">
                        <h4 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                            <span>🛒</span>
                            Buy Everything at Once
                        </h4>
                        <p className="text-sm text-blue-800 font-light">
                            Add all items to your cart and checkout together for faster shopping
                        </p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95">
                            <ShoppingCart size={18} />
                            Add All to Cart
                        </button>
                        <button className="flex-1 border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white py-3 rounded-lg font-bold transition-all duration-300">
                            📋 Create Shopping List
                        </button>
                    </div>

                    {/* TOTAL PRICE */}
                    <div className="bg-white rounded-lg p-4 mt-4">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-700 font-semibold">Total for all items:</p>
                            <div className="space-y-1 text-right">
                                <p className="text-3xl font-bold text-green-600">
                                    ${items.reduce((sum, item) => sum + item.price, 0)}
                                </p>
                                <p className="text-sm text-gray-600 line-through font-light">
                                    ${items.reduce((sum, item) => sum + item.originalPrice, 0)}
                                </p>
                                <p className="text-sm font-bold text-green-600">
                                    Save ${items.reduce((sum, item) => sum + calculateSavings(item.originalPrice, item.price), 0)} total!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== LOAD MORE ===== */}
                <button className="w-full py-4 border-2 border-gray-300 hover:border-blue-400 rounded-xl hover:bg-blue-50 transition-all duration-300 font-bold text-gray-900 hover:text-blue-700 flex items-center justify-center gap-2">
                    📦 Load More Furniture
                    <span className="text-lg">→</span>
                </button>

                {/* ===== INFO BOX ===== */}
                <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl">
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-purple-900 flex items-center gap-2">
                            <span>💡</span>
                            Pro Tips for Shopping
                        </p>
                        <ul className="text-sm text-purple-800 font-light space-y-1.5 ml-6">
                            <li>✓ Click "Buy on Amazon" to check real-time prices and availability</li>
                            <li>✓ All prices are from Amazon and may vary</li>
                            <li>✓ Add items to cart and checkout together for better deals</li>
                            <li>✓ Check delivery times before completing purchase</li>
                            <li>✓ Use your design as reference while shopping</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const FurnitureGridSchema = z.object({
    columns: z.number().describe("Number of columns (1-4)").optional().default(3),
    items: z.array(z.object({
        id: z.number(),
        name: z.string(),
        price: z.number(),
        originalPrice: z.number(),
        image: z.string().url(),
        rating: z.number(),
        reviews: z.number(),
        store: z.string(),
        amazonLink: z.string().url(),

        discount: z.number(),
        inStock: z.boolean(),
        category: z.string(),
    })).describe("Array of furniture items").optional(),
    title: z.string().describe("Section title").optional().default("✨ Recommended Furniture"),
});
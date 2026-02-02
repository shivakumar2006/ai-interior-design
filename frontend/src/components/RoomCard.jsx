import { z } from "zod";

export const RoomCard = ({
    title = "Furniture Item",
    price = 299,
    rating = 4.5,
    image = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    store = "Amazon",
    inStock = true
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition">
            {/* Image */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
                {!inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{title}</h3>

                {/* Rating & Price */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600 font-light">{rating}</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">${price}</span>
                </div>

                {/* Store */}
                <div className="text-xs text-gray-500 font-light">
                    Available on {store}
                </div>

                {/* Button */}
                <button
                    disabled={!inStock}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 rounded-lg hover:shadow-lg transition font-light disabled:from-gray-400 disabled:to-gray-400"
                >
                    {inStock ? "View & Buy" : "Notify Me"}
                </button>
            </div>
        </div>
    );
};

export const RoomCardSchema = z.object({
    title: z.string().describe("Furniture item name").optional().default("Furniture Item"),
    price: z.number().describe("Item price in dollars").optional().default(299),
    rating: z.number().describe("Star rating 1-5").optional().default(4.5),
    image: z.string().url().describe("Product image URL").optional().default("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop"),
    store: z.string().describe("Store name (Amazon, Wayfair, etc)").optional().default("Amazon"),
    inStock: z.boolean().describe("Is item in stock").optional().default(true),
});
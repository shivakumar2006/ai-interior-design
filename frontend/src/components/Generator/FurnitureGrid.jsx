import { z } from "zod";

export const FurnitureGrid = ({
    columns = 3,
    items = [
        {
            id: 1,
            name: "Modern Sofa",
            price: 899,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop",
            rating: 4.8,
            store: "Wayfair"
        },
        {
            id: 2,
            name: "Coffee Table",
            price: 299,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop",
            rating: 4.5,
            store: "Amazon"
        },
        {
            id: 3,
            name: "Floor Lamp",
            price: 199,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop",
            rating: 4.3,
            store: "IKEA"
        }
    ],
    title = "Recommended Furniture"
}) => {
    const gridColsMap = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
                        <p className="text-gray-600 font-light">Handpicked items based on your design</p>
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-light text-sm">
                            🔽 Sort
                        </button>
                        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-light text-sm">
                            ⚙️ Filter
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className={`grid ${gridColsMap[columns]} gap-6`}>
                    {items.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition">
                            {/* Image */}
                            <div className="relative aspect-square bg-gray-100 overflow-hidden group">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute top-3 right-3">
                                    <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-900 shadow-md">
                                        {item.store}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 space-y-4">
                                {/* Name & Rating */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h4>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                            <span className="text-yellow-400 text-sm">★</span>
                                            <span className="text-sm text-gray-600 font-light">{item.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-2xl font-bold text-blue-600 mb-3">${item.price}</p>

                                    {/* Action Buttons */}
                                    <div className="space-y-2">
                                        <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 rounded-lg hover:shadow-lg transition font-light text-sm">
                                            View Details
                                        </button>
                                        <button className="w-full border border-gray-300 text-gray-900 py-2.5 rounded-lg hover:bg-gray-50 transition font-light text-sm">
                                            ❤️ Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <button className="w-full py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-light text-gray-900">
                    Load More Furniture →
                </button>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-900 font-light">
                        💡 Tip: Click on any item to see detailed reviews, dimensions, and available deals on different platforms.
                    </p>
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
        image: z.string().url(),
        rating: z.number(),
        store: z.string(),
    })).describe("Array of furniture items").optional(),
    title: z.string().describe("Section title").optional().default("Recommended Furniture"),
});
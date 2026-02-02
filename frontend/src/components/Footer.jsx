import { z } from "zod";

export const Footer = ({
    company = "Your Company",
    year = "2026",
    links = "Privacy, Terms, Contact"
}) => {
    const linkArray = links.split(",").map(l => l.trim());

    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{company}</h3>
                        <p className="text-gray-400 text-sm font-light">Building amazing experiences.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm font-light text-gray-400">
                            <li><a href="#" className="hover:text-white transition">Features</a></li>
                            <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm font-light text-gray-400">
                            <li><a href="#" className="hover:text-white transition">About</a></li>
                            <li><a href="#" className="hover:text-white transition">Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm font-light text-gray-400">
                            {linkArray.map((link, idx) => (
                                <li key={idx}><a href="#" className="hover:text-white transition">{link}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8">
                    <p className="text-center text-gray-400 text-sm font-light">
                        © {year} {company}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export const FooterSchema = z.object({
    company: z.string().describe("Company name").optional().default("Your Company"),
    year: z.string().describe("Copyright year").optional().default("2026"),
    links: z.string().describe("Footer links (comma-separated)").optional().default("Privacy, Terms, Contact"),
});
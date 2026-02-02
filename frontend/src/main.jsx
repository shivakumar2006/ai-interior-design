import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
    TamboProvider,
    currentPageContextHelper,
} from "@tambo-ai/react";
// import "./styles/globals.css";

// Import components (ab ye banayenge)
import { Card, CardSchema } from "./components/Card";
import { Button, ButtonSchema } from "./components/Button";
import { Alert, AlertSchema } from "./components/Alert";
import { Badge, BadgeSchema } from "./components/Badge";
import { Stats, StatsSchema } from "./components/Stats";
import { RoomCard, RoomCardSchema } from "./components/RoomCard";
import { BudgetBreakdown, BudgetBreakdownSchema } from "./components/Generator/BudgetBreakdown";
import { ColorPalette, ColorPaletteSchema } from "./components/Room/ColorPalette";
import { FurnitureGrid, FurnitureGridSchema } from "./components/Generator/FurnitureGrid";
import { Room3D, Room3DSchema } from "./components/ui/Room3D";


const components = [
    {
        name: "Room3D",
        description: "3D interactive room visualization with furniture",
        component: Room3D,
        propsSchema: Room3DSchema,
    },
    {
        name: "Card",
        description: "Display information in a card",
        component: Card,
        propsSchema: CardSchema,
    },
    {
        name: "Button",
        description: "Clickable button with variants",
        component: Button,
        propsSchema: ButtonSchema,
    },
    {
        name: "Alert",
        description: "Alert message component",
        component: Alert,
        propsSchema: AlertSchema,
    },
    {
        name: "Badge",
        description: "Small label badge",
        component: Badge,
        propsSchema: BadgeSchema,
    },
    {
        name: "Stats",
        description: "Metric/statistic card",
        component: Stats,
        propsSchema: StatsSchema,
    },
    {
        name: "RoomCard",
        description: "Furniture item card with price and rating",
        component: RoomCard,
        propsSchema: RoomCardSchema,
    },
    {
        name: "BudgetBreakdown",
        description: "Pie chart showing budget breakdown",
        component: BudgetBreakdown,
        propsSchema: BudgetBreakdownSchema,
    },
    {
        name: "ColorPalette",
        description: "Color swatches for room design",
        component: ColorPalette,
        propsSchema: ColorPaletteSchema,
    },
    {
        name: "FurnitureGrid",
        description: "Grid of furniture recommendations",
        component: FurnitureGrid,
        propsSchema: FurnitureGridSchema,
    },
];

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <TamboProvider
        apiKey={import.meta.env.VITE_TAMBO_API_KEY}
        components={components}
        tools={[]}
        contextHelpers={{
            currentPage: currentPageContextHelper,
        }}
        streaming={true}
        autoGenerateThreadName={true}
        autoGenerateNameThreshold={3}
    >
        <App />
    </TamboProvider>
);
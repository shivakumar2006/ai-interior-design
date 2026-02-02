import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
    TamboProvider,
    currentPageContextHelper,
} from "@tambo-ai/react";

// Import all components
import { Card, CardSchema } from "./components/Card";
import { Button, ButtonSchema } from "./components/Button";
// import { Alert, AlertSchema } from "./components/Alert";
// import { Badge, BadgeSchema } from "./components/Badge";
// import { Stats, StatsSchema } from "./components/Stats";
// import { Hero, HeroSchema } from "./components/Hero";
// import { Header, HeaderSchema } from "./components/Header";
import { Footer, FooterSchema } from "./components/Footer";
import { Features, FeaturesSchema } from "./components/Features";
// import { Grid, GridSchema } from "./components/Grid";

const components = [
    // Layout Components
    // {
    //     name: "Header",
    //     description: "Navigation header with links and CTA button",
    //     component: Header,
    //     propsSchema: HeaderSchema,
    // },
    // {
    //     name: "Hero",
    //     description: "Large hero section with title, subtitle, and call-to-action",
    //     component: Hero,
    //     propsSchema: HeroSchema,
    // },
    {
        name: "Features",
        description: "Features showcase section with 3 feature cards",
        component: Features,
        propsSchema: FeaturesSchema,
    },
    // {
    //     name: "Grid",
    //     description: "Grid layout container for arranging items",
    //     component: Grid,
    //     propsSchema: GridSchema,
    // },
    {
        name: "Footer",
        description: "Professional footer with links and copyright",
        component: Footer,
        propsSchema: FooterSchema,
    },

    // Content Components
    {
        name: "Card",
        description: "Displays information in a card format with optional icon",
        component: Card,
        propsSchema: CardSchema,
    },
    {
        name: "Button",
        description: "Clickable button with variants (primary, secondary, outline, danger) and sizes",
        component: Button,
        propsSchema: ButtonSchema,
    },
    // {
    //     name: "Alert",
    //     description: "Alert message with types (info, success, warning, error)",
    //     component: Alert,
    //     propsSchema: AlertSchema,
    // },
    // {
    //     name: "Badge",
    //     description: "Small label badge with colors and variants",
    //     component: Badge,
    //     propsSchema: BadgeSchema,
    // },
    // {
    //     name: "Stats",
    //     description: "Metric/statistic display card with trend indicator",
    //     component: Stats,
    //     propsSchema: StatsSchema,
    // },
];

const tools = [];

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <TamboProvider
        apiKey={import.meta.env.VITE_TAMBO_API_KEY}
        components={components}
        tools={tools}
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
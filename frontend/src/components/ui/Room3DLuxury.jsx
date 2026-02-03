import { useEffect, useRef } from "react";
import { z } from "zod";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const Room3DLuxury = ({
    wallColor = "#faf8f3",
    accentWallColor = "#d4c4b0",
    floorColor = "#6b5344",
    bedColor = "#2c2c2c",
    sofaColor = "#3a3a3a",
    tableColor = "#f5f5f5",
    lampColor = "#d4af37",
    plantColor = "#5f8f5f",
}) => {
    const containerRef = useRef(null);
    const meshesRef = useRef({});

    useEffect(() => {
        if (!containerRef.current) return;

        /* ================= SCENE ================= */
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#2a2a2a");

        /* ================= CAMERA ================= */
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
        camera.position.set(8, 5, 10);

        /* ================= RENDERER ================= */
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        containerRef.current.appendChild(renderer.domElement);

        /* ================= CONTROLS ================= */
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = false;
        controls.minDistance = 6;
        controls.maxDistance = 14;
        controls.maxPolarAngle = Math.PI / 2.2;
        controls.target.set(0, 2.3, -2);

        /* ================= LIGHTING ================= */
        // Luxurious warm lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));

        const sunLight = new THREE.DirectionalLight(0xfff1d6, 1.3);
        sunLight.position.set(6, 8, 4);
        sunLight.castShadow = true;
        scene.add(sunLight);

        // Extra accent lighting for luxury
        const accentLight = new THREE.DirectionalLight(0xffe8cc, 0.6);
        accentLight.position.set(-5, 5, 3);
        scene.add(accentLight);

        /* ================= FLOOR ================= */
        // Dark luxury floor
        const floorMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(floorColor),
            roughness: 0.6,
            metalness: 0.1,
        });
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(14, 14),
            floorMat
        );
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);
        meshesRef.current.floor = floorMat;

        /* ================= LUXURY WALLS ================= */
        const baseWallMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(wallColor),
            roughness: 0.7,
        });

        const accentWallMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(accentWallColor),
            roughness: 0.65,
        });

        const wallThickness = 0.25;
        const wallHeight = 6;

        // BACK WALL - with texture panels (luxury detail)
        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(14, wallHeight, wallThickness),
            accentWallMat
        );
        backWall.position.set(0, wallHeight / 2, -7 - wallThickness / 2);
        backWall.receiveShadow = true;
        scene.add(backWall);
        meshesRef.current.backWall = accentWallMat;

        // Panel details for luxury wall
        const trimMat = new THREE.MeshStandardMaterial({
            color: "#e6d7c3",
            roughness: 0.6,
            metalness: 0.1,
        });

        const panelSpacing = 2.8;
        for (let x = -5; x <= 5; x += panelSpacing) {
            const trim = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 4.2, 0.015),
                trimMat
            );
            trim.position.set(x, 2.5, -6.99);
            trim.castShadow = true;
            scene.add(trim);
        }

        // LEFT WALL
        const sideWallDepth = 14;
        const sideWall = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, sideWallDepth),
            baseWallMat
        );
        sideWall.position.set(
            -7 - wallThickness / 2,
            wallHeight / 2,
            -7 + sideWallDepth / 2
        );
        sideWall.receiveShadow = true;
        scene.add(sideWall);
        meshesRef.current.leftWall = baseWallMat;

        /* ================= LUXURY BED ================= */
        const bed = new THREE.Group();

        // Premium mattress
        const mattressMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(bedColor),
            roughness: 0.5,
            metalness: 0.1
        });
        const mattress = new THREE.Mesh(
            new THREE.BoxGeometry(2.6, 0.5, 3),
            mattressMat
        );
        mattress.position.y = 0.7;
        mattress.position.z = -2;
        mattress.castShadow = true;
        meshesRef.current.bed = mattressMat;

        // Premium base
        const baseMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#1a1a1a"),
            roughness: 0.5,
            metalness: 0.2
        });
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 0.4, 3.2),
            baseMat
        );
        base.position.y = 0.2;
        base.position.z = -2;
        base.castShadow = true;

        // Luxury headboard
        const headboardMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#2a2a2a"),
            roughness: 0.6,
            metalness: 0.1
        });
        const headboard = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 1.6, 0.15),
            headboardMat
        );
        headboard.position.set(0, 1.1, -3.5);
        headboard.castShadow = true;

        bed.add(mattress, base, headboard);
        bed.position.set(1.5, 0, -3);
        scene.add(bed);

        /* ================= LUXURY SOFA ================= */
        const sofaGroup = new THREE.Group();

        const sofaMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(sofaColor),
            roughness: 0.4,
            metalness: 0.15
        });

        // Main sofa body
        const sofaBase = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.5, 1.3),
            sofaMat
        );
        sofaBase.position.y = 0.3;
        sofaBase.castShadow = true;

        // Cushion
        const sofaCushion = new THREE.Mesh(
            new THREE.BoxGeometry(3.8, 0.7, 1.1),
            sofaMat
        );
        sofaCushion.position.y = 0.9;
        sofaCushion.castShadow = true;

        // Luxury backrest
        const sofaBackrest = new THREE.Mesh(
            new THREE.BoxGeometry(3.8, 1.5, 0.4),
            sofaMat
        );
        sofaBackrest.position.set(0, 1.5, -0.6);
        sofaBackrest.castShadow = true;

        // Brass legs detail
        const legMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#b5a642"),
            metalness: 0.8,
            roughness: 0.2
        });

        const leg1 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.3, 12),
            legMat
        );
        leg1.position.set(-1.8, 0.15, 0.5);
        leg1.castShadow = true;

        const leg2 = leg1.clone();
        leg2.position.set(1.8, 0.15, 0.5);

        const leg3 = leg1.clone();
        leg3.position.set(-1.8, 0.15, -0.7);

        const leg4 = leg1.clone();
        leg4.position.set(1.8, 0.15, -0.7);

        sofaGroup.add(sofaBase, sofaCushion, sofaBackrest, leg1, leg2, leg3, leg4);
        sofaGroup.position.set(-2, 0, 2);
        scene.add(sofaGroup);
        meshesRef.current.sofa = sofaMat;

        /* ================= MARBLE COFFEE TABLE ================= */
        const tableGroup = new THREE.Group();

        const marbleMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(tableColor),
            roughness: 0.3,
            metalness: 0,
        });

        // Marble top
        const tableTop = new THREE.Mesh(
            new THREE.BoxGeometry(1.3, 0.04, 1),
            marbleMat
        );
        tableTop.position.y = 0.5;
        tableTop.castShadow = true;

        // Brass legs
        const brassLegMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#b5a642"),
            metalness: 0.85,
            roughness: 0.15
        });

        const brassLeg1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.5, 0.08),
            brassLegMat
        );
        brassLeg1.position.set(-0.55, 0.25, -0.4);
        brassLeg1.castShadow = true;

        const brassLeg2 = brassLeg1.clone();
        brassLeg2.position.set(0.55, 0.25, -0.4);

        const brassLeg3 = brassLeg1.clone();
        brassLeg3.position.set(-0.55, 0.25, 0.4);

        const brassLeg4 = brassLeg1.clone();
        brassLeg4.position.set(0.55, 0.25, 0.4);

        tableGroup.add(tableTop, brassLeg1, brassLeg2, brassLeg3, brassLeg4);
        tableGroup.position.set(0, 0, 0.8);
        scene.add(tableGroup);
        meshesRef.current.table = marbleMat;

        /* ================= DESIGNER LAMP ================= */
        const lampGroup = new THREE.Group();

        const lampMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(lampColor),
            metalness: 0.7,
            roughness: 0.2
        });

        // Luxury lamp base
        const luxBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.22, 0.12, 24),
            lampMat
        );
        luxBase.position.y = 0.06;
        luxBase.castShadow = true;

        // Lamp pole
        const luxPole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.025, 0.025, 1.8, 16),
            lampMat
        );
        luxPole.position.y = 1;
        luxPole.castShadow = true;

        // Designer shade - elegant curve
        const luxShadeMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#f0e8d8"),
            roughness: 0.7,
            side: THREE.DoubleSide
        });

        const shadeGeom = new THREE.ConeGeometry(0.35, 0.5, 20);
        const luxShade = new THREE.Mesh(shadeGeom, luxShadeMat);
        luxShade.position.y = 1.8;
        luxShade.castShadow = true;

        lampGroup.add(luxBase, luxPole, luxShade);
        lampGroup.position.set(3.5, 0, -2);
        scene.add(lampGroup);
        meshesRef.current.lamp = lampMat;

        /* ================= LUXURY LAMP LIGHT ================= */
        const lampLight = new THREE.PointLight(0xffd699, 0.9, 10);
        lampLight.position.set(3.5, 1.8, -2);
        scene.add(lampLight);

        /* ================= STATEMENT PLANT ================= */
        const plantGroup = new THREE.Group();

        // Premium pot
        const potMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#a68b6a"),
            roughness: 0.5,
            metalness: 0.1
        });

        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.35, 0.5),
            potMat
        );
        pot.position.y = 0.25;
        pot.castShadow = true;

        // Lush plant
        const plantMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(plantColor)
        });

        const plant = new THREE.Mesh(
            new THREE.SphereGeometry(0.75, 16, 16),
            plantMat
        );
        plant.position.y = 1.1;
        plant.castShadow = true;
        meshesRef.current.plant = plantMat;

        plantGroup.add(pot, plant);
        plantGroup.position.set(-5.5, 0, -1.5);
        scene.add(plantGroup);

        /* ================= ANIMATION ================= */
        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        /* ================= RESIZE ================= */
        const handleResize = () => {
            if (!containerRef.current) return;
            const newWidth = containerRef.current.clientWidth;
            const newHeight = containerRef.current.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener("resize", handleResize);

        /* ================= CLEANUP ================= */
        return () => {
            window.removeEventListener("resize", handleResize);
            controls.dispose();
            renderer.dispose();
        };
    }, []);

    // ================= COLOR SYNC EFFECT =================
    useEffect(() => {
        if (!meshesRef.current.floor) return;

        if (meshesRef.current.floor) meshesRef.current.floor.color.setStyle(floorColor);
        if (meshesRef.current.backWall) meshesRef.current.backWall.color.setStyle(accentWallColor);
        if (meshesRef.current.leftWall) meshesRef.current.leftWall.color.setStyle(wallColor);
        if (meshesRef.current.bed) meshesRef.current.bed.color.setStyle(bedColor);
        if (meshesRef.current.sofa) meshesRef.current.sofa.color.setStyle(sofaColor);
        if (meshesRef.current.table) meshesRef.current.table.color.setStyle(tableColor);
        if (meshesRef.current.lamp) meshesRef.current.lamp.color.setStyle(lampColor);
        if (meshesRef.current.plant) meshesRef.current.plant.color.setStyle(plantColor);
    }, [wallColor, accentWallColor, floorColor, bedColor, sofaColor, tableColor, lampColor, plantColor]);

    return (
        <div
            ref={containerRef}
            style={{ height: "600px" }}
            className="w-full rounded-xl overflow-hidden shadow-xl border border-gray-200"
        />
    );
};

export const Room3DLuxurySchema = z.object({
    wallColor: z.string().describe("Wall color hex code").optional().default("#faf8f3"),
    accentWallColor: z.string().describe("Accent wall color hex code").optional().default("#d4c4b0"),
    floorColor: z.string().describe("Floor color hex code").optional().default("#6b5344"),
    bedColor: z.string().describe("Bed color hex code").optional().default("#2c2c2c"),
    sofaColor: z.string().describe("Sofa color hex code").optional().default("#3a3a3a"),
    tableColor: z.string().describe("Marble table color hex code").optional().default("#f5f5f5"),
    lampColor: z.string().describe("Designer lamp color hex code").optional().default("#d4af37"),
    plantColor: z.string().describe("Plant color hex code").optional().default("#5f8f5f"),
});
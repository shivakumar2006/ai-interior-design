import { useEffect, useRef } from "react";
import { z } from "zod";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const Room3DMinimalist = ({
    wallColor = "#ffffff",
    accentWallColor = "#f5f5f5",
    floorColor = "#e8e8e8",
    bedColor = "#d0d0d0",
    sofaColor = "#a8a8a8",
    tableColor = "#c4a574",
    lampColor = "#e0e0e0",
    plantColor = "#6fa876",
}) => {
    const containerRef = useRef(null);
    const meshesRef = useRef({});

    useEffect(() => {
        if (!containerRef.current) return;

        /* ================= SCENE ================= */
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#fafafa");

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
        // Soft, minimal lighting for zen feel
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(6, 8, 4);
        sunLight.castShadow = true;
        scene.add(sunLight);

        /* ================= FLOOR ================= */
        const floorMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(floorColor),
            roughness: 0.9,
            metalness: 0,
        });
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(14, 14),
            floorMat
        );
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);
        meshesRef.current.floor = floorMat;

        /* ================= MINIMALIST WALLS ================= */
        const baseWallMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(wallColor),
            roughness: 0.95,
        });

        const accentWallMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(accentWallColor),
            roughness: 0.95,
        });

        const wallThickness = 0.25;
        const wallHeight = 6;

        // BACK WALL
        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(14, wallHeight, wallThickness),
            accentWallMat
        );
        backWall.position.set(0, wallHeight / 2, -7 - wallThickness / 2);
        backWall.receiveShadow = true;
        scene.add(backWall);
        meshesRef.current.backWall = accentWallMat;

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

        /* ================= MINIMALIST BED ================= */
        const bed = new THREE.Group();

        // Platform bed (no frame, just mattress)
        const platfMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(bedColor),
            roughness: 0.8
        });
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 0.3, 2.8),
            platfMat
        );
        platform.position.y = 0.15;
        platform.position.z = -2;
        platform.castShadow = true;
        meshesRef.current.bed = platfMat;

        bed.add(platform);
        bed.position.set(1.5, 0, -3);
        scene.add(bed);

        /* ================= MODULAR SOFA ================= */
        // Minimalist modular - just cubes, very clean
        const sofaGroup = new THREE.Group();

        const sofaMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(sofaColor),
            roughness: 0.75
        });

        // Module 1: Left cushion
        const sofaMod1 = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.8, 1),
            sofaMat
        );
        sofaMod1.position.set(-1.2, 0.4, 2);
        sofaMod1.castShadow = true;

        // Module 2: Center cushion
        const sofaMod2 = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.8, 1),
            sofaMat
        );
        sofaMod2.position.set(0, 0.4, 2);
        sofaMod2.castShadow = true;

        // Module 3: Right cushion
        const sofaMod3 = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.8, 1),
            sofaMat
        );
        sofaMod3.position.set(1.2, 0.4, 2);
        sofaMod3.castShadow = true;

        sofaGroup.add(sofaMod1, sofaMod2, sofaMod3);
        scene.add(sofaGroup);
        meshesRef.current.sofa = sofaMat;

        /* ================= MINIMALIST TABLE ================= */
        // Simple wooden table - no frills
        const tableGroup = new THREE.Group();

        const tableMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(tableColor),
            roughness: 0.7,
            metalness: 0
        });

        // Table top
        const tableTop = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.03, 1),
            tableMat
        );
        tableTop.position.y = 0.45;
        tableTop.castShadow = true;

        // Table legs - simple cylinders
        const legMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#888888"),
            roughness: 0.8
        });

        const leg1 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8),
            legMat
        );
        leg1.position.set(-0.4, 0.225, -0.4);
        leg1.castShadow = true;

        const leg2 = leg1.clone();
        leg2.position.set(0.4, 0.225, -0.4);

        const leg3 = leg1.clone();
        leg3.position.set(-0.4, 0.225, 0.4);

        const leg4 = leg1.clone();
        leg4.position.set(0.4, 0.225, 0.4);

        tableGroup.add(tableTop, leg1, leg2, leg3, leg4);
        tableGroup.position.set(0, 0, 0.5);
        scene.add(tableGroup);
        meshesRef.current.table = tableMat;

        /* ================= PAPER SHADE LAMP ================= */
        const lampGroup = new THREE.Group();

        const lampMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(lampColor),
            roughness: 0.9,
            metalness: 0
        });

        // Lamp base - simple cylinder
        const lampBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16),
            lampMat
        );
        lampBase.position.y = 0.025;
        lampBase.castShadow = true;

        // Lamp pole - thin rod
        const lampPole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.015, 0.015, 1.2, 12),
            lampMat
        );
        lampPole.position.y = 0.65;
        lampPole.castShadow = true;

        // Paper shade - simple cone (paper white texture)
        const paperMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#f5f5f5"),
            roughness: 0.95,
            side: THREE.DoubleSide
        });

        const shadeGeometry = new THREE.ConeGeometry(0.25, 0.4, 16);
        const shade = new THREE.Mesh(shadeGeometry, paperMat);
        shade.position.y = 1.35;
        shade.castShadow = true;
        meshesRef.current.lamp = lampMat;

        lampGroup.add(lampBase, lampPole, shade);
        lampGroup.position.set(-3, 0, 1.5);
        scene.add(lampGroup);

        /* ================= LAMP LIGHT ================= */
        const lampLight = new THREE.PointLight(0xffe8cc, 0.6, 6);
        lampLight.position.set(-3, 1.5, 1.5);
        scene.add(lampLight);

        /* ================= SINGLE PLANT ================= */
        // One plant for greenery - essential living element
        const plantGroup = new THREE.Group();

        const potMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#c9b29b"),
            roughness: 0.8
        });

        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.25, 0.35),
            potMat
        );
        pot.position.y = 0.175;
        pot.castShadow = true;

        const plantMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(plantColor)
        });

        const plant = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 12, 12),
            plantMat
        );
        plant.position.y = 0.75;
        plant.castShadow = true;
        meshesRef.current.plant = plantMat;

        plantGroup.add(pot, plant);
        plantGroup.position.set(4, 0, -2);
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

export const Room3DMinimalistSchema = z.object({
    wallColor: z.string().describe("Wall color hex code").optional().default("#ffffff"),
    accentWallColor: z.string().describe("Accent wall color hex code").optional().default("#f5f5f5"),
    floorColor: z.string().describe("Floor color hex code").optional().default("#e8e8e8"),
    bedColor: z.string().describe("Platform bed color hex code").optional().default("#d0d0d0"),
    sofaColor: z.string().describe("Modular sofa color hex code").optional().default("#a8a8a8"),
    tableColor: z.string().describe("Minimalist table color hex code").optional().default("#c4a574"),
    lampColor: z.string().describe("Paper shade lamp color hex code").optional().default("#e0e0e0"),
    plantColor: z.string().describe("Plant color hex code").optional().default("#6fa876"),
});
import { useEffect, useRef } from "react";
import { z } from "zod";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const Room3DBudget = ({
    wallColor = "#f0f0f0",
    accentWallColor = "#e0e0e0",
    floorColor = "#d4a574",
    bedColor = "#c0c0c0",
    sofaColor = "#787878",
    tableColor = "#a0826d",
    lampColor = "#d4d4d4",
    plantColor = "#5f8f5f",
}) => {
    const containerRef = useRef(null);
    const meshesRef = useRef({});

    useEffect(() => {
        if (!containerRef.current) return;

        /* ================= SCENE ================= */
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#f5f5f5");

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
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        const sunLight = new THREE.DirectionalLight(0xffffff, 0.9);
        sunLight.position.set(6, 8, 4);
        sunLight.castShadow = true;
        scene.add(sunLight);

        /* ================= FLOOR ================= */
        // Laminate / affordable wood-look floor
        const floorMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(floorColor),
            roughness: 0.8,
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

        /* ================= BUDGET WALLS ================= */
        const baseWallMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(wallColor),
            roughness: 0.9,
        });

        const accentWallMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(accentWallColor),
            roughness: 0.88,
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

        /* ================= BUDGET BED ================= */
        const bed = new THREE.Group();

        // Simple bed frame
        const bedMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(bedColor),
            roughness: 0.7
        });

        const mattress = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 0.35, 2.8),
            bedMat
        );
        mattress.position.y = 0.5;
        mattress.position.z = -2;
        mattress.castShadow = true;
        meshesRef.current.bed = bedMat;

        // Simple frame
        const frameMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#8b8b8b"),
            roughness: 0.6
        });

        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 0.15, 3),
            frameMat
        );
        frame.position.y = 0.08;
        frame.position.z = -2;
        frame.castShadow = true;

        bed.add(mattress, frame);
        bed.position.set(1.5, 0, -3);
        scene.add(bed);

        /* ================= BUDGET SOFA ================= */
        const sofaGroup = new THREE.Group();

        const sofaMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(sofaColor),
            roughness: 0.7
        });

        // Simple sofa
        const sofaBody = new THREE.Mesh(
            new THREE.BoxGeometry(3.2, 0.8, 1),
            sofaMat
        );
        sofaBody.position.y = 0.5;
        sofaBody.castShadow = true;

        // Backrest
        const sofaBack = new THREE.Mesh(
            new THREE.BoxGeometry(3.2, 1.2, 0.25),
            sofaMat
        );
        sofaBack.position.set(0, 1.2, -0.5);
        sofaBack.castShadow = true;

        // Simple wooden legs
        const legMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#8b7355"),
            roughness: 0.6
        });

        const leg_1 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8),
            legMat
        );
        leg_1.position.set(-1.5, 0.25, 0.3);
        leg_1.castShadow = true;

        const leg_2 = leg1.clone();
        leg_2.position.set(1.5, 0.25, 0.3);

        const leg_3 = leg1.clone();
        leg_3.position.set(-1.5, 0.25, -0.5);

        const leg_4 = leg1.clone();
        leg_4.position.set(1.5, 0.25, -0.5);

        sofaGroup.add(sofaBody, sofaBack, leg1, leg2, leg3, leg4);
        sofaGroup.position.set(-2, 0, 2);
        scene.add(sofaGroup);
        meshesRef.current.sofa = sofaMat;

        /* ================= BUDGET TABLE ================= */
        const tableGroup = new THREE.Group();

        const tableMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(tableColor),
            roughness: 0.75
        });

        // Simple wood table top
        const tableTop = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.025, 0.8),
            tableMat
        );
        tableTop.position.y = 0.5;
        tableTop.castShadow = true;

        // Wooden legs
        const leg1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.5, 0.05),
            tableMat
        );
        leg1.position.set(-0.4, 0.25, -0.3);
        leg1.castShadow = true;

        const leg2 = leg1.clone();
        leg2.position.set(0.4, 0.25, -0.3);

        const leg3 = leg1.clone();
        leg3.position.set(-0.4, 0.25, 0.3);

        const leg4 = leg1.clone();
        leg4.position.set(0.4, 0.25, 0.3);

        tableGroup.add(tableTop, leg1, leg2, leg3, leg4);
        tableGroup.position.set(0, 0, 0.8);
        scene.add(tableGroup);
        meshesRef.current.table = tableMat;

        /* ================= BUDGET LAMP ================= */
        const lampGroup = new THREE.Group();

        const lampMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(lampColor),
            roughness: 0.8
        });

        // Simple base
        const lampBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12),
            lampMat
        );
        lampBase.position.y = 0.04;
        lampBase.castShadow = true;

        // Simple pole
        const lampPole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.015, 0.015, 1.2, 12),
            lampMat
        );
        lampPole.position.y = 0.7;
        lampPole.castShadow = true;

        // Simple shade
        const shadeMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#f0f0f0"),
            roughness: 0.85,
            side: THREE.DoubleSide
        });

        const shade = new THREE.Mesh(
            new THREE.ConeGeometry(0.2, 0.3, 12),
            shadeMat
        );
        shade.position.y = 1.25;
        shade.castShadow = true;

        lampGroup.add(lampBase, lampPole, shade);
        lampGroup.position.set(3.2, 0, -1.8);
        scene.add(lampGroup);
        meshesRef.current.lamp = lampMat;

        /* ================= BUDGET LAMP LIGHT ================= */
        const lampLight = new THREE.PointLight(0xffffcc, 0.6, 6);
        lampLight.position.set(3.2, 1.3, -1.8);
        scene.add(lampLight);

        /* ================= PLANT (Single, Budget-friendly) ================= */
        const plantGroup = new THREE.Group();

        const potMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#c4a574"),
            roughness: 0.7
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
        plant.position.y = 0.7;
        plant.castShadow = true;
        meshesRef.current.plant = plantMat;

        plantGroup.add(pot, plant);
        plantGroup.position.set(-5.5, 0, -2);
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

export const Room3DBudgetSchema = z.object({
    wallColor: z.string().describe("Wall color hex code").optional().default("#f0f0f0"),
    accentWallColor: z.string().describe("Accent wall color hex code").optional().default("#e0e0e0"),
    floorColor: z.string().describe("Floor color hex code").optional().default("#d4a574"),
    bedColor: z.string().describe("Bed color hex code").optional().default("#c0c0c0"),
    sofaColor: z.string().describe("Sofa color hex code").optional().default("#787878"),
    tableColor: z.string().describe("Table color hex code").optional().default("#a0826d"),
    lampColor: z.string().describe("Lamp color hex code").optional().default("#d4d4d4"),
    plantColor: z.string().describe("Plant color hex code").optional().default("#5f8f5f"),
});
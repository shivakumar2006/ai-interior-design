import { useEffect, useRef, useState } from "react";
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
    const groupsRef = useRef({}); // Store furniture groups

    // ===== FURNITURE VISIBILITY STATE =====
    const [furnitureVisibility, setFurnitureVisibility] = useState({
        bed: true,
        sofa: true,
        table: true,
        lamp: true,
        plant: true,
        door: true,
        shelves: true,
        mirror: true,
    });

    // ===== TOGGLE FURNITURE =====
    const toggleFurniture = (furnitureType) => {
        setFurnitureVisibility(prev => ({
            ...prev,
            [furnitureType]: !prev[furnitureType]
        }));
    };

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

        /* ================= MINIMALIST DOOR (TOGGLEABLE) ================= */
        const doorGroup = new THREE.Group();

        const doorFrameMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#f5f5f5"),
            roughness: 0.8,
        });

        const doorFrameL = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 2.4, 0.05),
            doorFrameMat
        );
        doorFrameL.position.set(-0.6, 1.2, -6.88);
        doorFrameL.castShadow = true;

        const doorFrameR = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 2.4, 0.05),
            doorFrameMat
        );
        doorFrameR.position.set(0.6, 1.2, -6.88);
        doorFrameR.castShadow = true;

        const doorFrameT = new THREE.Mesh(
            new THREE.BoxGeometry(1.28, 0.08, 0.05),
            doorFrameMat
        );
        doorFrameT.position.set(0, 2.46, -6.88);
        doorFrameT.castShadow = true;

        const doorMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#e8e8e8"),
            roughness: 0.7,
        });

        const door = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 2.3, 0.05),
            doorMat
        );
        door.position.set(0, 1.15, -6.83);
        door.castShadow = true;

        const handleMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#cccccc"),
            metalness: 0.3,
            roughness: 0.5,
        });

        const handle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.025, 0.025, 0.12, 16),
            handleMat
        );
        handle.rotation.z = Math.PI / 2;
        handle.position.set(0.5, 1.15, -6.78);
        handle.castShadow = true;

        doorGroup.add(doorFrameL, doorFrameR, doorFrameT, door, handle);
        scene.add(doorGroup);
        groupsRef.current.door = doorGroup;

        /* ================= MINIMALIST BED (TOGGLEABLE - SLEEPING AREA - BACK LEFT) ================= */
        const bed = new THREE.Group();

        const bedMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(bedColor),
            roughness: 0.8
        });

        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 0.3, 2.8),
            bedMat
        );
        platform.position.y = 0.15;
        platform.castShadow = true;
        meshesRef.current.bed = bedMat;

        bed.add(platform);
        bed.position.set(-4.5, 0, -4);
        scene.add(bed);
        groupsRef.current.bed = bed;

        /* ================= MINIMALIST SEATING (TOGGLEABLE - LIVING AREA - LEFT SIDE) ================= */
        const seatingGroup = new THREE.Group();

        const seatingMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(sofaColor),
            roughness: 0.75
        });

        const seatingPad = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 0.5, 0.8),
            seatingMat
        );
        seatingPad.position.y = 0.35;
        seatingPad.castShadow = true;

        const backSupport = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 0.8, 0.2),
            seatingMat
        );
        backSupport.position.set(0, 0.85, -0.35);
        backSupport.castShadow = true;

        const leftArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.5, 0.8),
            seatingMat
        );
        leftArm.position.set(-1.15, 0.35, 0);
        leftArm.castShadow = true;

        const rightArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.5, 0.8),
            seatingMat
        );
        rightArm.position.set(1.15, 0.35, 0);
        rightArm.castShadow = true;

        seatingGroup.add(seatingPad, backSupport, leftArm, rightArm);
        seatingGroup.position.set(-3.5, 0, 2);
        scene.add(seatingGroup);
        groupsRef.current.sofa = seatingGroup;
        meshesRef.current.sofa = seatingMat;

        /* ================= MINIMALIST DINING TABLE (TOGGLEABLE - CENTER - FRONT) ================= */
        const tableGroup = new THREE.Group();

        const tableMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(tableColor),
            roughness: 0.7,
            metalness: 0
        });

        const tableTop = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.035, 0.8),
            tableMat
        );
        tableTop.position.y = 0.55;
        tableTop.castShadow = true;

        const legMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#999999"),
            roughness: 0.6,
            metalness: 0.3
        });

        const leg1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.06, 0.55, 0.06),
            legMat
        );
        leg1.position.set(-0.5, 0.275, -0.32);
        leg1.castShadow = true;

        const leg2 = leg1.clone();
        leg2.position.set(0.5, 0.275, -0.32);

        const leg3 = leg1.clone();
        leg3.position.set(-0.5, 0.275, 0.32);

        const leg4 = leg1.clone();
        leg4.position.set(0.5, 0.275, 0.32);

        tableGroup.add(tableTop, leg1, leg2, leg3, leg4);
        tableGroup.position.set(1, 0, 1.5);
        scene.add(tableGroup);
        groupsRef.current.table = tableGroup;
        meshesRef.current.table = tableMat;

        /* ================= MINIMALIST WALL SHELF (TOGGLEABLE - RIGHT WALL) ================= */
        const shelfGroup = new THREE.Group();

        const shelfMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#d4d4d4"),
            roughness: 0.75
        });

        const shelf1 = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.04, 0.35),
            shelfMat
        );
        shelf1.position.set(3.5, 2.2, -6.8);
        shelf1.castShadow = true;

        const shelf2 = shelf1.clone();
        shelf2.position.y = 1.5;

        const shelf3 = shelf1.clone();
        shelf3.position.y = 0.8;

        shelfGroup.add(shelf1, shelf2, shelf3);
        scene.add(shelfGroup);
        groupsRef.current.shelves = shelfGroup;

        /* ================= MINIMALIST PENDANT LAMP (TOGGLEABLE - OVER TABLE) ================= */
        const lampGroup = new THREE.Group();

        const lampMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(lampColor),
            roughness: 0.85,
            metalness: 0.1
        });

        const lampBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.03, 12),
            lampMat
        );
        lampBase.position.y = 0.015;
        lampBase.castShadow = true;

        const lampPole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.008, 0.008, 1.8, 8),
            lampMat
        );
        lampPole.position.y = 0.95;
        lampPole.castShadow = true;

        const paperMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#f8f8f8"),
            roughness: 0.9,
            side: THREE.DoubleSide
        });

        const shade = new THREE.Mesh(
            new THREE.ConeGeometry(0.22, 0.35, 12),
            paperMat
        );
        shade.position.y = 1.8;
        shade.castShadow = true;
        meshesRef.current.lamp = lampMat;

        lampGroup.add(lampBase, lampPole, shade);
        lampGroup.position.set(1, 0, 1.5);
        scene.add(lampGroup);
        groupsRef.current.lamp = lampGroup;

        /* ================= LAMP LIGHT ================= */
        const lampLight = new THREE.PointLight(0xfff5e6, 0.5, 5);
        lampLight.position.set(1, 1.8, 1.5);
        scene.add(lampLight);

        /* ================= SINGLE PLANT (TOGGLEABLE - LEFT WALL ACCENT) ================= */
        const plantGroup = new THREE.Group();

        const potMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#d4d4d4"),
            roughness: 0.8
        });

        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.22, 0.3),
            potMat
        );
        pot.position.y = 0.15;
        pot.castShadow = true;

        const plantMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(plantColor)
        });

        const plant = new THREE.Mesh(
            new THREE.SphereGeometry(0.45, 10, 10),
            plantMat
        );
        plant.position.y = 0.7;
        plant.castShadow = true;
        meshesRef.current.plant = plantMat;

        plantGroup.add(pot, plant);
        plantGroup.position.set(-5.5, 0, 1);
        scene.add(plantGroup);
        groupsRef.current.plant = plantGroup;

        /* ================= MINIMALIST MIRROR (TOGGLEABLE - WALL DECOR) ================= */
        const mirrorMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#cccccc"),
            roughness: 0.3,
            metalness: 0.6
        });

        const mirror = new THREE.Mesh(
            new THREE.CircleGeometry(0.4, 32),
            mirrorMat
        );
        mirror.rotation.y = 0;
        mirror.position.set(-5, 2.5, -6.9);
        mirror.receiveShadow = true;
        scene.add(mirror);
        groupsRef.current.mirror = mirror;

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

    // ===== HANDLE FURNITURE VISIBILITY =====
    useEffect(() => {
        Object.keys(furnitureVisibility).forEach(key => {
            if (groupsRef.current[key]) {
                groupsRef.current[key].visible = furnitureVisibility[key];
            }
        });
    }, [furnitureVisibility]);

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
        <div className="w-full">
            {/* FURNITURE TOGGLE BUTTONS */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300 p-4 rounded-t-xl">
                <h3 className="text-sm font-bold text-gray-800 mb-3">🛋️ Furniture Controls</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {Object.entries(furnitureVisibility).map(([key, isVisible]) => (
                        <button
                            key={key}
                            onClick={() => toggleFurniture(key)}
                            className={`px-3 py-2 rounded text-xs font-semibold transition-all ${isVisible
                                ? "bg-green-500 text-white shadow-lg"
                                : "bg-gray-300 text-gray-700 opacity-60"
                                }`}
                        >
                            {isVisible ? "✓" : "○"} {key.charAt(0).toUpperCase() + key.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3D ROOM */}
            <div
                ref={containerRef}
                style={{ height: "600px" }}
                className="w-full shadow-xl border-b border-gray-200"
            />
        </div>
    );
};

export const Room3DMinimalistSchema = z.object({
    wallColor: z.string().describe("Wall color hex code").optional().default("#ffffff"),
    accentWallColor: z.string().describe("Accent wall color hex code").optional().default("#f5f5f5"),
    floorColor: z.string().describe("Floor color hex code").optional().default("#e8e8e8"),
    bedColor: z.string().describe("Platform bed color hex code").optional().default("#d0d0d0"),
    sofaColor: z.string().describe("Minimalist bench color hex code").optional().default("#a8a8a8"),
    tableColor: z.string().describe("Minimalist table color hex code").optional().default("#c4a574"),
    lampColor: z.string().describe("Pendant lamp color hex code").optional().default("#e0e0e0"),
    plantColor: z.string().describe("Plant color hex code").optional().default("#6fa876"),
});
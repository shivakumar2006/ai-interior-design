import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import * as THREE from "three";
import ButtonWrapper from "../ButtonWrapper";
import { toast, Bounce } from "react-toastify";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

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
    const sceneRef = useRef(null);

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

    const exportToGLB = () => {
        if (!sceneRef.current) {
            alert("Scene not found!")
        }

        const exporter = new GLTFExporter();

        exporter.parse(sceneRef.current, (result) => {
            let blob;

            if (result instanceof ArrayBuffer) {
                blob = new Blob([result], { type: "model/gltf-binary" });
            } else {
                const json = JSON.stringify(result, null, 2);
                blob = new Blob([json], { type: "application/json" });
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href;
            link.download = `room_minimal${Date.Now()}.glb`;

            document.body = appendChild(link);
            link.click()
            document.body = removeChild(link);

            URL.revokeObjectURL(url);

            toast('Export successfully ✅', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        },
            (error) => {
                console.error("Export error:", error);
                toast.error("Export failed ❌", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                })
            },
            { binary: true }
        )
    }

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
        seatingGroup.rotation.y = Math.PI / 2;
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
        lampGroup.position.x = 2.5;
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
        <div className="w-full bg-gradient-to-b from-white to-gray-50">
            {/* ===== FURNITURE TOGGLE BUTTONS - ENHANCED ===== */}
            <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50 border-b border-gray-200 p-6 rounded-t-2xl">
                {/* HEADER SECTION */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🛋️</span>
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Furniture Controls</h3>
                        <span className="ml-auto text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                            {Object.values(furnitureVisibility).filter(Boolean).length}/{Object.keys(furnitureVisibility).length} Active
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 font-light">Toggle furniture items to customize your design</p>
                </div>

                {/* FURNITURE GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(furnitureVisibility).map(([key, isVisible]) => (
                        <div
                            key={key}
                            className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer
                            ${isVisible
                                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 shadow-md hover:shadow-lg'
                                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                                }
                        `}
                        >
                            {/* LABEL */}
                            <div className="flex items-center gap-3 flex-1">
                                <div className={`w-2 h-2 rounded-full transition-all duration-300
                                ${isVisible ? 'bg-purple-500 shadow-md shadow-purple-500' : 'bg-gray-300'}
                            `}></div>
                                <p className={`text-sm font-semibold transition-colors duration-300
                                ${isVisible ? 'text-purple-900' : 'text-gray-700'}
                            `}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </p>
                            </div>

                            {/* TOGGLE SWITCH */}
                            <ButtonWrapper
                                id={`furniture-toggle-${key}`}
                                checked={isVisible}
                                onChange={() => toggleFurniture(key)}
                            />
                        </div>
                    ))}
                </div>

                {/* INFO TEXT */}
                <div className="mt-5 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium">
                        💡 Tip: Toggle furniture items to see real-time changes in your 3D room design
                    </p>
                </div>
            </div>

            {/* ===== 3D ROOM - ENHANCED ===== */}
            <div className="relative">
                {/* LOADING OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10 pointer-events-none z-10 rounded-none"></div>

                <div
                    ref={containerRef}
                    style={{ height: "600px" }}
                    className="w-full shadow-xl border-b border-gray-300 relative"
                />

                {/* ROOM INFO OVERLAY */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg z-20">
                    <p className="text-xs font-semibold text-gray-700">🎨 3D Room Preview</p>
                    <p className="text-xs text-gray-600 mt-0.5">Drag to rotate • Scroll to zoom</p>
                </div>
            </div>

            {/* ===== EXPORT OPTIONS - ENHANCED ===== */}
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 border-t border-gray-200 p-6 rounded-b-2xl">
                {/* HEADER */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📥</span>
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Export Options</h3>
                    </div>
                    <p className="text-sm text-gray-600 font-light">Save your design for further editing or sharing</p>
                </div>

                {/* EXPORT BUTTONS */}
                <div className="space-y-3">
                    {/* PRIMARY EXPORT BUTTON */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        <button
                            onClick={exportToGLB}
                            className="relative w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 group/btn active:scale-95 cursor-pointer"
                        >
                            <span className="text-xl group-hover/btn:scale-110 transition-transform duration-300">📦</span>
                            <div className="text-left">
                                <p className="font-bold">Export 3D Model (.GLB)</p>
                                <p className="text-xs text-purple-100 font-light">Open in Blender or any 3D viewer</p>
                            </div>
                            <span className="ml-auto text-sm font-light opacity-75 group-hover/btn:opacity-100">→</span>
                        </button>
                    </div>

                    {/* INFO CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                        {[
                            { icon: '🎨', title: 'Professional', desc: 'Industry-standard GLB format' },
                            { icon: '🖨️', title: '3D Print Ready', desc: 'Print your design in real-world' },
                            { icon: '✏️', title: 'Fully Editable', desc: 'Modify in Blender or other tools' }
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="p-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-white/90 transition-all duration-300 cursor-default"
                            >
                                <p className="text-lg mb-1">{feature.icon}</p>
                                <p className="text-xs font-semibold text-gray-900">{feature.title}</p>
                                <p className="text-xs text-gray-600 font-light mt-0.5">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* QUICK TIPS */}
                    <div className="mt-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                        <p className="text-xs font-semibold text-blue-900 mb-2">💻 Quick Tips:</p>
                        <ul className="text-xs text-blue-800 space-y-1">
                            <li>✓ Click export button to download 3D model</li>
                            <li>✓ Open downloaded .glb file in Blender</li>
                            <li>✓ Use for rendering, 3D printing, or further editing</li>
                        </ul>
                    </div>
                </div>
            </div>
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
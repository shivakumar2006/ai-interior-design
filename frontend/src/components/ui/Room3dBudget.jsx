import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import * as THREE from "three";
import { toast, Bounce } from "react-toastify";
import ButtonWrapper from "../ButtonWrapper";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

export const Room3DBudget = ({
    wallColor = "#e6ddd3",
    accentWallColor = "#c4b29f",
    floorColor = "#d2b48c",
    rugColor = "#bfa58a",
    bedColor = "#f5f5f5",
    bedBaseColor = "#7a5c43",
    headboardColor = "#6b4f3a",
    sofaColor = "#5a5a5a",
    furnitureColor = "#8a6a4f",
    lampColor = "#ffd700",
    plantColor = "#5f8f5f",
    potColor = "#c9b29b",
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
        window: true,
        rug: true,
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
            alert("❌ Scene not ready. Please wait and try again.");
            return;
        }

        const exporter = new GLTFExporter();

        exporter.parse(
            sceneRef.current,
            (result) => {
                let blob;

                // ✅ If binary export => ArrayBuffer comes
                if (result instanceof ArrayBuffer) {
                    blob = new Blob([result], { type: "model/gltf-binary" });
                } else {
                    // fallback JSON export
                    const json = JSON.stringify(result, null, 2);
                    blob = new Blob([json], { type: "application/json" });
                }

                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = `room_budget_${Date.now()}.glb`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

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
        );
    };

    useEffect(() => {
        if (!containerRef.current) return;

        /* ================= SCENE ================= */
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#f3f3f3");

        sceneRef.current = scene;

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
        scene.add(new THREE.AmbientLight(0xffffff, 0.35));

        const sunLight = new THREE.DirectionalLight(0xfff1d6, 1.2);
        sunLight.position.set(6, 8, 4);
        sunLight.castShadow = true;
        scene.add(sunLight);

        const coolFill = new THREE.DirectionalLight(0xdde7ff, 0.4);
        coolFill.position.set(-6, 4, 3);
        scene.add(coolFill);

        /* ================= FLOOR (WOOD) ================= */
        const floorMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(floorColor),
            roughness: 0.65,
            metalness: 0.05,
        });
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(14, 14),
            floorMat
        );
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);
        meshesRef.current.floor = floorMat;

        /* ================= RUG (TOGGLEABLE) ================= */
        const rugMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(rugColor),
            roughness: 0.9,
        });
        const rug = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 5),
            rugMat
        );
        rug.rotation.x = -Math.PI / 2;
        rug.position.set(1.5, 0.01, -4.2);
        rug.receiveShadow = true;
        scene.add(rug);
        groupsRef.current.rug = rug;
        meshesRef.current.rug = rugMat;

        /* ================= WALLS ================= */
        const baseWallMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(wallColor),
            roughness: 0.85,
        });

        const accentWallMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(accentWallColor),
            roughness: 0.8,
        });

        const trimMat = new THREE.MeshStandardMaterial({
            color: "#f3eee8",
            roughness: 0.7,
        });

        const doorMat = new THREE.MeshStandardMaterial({
            color: "#8b6b4f",
            roughness: 0.55,
        });

        const handleMat = new THREE.MeshStandardMaterial({
            color: "#c2a46d",
            metalness: 0.6,
            roughness: 0.3,
        });

        const wallThickness = 0.25;
        const wallHeight = 6;

        // BACK WALL (ACCENT)
        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(14, wallHeight, wallThickness),
            accentWallMat
        );
        backWall.position.set(0, wallHeight / 2, -7 - wallThickness / 2);
        backWall.receiveShadow = true;
        scene.add(backWall);
        meshesRef.current.backWall = accentWallMat;

        // BACK WALL TRIMS
        const panelSpacing = 2.4;
        const panelWidth = 0.18;
        const panelDepth = 0.02;
        const panelHeight = 4.6;

        for (let x = -5.4; x <= 5.4; x += panelSpacing) {
            const trim = new THREE.Mesh(
                new THREE.BoxGeometry(panelWidth, panelHeight, panelDepth),
                trimMat
            );
            trim.position.set(
                x,
                panelHeight / 2,
                -7 + panelDepth / 2 - wallThickness
            );
            trim.castShadow = true;
            scene.add(trim);
        }

        // LEFT WALL (BASE)
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

        /* ================= DOOR (TOGGLEABLE) ================= */
        const doorGroup = new THREE.Group();

        const doorWidth = 1.4;
        const doorHeight = 2.8;
        const doorZ = -2.2;
        const frameThickness = 0.12;

        const frameL = new THREE.Mesh(
            new THREE.BoxGeometry(frameThickness, doorHeight, 0.18),
            trimMat
        );
        frameL.position.set(-7.01, doorHeight / 2, doorZ - doorWidth / 2);

        const frameR = frameL.clone();
        frameR.position.z = doorZ + doorWidth / 2;

        const frameT = new THREE.Mesh(
            new THREE.BoxGeometry(frameThickness, frameThickness, doorWidth + 0.2),
            trimMat
        );
        frameT.position.set(-7.01, doorHeight + frameThickness / 2, doorZ);

        const door = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, doorHeight - 0.15, 0.06),
            doorMat
        );
        door.position.set(-6.5, 1.4, -2.8);
        door.castShadow = true;

        const handle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.035, 0.22, 20),
            handleMat
        );
        handle.rotation.z = Math.PI / 2;
        handle.position.set(-7 + 0.18, doorHeight * 0.45, doorZ + 0.45);

        doorGroup.add(frameL, frameR, frameT, door, handle);
        doorGroup.position.set(0, 0, 7.2);
        scene.add(doorGroup);
        groupsRef.current.door = doorGroup;

        // SOFT WALL GRAZING LIGHT
        const wallGrazing = new THREE.DirectionalLight(0xffead2, 0.45);
        wallGrazing.position.set(0, 4, -2);
        wallGrazing.target.position.set(0, 3, -7);
        scene.add(wallGrazing, wallGrazing.target);

        /* ================= WINDOW (TOGGLEABLE) ================= */
        const windowFrame = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 1.6, 0.1),
            new THREE.MeshStandardMaterial({ color: "#eaeaea" })
        );
        windowFrame.position.set(3.5, 3.5, -6.9);
        scene.add(windowFrame);
        groupsRef.current.window = windowFrame;

        /* ================= BED (TOGGLEABLE) ================= */
        const bed = new THREE.Group();

        const mattressMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(bedColor),
            roughness: 0.8
        });
        const mattress = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 0.4, 3.2),
            mattressMat
        );
        mattress.position.y = 0.6;
        mattress.position.z = -1.8;
        mattress.castShadow = true;
        meshesRef.current.mattress = mattressMat;

        const baseMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(bedBaseColor),
            roughness: 0.6
        });
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(2.6, 0.4, 3.4),
            baseMat
        );
        base.position.y = 0.2;
        base.position.z = -1.7;
        base.castShadow = true;
        meshesRef.current.bedBase = baseMat;

        const headboardMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(headboardColor)
        });
        const headboard = new THREE.Mesh(
            new THREE.BoxGeometry(2.6, 1.4, 0.2),
            headboardMat
        );
        headboard.position.set(0, 1, -3.5);
        headboard.castShadow = true;
        meshesRef.current.headboard = headboardMat;

        bed.add(mattress, base, headboard);
        bed.position.set(1.5, 0, -3);
        scene.add(bed);
        groupsRef.current.bed = bed;

        /* ================= SOFA (TOGGLEABLE) ================= */
        const sofaGroup = new THREE.Group();

        const sofaMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(sofaColor),
            roughness: 0.7
        });

        const sofaBase = new THREE.Mesh(
            new THREE.BoxGeometry(3.5, 0.4, 1.2),
            sofaMat
        );
        sofaBase.position.y = 0.2;
        sofaBase.castShadow = true;

        const sofaCushion = new THREE.Mesh(
            new THREE.BoxGeometry(3.4, 0.5, 1),
            sofaMat
        );
        sofaCushion.position.y = 0.65;
        sofaCushion.castShadow = true;

        const sofaBackrest = new THREE.Mesh(
            new THREE.BoxGeometry(3.4, 1.2, 0.3),
            sofaMat
        );
        sofaBackrest.position.set(0, 1.3, -0.5);
        sofaBackrest.castShadow = true;

        const sofaArmL = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.8, 1),
            sofaMat
        );
        sofaArmL.position.set(-1.8, 0.7, 0);
        sofaArmL.castShadow = true;

        const sofaArmR = sofaArmL.clone();
        sofaArmR.position.x = 1.8;

        sofaGroup.add(sofaBase, sofaCushion, sofaBackrest, sofaArmL, sofaArmR);
        sofaGroup.position.set(-2.5, 0, 2);
        scene.add(sofaGroup);
        groupsRef.current.sofa = sofaGroup;
        meshesRef.current.sofa = sofaMat;

        /* ================= SIDE TABLE (TOGGLEABLE) ================= */
        const tableMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(furnitureColor)
        });
        const table = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.5, 0.6),
            tableMat
        );
        table.position.set(3.2, 0.25, -6.1);
        table.castShadow = true;
        scene.add(table);
        groupsRef.current.table = table;
        meshesRef.current.table = tableMat;

        /* ================= LAMP (TOGGLEABLE) ================= */
        const lampGroup = new THREE.Group();

        const lampMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(lampColor),
            metalness: 0.4,
            roughness: 0.2
        });

        const lampBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.2, 0.1, 32),
            lampMat
        );
        lampBase.position.y = 0.05;
        lampBase.castShadow = true;

        const lampPole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 1.5, 16),
            lampMat
        );
        lampPole.position.y = 0.8;
        lampPole.castShadow = true;

        const lampShadeTop = new THREE.Mesh(
            new THREE.ConeGeometry(0.25, 0.4, 32),
            lampMat
        );
        lampShadeTop.position.y = 1.8;
        lampShadeTop.castShadow = true;

        const lampShadeBottom = new THREE.Mesh(
            new THREE.CylinderGeometry(0.28, 0.25, 0.35, 32),
            lampMat
        );
        lampShadeBottom.position.y = 1.45;
        lampShadeBottom.castShadow = true;

        lampGroup.add(lampBase, lampPole, lampShadeBottom, lampShadeTop);
        lampGroup.position.set(3.2, 0, -1.8);
        scene.add(lampGroup);
        groupsRef.current.lamp = lampGroup;
        meshesRef.current.lamp = lampMat;

        /* ================= LAMP LIGHT ================= */
        const lampLight = new THREE.PointLight(0xffddaa, 0.8, 8);
        lampLight.position.set(3.2, 2, -1.8);
        scene.add(lampLight);

        /* ================= PLANT (TOGGLEABLE) ================= */
        const plantGroup = new THREE.Group();

        const potMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(potColor)
        });
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.3, 0.4),
            potMat
        );
        pot.position.set(0, 0.2, 0);
        pot.castShadow = true;
        meshesRef.current.pot = potMat;

        const plantMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(plantColor)
        });
        const plant = new THREE.Mesh(
            new THREE.SphereGeometry(0.6, 16, 16),
            plantMat
        );
        plant.position.set(0, 1, 0);
        plant.castShadow = true;
        meshesRef.current.plant = plantMat;

        plantGroup.add(pot, plant);
        plantGroup.position.set(-5.5, 0, -2);
        scene.add(plantGroup);
        groupsRef.current.plant = plantGroup;

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
        if (meshesRef.current.rug) meshesRef.current.rug.color.setStyle(rugColor);
        if (meshesRef.current.backWall) meshesRef.current.backWall.color.setStyle(accentWallColor);
        if (meshesRef.current.leftWall) meshesRef.current.leftWall.color.setStyle(wallColor);
        if (meshesRef.current.mattress) meshesRef.current.mattress.color.setStyle(bedColor);
        if (meshesRef.current.bedBase) meshesRef.current.bedBase.color.setStyle(bedBaseColor);
        if (meshesRef.current.headboard) meshesRef.current.headboard.color.setStyle(headboardColor);
        if (meshesRef.current.sofa) meshesRef.current.sofa.color.setStyle(sofaColor);
        if (meshesRef.current.table) meshesRef.current.table.color.setStyle(furnitureColor);
        if (meshesRef.current.lamp) meshesRef.current.lamp.color.setStyle(lampColor);
        if (meshesRef.current.pot) meshesRef.current.pot.color.setStyle(potColor);
        if (meshesRef.current.plant) meshesRef.current.plant.color.setStyle(plantColor);
    }, [wallColor, accentWallColor, floorColor, rugColor, bedColor, bedBaseColor, headboardColor, sofaColor, furnitureColor, lampColor, plantColor, potColor]);

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

export const Room3DBudgetSchema = z.object({
    wallColor: z.string().describe("Wall color hex code").optional().default("#e6ddd3"),
    accentWallColor: z.string().describe("Accent wall color hex code").optional().default("#c4b29f"),
    floorColor: z.string().describe("Floor color hex code").optional().default("#d2b48c"),
    rugColor: z.string().describe("Rug color hex code").optional().default("#bfa58a"),
    bedColor: z.string().describe("Bed mattress color hex code").optional().default("#f5f5f5"),
    bedBaseColor: z.string().describe("Bed base color hex code").optional().default("#7a5c43"),
    headboardColor: z.string().describe("Headboard color hex code").optional().default("#6b4f3a"),
    sofaColor: z.string().describe("Sofa color hex code").optional().default("#5a5a5a"),
    furnitureColor: z.string().describe("Side table color hex code").optional().default("#8a6a4f"),
    lampColor: z.string().describe("Lamp color hex code").optional().default("#ffd700"),
    plantColor: z.string().describe("Plant color hex code").optional().default("#5f8f5f"),
    potColor: z.string().describe("Pot color hex code").optional().default("#c9b29b"),
});
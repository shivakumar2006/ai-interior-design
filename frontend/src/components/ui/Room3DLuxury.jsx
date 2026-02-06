import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

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
    const groupsRef = useRef({}); // Store furniture groups
    const sceneRef = useRef(null); // Store scene for export

    // ===== FURNITURE VISIBILITY STATE =====
    const [furnitureVisibility, setFurnitureVisibility] = useState({
        bed: true,
        sofa: true,
        table: true,
        desk: true,
        chair: true,
        lamp: true,
        plant: true,
        tv: true,
        door: true,
        painting: true,
    });

    // ===== TOGGLE FURNITURE =====
    const toggleFurniture = (furnitureType) => {
        setFurnitureVisibility(prev => ({
            ...prev,
            [furnitureType]: !prev[furnitureType]
        }));
    };

    // ===== EXPORT 3D MODEL TO GLB =====
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
                link.download = `room_luxury_${Date.now()}.glb`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(url);

                alert("✅ Exported successfully!");
            },
            (error) => {
                console.error("Export error:", error);
                alert("❌ Export failed.");
            },
            { binary: true }
        );
    };

    useEffect(() => {
        if (!containerRef.current) return;

        /* ================= SCENE ================= */
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#2a2a2a");
        sceneRef.current = scene; // Store scene reference
        sceneRef.current = scene; // Store scene reference

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
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));

        const sunLight = new THREE.DirectionalLight(0xfff1d6, 1.3);
        sunLight.position.set(6, 8, 4);
        sunLight.castShadow = true;
        scene.add(sunLight);

        const accentLight = new THREE.DirectionalLight(0xffe8cc, 0.6);
        accentLight.position.set(-5, 5, 3);
        scene.add(accentLight);

        /* ================= FLOOR ================= */
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

        /* ================= WALLS ================= */
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

        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(14, wallHeight, wallThickness),
            accentWallMat
        );
        backWall.position.set(0, wallHeight / 2, -7 - wallThickness / 2);
        backWall.receiveShadow = true;
        scene.add(backWall);
        meshesRef.current.backWall = accentWallMat;

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

        const doorFrameMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#c4a574"),
            roughness: 0.6,
            metalness: 0.3
        });

        const doorFrameL = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 2.5, 0.08),
            doorFrameMat
        );
        doorFrameL.position.set(-6.75, 1.25, -7);
        doorFrameL.castShadow = true;

        const doorFrameR = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 2.5, 0.08),
            doorFrameMat
        );
        doorFrameR.position.set(-5.85, 1.25, -7);
        doorFrameR.castShadow = true;

        const doorFrameT = new THREE.Mesh(
            new THREE.BoxGeometry(1.05, 0.1, 0.08),
            doorFrameMat
        );
        doorFrameT.position.set(-6.3, 2.55, -7);
        doorFrameT.castShadow = true;

        const doorMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#6b5344"),
            roughness: 0.6,
            metalness: 0.1
        });

        const door = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 2.4, 0.05),
            doorMat
        );
        door.position.set(-6.3, 1.2, -6.99);
        door.castShadow = true;

        const handleMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#b5a642"),
            metalness: 0.85,
            roughness: 0.15
        });

        const handle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.18, 16),
            handleMat
        );
        handle.rotation.z = Math.PI / 2;
        handle.position.set(-5.85, 1.2, -6.94);
        handle.castShadow = true;

        doorGroup.add(doorFrameL, doorFrameR, doorFrameT, door, handle);
        scene.add(doorGroup);
        groupsRef.current.door = doorGroup;

        /* ================= PAINTING (TOGGLEABLE) ================= */
        const paintingGroup = new THREE.Group();

        const canvasMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#faf8f3"),
            roughness: 0.3,
            metalness: 0.05
        });

        const canvas = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1.2, 0.02),
            canvasMat
        );
        canvas.position.set(-3.6, 2.2, -6.98);
        canvas.castShadow = true;

        const frameMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#c9a961"),
            metalness: 0.7,
            roughness: 0.25
        });

        const frameThickness = 0.08;

        const frameTop = new THREE.Mesh(
            new THREE.BoxGeometry(1.16, frameThickness, 0.01),
            frameMat
        );
        frameTop.position.set(-3.6, 2.8, -6.97);
        frameTop.castShadow = true;

        const frameBottom = frameTop.clone();
        frameBottom.position.y = 1.6;

        const frameLeft = new THREE.Mesh(
            new THREE.BoxGeometry(frameThickness, 1.2, 0.01),
            frameMat
        );
        frameLeft.position.set(-4.2, 2.2, -6.97);
        frameLeft.castShadow = true;

        const frameRight = frameLeft.clone();
        frameRight.position.x = -3;

        const shape1Mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#d84a38"),
            roughness: 0.7
        });

        const shape1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 16, 16),
            shape1Mat
        );
        shape1.position.set(-4, 2.5, -6.97);
        shape1.castShadow = true;

        const shape2Mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#1e3a5f"),
            roughness: 0.7
        });

        const shape2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.5, 0.01),
            shape2Mat
        );
        shape2.position.set(-3.2, 1.8, -6.96);
        shape2.castShadow = true;

        const shape3Mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#e6b942"),
            roughness: 0.6
        });

        const shape3 = new THREE.Mesh(
            new THREE.ConeGeometry(0.18, 0.4, 8),
            shape3Mat
        );
        shape3.position.set(-3.6, 1.5, -6.96);
        shape3.rotation.x = Math.PI / 4;
        shape3.castShadow = true;

        paintingGroup.add(canvas, frameTop, frameBottom, frameLeft, frameRight, shape1, shape2, shape3);
        scene.add(paintingGroup);
        groupsRef.current.painting = paintingGroup;

        /* ================= BED (TOGGLEABLE) ================= */
        const bed = new THREE.Group();

        const mattressMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(bedColor),
            roughness: 0.5,
            metalness: 0.1
        });
        const mattress = new THREE.Mesh(
            new THREE.BoxGeometry(3.2, 0.5, 3.5),
            mattressMat
        );
        mattress.position.y = 0.7;
        mattress.position.z = -1.8;
        mattress.castShadow = true;
        meshesRef.current.bed = mattressMat;

        const baseMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#1a1a1a"),
            roughness: 0.5,
            metalness: 0.2
        });
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(3.4, 0.4, 3.7),
            baseMat
        );
        base.position.y = 0.2;
        base.position.z = -1.8;
        base.castShadow = true;

        const headboardMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#2a2a2a"),
            roughness: 0.6,
            metalness: 0.1
        });
        const headboard = new THREE.Mesh(
            new THREE.BoxGeometry(3.4, 2, 0.15),
            headboardMat
        );
        headboard.position.set(0, 1.2, -3.6);
        headboard.castShadow = true;

        bed.add(mattress, base, headboard);
        bed.position.set(1.5, 0, -3);
        scene.add(bed);
        groupsRef.current.bed = bed;

        /* ================= SOFA (TOGGLEABLE) ================= */
        const sofaGroup = new THREE.Group();

        const sofaMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(sofaColor),
            roughness: 0.4,
            metalness: 0.15
        });

        const sofaBase = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.5, 1.3),
            sofaMat
        );
        sofaBase.position.y = 0.3;
        sofaBase.castShadow = true;

        const sofaCushion = new THREE.Mesh(
            new THREE.BoxGeometry(3.8, 0.7, 1.1),
            sofaMat
        );
        sofaCushion.position.y = 0.9;
        sofaCushion.castShadow = true;

        const sofaBackrest = new THREE.Mesh(
            new THREE.BoxGeometry(3.8, 1.5, 0.4),
            sofaMat
        );
        sofaBackrest.position.set(0, 1.5, -0.6);
        sofaBackrest.castShadow = true;

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
        sofaGroup.position.set(-3.5, 0, 2);
        sofaGroup.position.x = -6;
        sofaGroup.rotation.y = Math.PI / 2;
        scene.add(sofaGroup);
        groupsRef.current.sofa = sofaGroup;
        meshesRef.current.sofa = sofaMat;

        /* ================= TABLE (TOGGLEABLE) ================= */
        const tableGroup = new THREE.Group();

        const marbleMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(tableColor),
            roughness: 0.2,
            metalness: 0.1,
        });

        const tableTop = new THREE.Mesh(
            new THREE.BoxGeometry(4.2, 0.1, 1.05),
            marbleMat
        );
        tableTop.position.y = 0.85;
        tableTop.castShadow = true;

        const brassLegMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#b5a642"),
            metalness: 0.95,
            roughness: 0.1
        });

        const legGeom = new THREE.BoxGeometry(0.22, 0.85, 0.22);

        const leg_1 = new THREE.Mesh(legGeom, brassLegMat);
        leg_1.position.set(-1.95, 0.425, -0.42);

        const leg_2 = leg_1.clone();
        leg_2.position.set(1.95, 0.425, -0.42);

        const leg_3 = leg_1.clone();
        leg_3.position.set(-1.95, 0.425, 0.42);

        const leg_4 = leg_1.clone();
        leg_4.position.set(1.95, 0.425, 0.42);

        const lowerShelf1 = new THREE.Mesh(
            new THREE.BoxGeometry(3.6, 0.06, 0.8),
            marbleMat
        );
        lowerShelf1.position.y = 0.4;

        const lowerShelf2 = lowerShelf1.clone();
        lowerShelf2.position.y = 0.18;

        lowerShelf1.castShadow = true;
        lowerShelf2.castShadow = true;

        tableGroup.add(
            tableTop,
            leg_1, leg_2, leg_3, leg_4,
            lowerShelf1, lowerShelf2
        );

        tableGroup.position.set(0, 0, 6.6);
        scene.add(tableGroup);
        groupsRef.current.table = tableGroup;
        meshesRef.current.table = marbleMat;

        /* ================= TV (TOGGLEABLE) ================= */
        const tvGroup = new THREE.Group();

        const tvFrame = new THREE.Mesh(
            new THREE.BoxGeometry(3.8, 2.2, 0.12),
            new THREE.MeshStandardMaterial({
                color: "#0b0b0b",
                roughness: 0.3,
                metalness: 0.4
            })
        );

        const tvScreen = new THREE.Mesh(
            new THREE.BoxGeometry(3.6, 2.05, 0.05),
            new THREE.MeshStandardMaterial({
                color: "#000000",
                metalness: 0.75,
                roughness: 0.1,
                emissive: "#0a0a0a",
                emissiveIntensity: 0.4
            })
        );

        tvGroup.add(tvFrame, tvScreen);
        tvGroup.position.set(0, 2.65, 6.7);
        tvGroup.rotation.y = Math.PI;
        scene.add(tvGroup);
        groupsRef.current.tv = tvGroup;

        const tvGlow = new THREE.PointLight(0xffe6c7, 0.75, 5);
        tvGlow.position.set(0, 2.65, 6.5);
        scene.add(tvGlow);

        /* ================= DESK (TOGGLEABLE) ================= */
        const deskGroup = new THREE.Group();

        const deskTopMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#8b6f47"),
            roughness: 0.5,
            metalness: 0
        });

        const deskTop = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 0.05, 1.1),
            deskTopMat
        );
        deskTop.position.y = 0.75;
        deskTop.position.x = 0.7;
        deskTop.position.z = -4;
        deskTop.castShadow = true;

        const deskLegMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#b5a642"),
            metalness: 0.85,
            roughness: 0.15
        });

        const deskLeg1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.75, 0.08),
            deskLegMat
        );
        deskLeg1.position.set(-0.3, 0.375, -4.5);
        deskLeg1.castShadow = true;

        const deskLeg2 = deskLeg1.clone();
        deskLeg2.position.set(1.7, 0.375, -4.5);

        const deskLeg3 = deskLeg1.clone();
        deskLeg3.position.set(-0.3, 0.375, -3.5);

        const deskLeg4 = deskLeg1.clone();
        deskLeg4.position.set(1.7, 0.375, -3.5);

        const laptopMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#1a1a1a"),
            metalness: 0.6,
            roughness: 0.3
        });

        const laptop = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.03, 0.35),
            laptopMat
        );
        laptop.position.set(0.7, 0.78, -4);
        laptop.rotation.x = 0.2;
        laptop.castShadow = true;

        const screenMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#0a0a0a"),
            metalness: 0.5,
            roughness: 0.2
        });

        const screen = new THREE.Mesh(
            new THREE.BoxGeometry(0.48, 0.25, 0.02),
            screenMat
        );
        screen.position.set(0.7, 0.92, -4.2);
        screen.rotation.x = -0.3;
        screen.castShadow = true;

        deskGroup.add(deskTop, deskLeg1, deskLeg2, deskLeg3, deskLeg4, laptop, screen);
        deskGroup.position.set(4.5, 0, -2);
        scene.add(deskGroup);
        groupsRef.current.desk = deskGroup;

        /* ================= CHAIR (TOGGLEABLE) ================= */
        const chairGroup = new THREE.Group();

        const chairMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#2c2c2c"),
            roughness: 0.4,
            metalness: 0.2
        });

        const chairSeat = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 0.15, 24),
            chairMat
        );
        chairSeat.position.y = 0.5;
        chairSeat.position.x = 0.7;
        chairSeat.position.z = -3.5;
        chairSeat.castShadow = true;

        const backrestMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 1.2, 0.15),
            chairMat
        );
        backrestMesh.position.set(0.7, 1.3, -3);
        backrestMesh.castShadow = true;

        const poleMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#666666"),
            metalness: 0.7,
            roughness: 0.3
        });

        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12),
            poleMat
        );
        pole.position.y = 0.25;
        pole.position.x = 0.7;
        pole.position.z = -3.5;
        pole.castShadow = true;

        const wheelMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#444444"),
            metalness: 0.6,
            roughness: 0.4
        });

        const wheelBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 0.08, 20),
            wheelMat
        );
        wheelBase.position.y = 0.04;
        wheelBase.position.x = 0.7;
        wheelBase.position.z = -3.5;
        wheelBase.castShadow = true;

        chairGroup.add(chairSeat, backrestMesh, pole, wheelBase);
        chairGroup.position.set(4.5, 0, -0.2);
        scene.add(chairGroup);
        groupsRef.current.chair = chairGroup;

        /* ================= LAMP (TOGGLEABLE) ================= */
        const lampGroup = new THREE.Group();

        const lampMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(lampColor),
            metalness: 0.7,
            roughness: 0.2
        });

        const luxBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.22, 0.12, 24),
            lampMat
        );
        luxBase.position.y = 0.06;
        luxBase.position.x = -4.2;
        luxBase.position.z = -4.2;
        luxBase.castShadow = true;

        const luxPole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.025, 0.025, 1.8, 16),
            lampMat
        );
        luxPole.position.y = 1;
        luxPole.position.x = -4.2;
        luxPole.position.z = -4.2;
        luxPole.castShadow = true;

        const luxShadeMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#f0e8d8"),
            roughness: 0.7,
            side: THREE.DoubleSide
        });

        const shadeGeom = new THREE.ConeGeometry(0.35, 0.5, 20);
        const luxShade = new THREE.Mesh(shadeGeom, luxShadeMat);
        luxShade.position.y = 1.8;
        luxShade.position.x = -4.2;
        luxShade.position.z = -4.2;
        luxShade.castShadow = true;

        lampGroup.add(luxBase, luxPole, luxShade);
        lampGroup.position.set(3.5, 0, -2);
        scene.add(lampGroup);
        groupsRef.current.lamp = lampGroup;
        meshesRef.current.lamp = lampMat;

        const lampLight = new THREE.PointLight(0xffd699, 0.9, 10);
        lampLight.position.set(3.5, 1.8, -2);
        scene.add(lampLight);

        /* ================= PLANT (TOGGLEABLE) ================= */
        const plantGroup = new THREE.Group();

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
            <div className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-300 p-4 rounded-t-xl">
                <h3 className="text-sm font-bold text-gray-800 mb-3">🛋️ Furniture Controls</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {Object.entries(furnitureVisibility).map(([key, isVisible]) => (
                        <button
                            key={key}
                            onClick={() => toggleFurniture(key)}
                            className={`px-3 py-2 rounded text-xs font-semibold transition-all cursor-pointer ${isVisible
                                ? "bg-blue-500 text-white shadow-lg"
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

            {/* EXPORT BUTTONS BAR
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-300 p-4 rounded-b-xl">
                <h3 className="text-sm font-bold text-gray-800 mb-3">📥 Export Options</h3>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={exportToGLB}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        📦 Export 3D Model (.GLB)
                    </button>
                    <p className="text-xs text-gray-600 flex items-center">
                        ✨ Open in Blender or any 3D viewer
                    </p>
                </div>
            </div> */}

            {/* EXPORT BUTTONS BAR */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-300 p-4 rounded-b-xl">
                <h3 className="text-sm font-bold text-gray-800 mb-3">📥 Export Options</h3>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={exportToGLB}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        📦 Export 3D Model (.GLB)
                    </button>
                    <p className="text-xs text-gray-600 flex items-center">
                        Open in Blender or any 3D viewer
                    </p>
                </div>
            </div>
        </div>
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
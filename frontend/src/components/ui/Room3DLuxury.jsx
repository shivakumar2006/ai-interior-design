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

        // LEFT WALL with DOOR
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

        /* ================= LUXURY DOOR (WIDER - LEFT WALL) ================= */
        const doorGroup = new THREE.Group();

        // Wider door frame (luxury detail)
        const doorFrameMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#c4a574"),
            roughness: 0.6,
            metalness: 0.3
        });

        // Door frame - left side
        const doorFrameL = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 2.5, 0.08),
            doorFrameMat
        );
        doorFrameL.position.set(-6.75, 1.25, 0);
        doorFrameL.position.z = -7;
        doorFrameL.castShadow = true;

        // Door frame - right side
        const doorFrameR = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 2.5, 0.08),
            doorFrameMat
        );
        doorFrameR.position.set(-5.85, 1.25, 0);
        doorFrameR.position.z = -7;
        doorFrameR.castShadow = true;

        // Door frame - top
        const doorFrameT = new THREE.Mesh(
            new THREE.BoxGeometry(1.05, 0.1, 0.08),  // WIDER: was 0.95
            doorFrameMat
        );
        doorFrameT.position.set(-6.3, 2.55, 0);
        doorFrameT.position.z = -7;
        doorFrameT.castShadow = true;

        // Wider door panel (walnut luxury wood)
        const doorMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#6b5344"),
            roughness: 0.6,
            metalness: 0.1
        });

        const door = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 2.4, 0.05),  // WIDER: was 0.8
            doorMat
        );
        door.position.set(-6.3, 1.2, -6.99);
        door.castShadow = true;

        // Door handle (brass luxury)
        const handleMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#b5a642"),
            metalness: 0.85,
            roughness: 0.15
        });

        const handle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.18, 16),  // BIGGER handle
            handleMat
        );
        handle.rotation.z = Math.PI / 2;
        handle.position.set(-5.85, 1.2, -6.94);
        handle.castShadow = true;

        doorGroup.add(doorFrameL, doorFrameR, doorFrameT, door, handle);
        scene.add(doorGroup);

        /* ================= ABSTRACT WALL PAINTING (LEFT WALL) ================= */
        const paintingGroup = new THREE.Group();

        // Painting canvas (white background)
        const canvasMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#faf8f3"),
            roughness: 0.3,
            metalness: 0.05
        });

        const canvas = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1.2, 0.02),
            canvasMat
        );
        canvas.position.set(-5.5, 2.2, -6.98);
        canvas.position.x = -3.6;
        canvas.castShadow = true;

        // Painting frame (gold/brass)
        const frameMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#c9a961"),
            metalness: 0.7,
            roughness: 0.25
        });

        // Frame border (simple rectangle outline effect via 4 side pieces)
        const frameThickness = 0.08;

        const frameTop = new THREE.Mesh(
            new THREE.BoxGeometry(1.16, frameThickness, 0.01),
            frameMat
        );
        frameTop.position.set(-5.5, 2.8, -6.97);
        frameTop.position.x = -3.6;
        frameTop.castShadow = true;

        const frameBottom = frameTop.clone();
        frameBottom.position.y = 1.6;
        frameBottom.position.x = -3.6;

        const frameLeft = new THREE.Mesh(
            new THREE.BoxGeometry(frameThickness, 1.2, 0.01),
            frameMat
        );
        frameLeft.position.set(-6.08, 2.2, -6.97);
        frameLeft.position.x = -4.2;
        frameLeft.castShadow = true;

        const frameRight = frameLeft.clone();
        frameRight.position.x = -3;

        // Abstract painting design (3 colored shapes)
        // Shape 1: Red/orange circle
        const shape1Mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#d84a38"),
            roughness: 0.7
        });

        const shape1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 16, 16),
            shape1Mat
        );
        shape1.position.set(-5.8, 2.5, -6.97);
        shape1.position.x = -4;
        shape1.castShadow = true;

        // Shape 2: Blue rectangle
        const shape2Mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#1e3a5f"),
            roughness: 0.7
        });

        const shape2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.5, 0.01),
            shape2Mat
        );
        shape2.position.set(-5.2, 1.8, -6.96);
        shape2.position.x = -3.2;
        shape2.castShadow = true;

        // Shape 3: Yellow/gold accent
        const shape3Mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#e6b942"),
            roughness: 0.6
        });

        const shape3 = new THREE.Mesh(
            new THREE.ConeGeometry(0.18, 0.4, 8),
            shape3Mat
        );
        shape3.position.set(-5.5, 1.5, -6.96);
        shape3.position.x =
            shape3.rotation.x = Math.PI / 4;
        shape3.castShadow = true;

        paintingGroup.add(canvas, frameTop, frameBottom, frameLeft, frameRight, shape1, shape2, shape3);
        scene.add(paintingGroup);

        /* ================= LUXURY KING BED ================= */
        const bed = new THREE.Group();

        // Premium king mattress (larger)
        const mattressMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(bedColor),
            roughness: 0.5,
            metalness: 0.1
        });
        const mattress = new THREE.Mesh(
            new THREE.BoxGeometry(3.2, 0.5, 3.5),  // King size: wider and longer
            mattressMat
        );
        mattress.position.y = 0.7;
        mattress.position.z = -1.8;
        mattress.castShadow = true;
        meshesRef.current.bed = mattressMat;

        // Premium base
        const baseMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#1a1a1a"),
            roughness: 0.5,
            metalness: 0.2
        });
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(3.4, 0.4, 3.7),  // Slightly larger base
            baseMat
        );
        base.position.y = 0.2;
        base.position.z = -1.8;
        base.castShadow = true;

        // Luxury king headboard (larger, more impressive)
        const headboardMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#2a2a2a"),
            roughness: 0.6,
            metalness: 0.1
        });
        const headboard = new THREE.Mesh(
            new THREE.BoxGeometry(3.4, 2, 0.15),  // Taller headboard for king bed
            headboardMat
        );
        headboard.position.set(0, 1.2, -3.6);  // Positioned at head of bed
        headboard.castShadow = true;

        bed.add(mattress, base, headboard);
        bed.position.set(1.5, 0, -3);  // Positioned in back right area
        scene.add(bed);

        /* ================= LUXURY SOFA (LEFT SIDE - LIVING AREA) ================= */
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
        sofaGroup.position.set(-3.5, 0, 2);  // LEFT SIDE - Living area facing room
        sofaGroup.position.x = -6;
        sofaGroup.rotation.y = Math.PI / 2;

        scene.add(sofaGroup);
        meshesRef.current.sofa = sofaMat;

        /* ================= LUXURY DESK WITH LAPTOP (LARGER) ================= */
        const deskGroup = new THREE.Group();

        // Larger luxury desk top (walnut wood style)
        const deskTopMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#8b6f47"),
            roughness: 0.5,
            metalness: 0
        });

        const deskTop = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 0.05, 1.1),  // BIGGER: was 1.6 × 0.8
            deskTopMat
        );
        deskTop.position.y = 0.75;
        deskTop.position.x = 0.7;
        deskTop.position.z = -4;
        deskTop.castShadow = true;

        // Larger luxury desk legs (brass)
        const deskLegMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#b5a642"),
            metalness: 0.85,
            roughness: 0.15
        });

        const deskLeg1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.75, 0.08),  // BIGGER legs
            deskLegMat
        );
        deskLeg1.position.set(-1, 0.375, -0.45);
        deskLeg1.position.x = -0.3;
        deskLeg1.position.z = -4.5;
        deskLeg1.castShadow = true;

        const deskLeg2 = deskLeg1.clone();
        deskLeg2.position.set(1, 0.375, -0.45);
        deskLeg2.position.x = 1.7;
        deskLeg2.position.z = -4.5;

        const deskLeg3 = deskLeg1.clone();
        deskLeg3.position.set(-1, 0.375, 0.45);
        deskLeg3.position.x = -0.3;
        deskLeg3.position.z = -3.5;

        const deskLeg4 = deskLeg1.clone();
        deskLeg4.position.set(1, 0.375, 0.45);
        deskLeg4.position.x = 1.7;
        deskLeg4.position.z = -3.5;

        // Larger luxury laptop on desk
        const laptopMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#1a1a1a"),
            metalness: 0.6,
            roughness: 0.3
        });

        // Larger laptop body
        const laptop = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.03, 0.35),  // BIGGER: was 0.35 × 0.25
            laptopMat
        );
        laptop.position.set(0.5, 0.78, 0);
        laptop.rotation.x = 0.2;
        laptop.position.z = -4;
        laptop.castShadow = true;

        // Larger laptop screen
        const screenMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#0a0a0a"),
            metalness: 0.5,
            roughness: 0.2
        });

        const screen = new THREE.Mesh(
            new THREE.BoxGeometry(0.48, 0.25, 0.02),  // BIGGER screen
            screenMat
        );
        screen.position.set(0.5, 0.92, -0.08);
        screen.rotation.x = -0.3;
        screen.position.z = -4.2;
        screen.castShadow = true;

        deskGroup.add(deskTop, deskLeg1, deskLeg2, deskLeg3, deskLeg4, laptop, screen);
        deskGroup.position.set(4.5, 0, -2);
        scene.add(deskGroup);
        /* ================= ULTRA LUXURY CONSOLE TABLE + TV ================= */
        const tableGroup = new THREE.Group();

        // ===== Marble Material =====
        const marbleMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(tableColor),
            roughness: 0.2,
            metalness: 0.1,
        });

        // ===== EXTRA EXTRA WIDE CONSOLE TOP =====
        const tableTop = new THREE.Mesh(
            new THREE.BoxGeometry(4.2, 0.1, 1.05), // 🔥 EVEN BIGGER = REAL LUXURY
            marbleMat
        );
        tableTop.position.y = 0.85;
        tableTop.castShadow = true;

        // ===== THICK HEAVY BRASS LEGS =====
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
        leg_3.position.set(-1.95, 0.425, 0.42); // ✅ FIXED

        const leg_4 = leg_1.clone();
        leg_4.position.set(1.95, 0.425, 0.42);

        // ===== DOUBLE THICK LOWER SHELVES =====
        const lowerShelf1 = new THREE.Mesh(
            new THREE.BoxGeometry(3.6, 0.06, 0.8),
            marbleMat
        );
        lowerShelf1.position.y = 0.4;

        const lowerShelf2 = lowerShelf1.clone();
        lowerShelf2.position.y = 0.18;

        lowerShelf1.castShadow = true;
        lowerShelf2.castShadow = true;

        // Assemble console
        tableGroup.add(
            tableTop,
            leg_1, leg_2, leg_3, leg_4,
            lowerShelf1, lowerShelf2
        );

        // ===== POSITION (BACK WALL STATEMENT PIECE) =====
        tableGroup.position.set(0, 0, -5.2);
        tableGroup.position.z = 6.6;
        scene.add(tableGroup);

        // AI color control
        meshesRef.current.table = marbleMat;

        /* ================= MASSIVE LUXURY TV ================= */
        const tvGroup = new THREE.Group();

        // ===== TV FRAME (VERY LARGE) =====
        const tvFrame = new THREE.Mesh(
            new THREE.BoxGeometry(3.8, 2.2, 0.12), // 🔥 PENTHOUSE TV
            new THREE.MeshStandardMaterial({
                color: "#0b0b0b",
                roughness: 0.3,
                metalness: 0.4
            })
        );

        // ===== TV SCREEN =====
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

        // ===== TV POSITION (DOMINANT + BED FACING) =====
        tvGroup.position.set(0, 2.65, -4.95);
        tvGroup.rotation.y = Math.PI; // FACE BED
        tvGroup.position.z = 6.7;
        scene.add(tvGroup);

        // ===== STRONG CINEMATIC BACK GLOW =====
        const tvGlow = new THREE.PointLight(0xffe6c7, 0.75, 5);
        tvGlow.position.set(0, 2.65, -4.65);
        scene.add(tvGlow);

        /* ================= LUXURY OFFICE CHAIR (LARGER) ================= */
        const chairGroup = new THREE.Group();

        // Larger chair seat
        const chairMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#2c2c2c"),
            roughness: 0.4,
            metalness: 0.2
        });

        const chairSeat = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 0.15, 24),  // BIGGER: was 0.35
            chairMat
        );
        chairSeat.position.y = 0.5;
        chairSeat.position.x = 0.7;
        chairSeat.position.z = -3.5;
        chairSeat.castShadow = true;

        // Larger chair backrest
        const backrestMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 1.2, 0.15),  // BIGGER: was 0.5 × 0.8
            chairMat
        );
        backrestMesh.position.set(0, 1.3, -0.35);
        backrestMesh.position.x = 0.7;
        backrestMesh.position.z = -3;
        backrestMesh.castShadow = true;

        // Larger chair pole (metal)
        const poleMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#666666"),
            metalness: 0.7,
            roughness: 0.3
        });

        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12),  // BIGGER pole
            poleMat
        );
        pole.position.y = 0.25;
        pole.position.x = 0.7;
        pole.position.z = -3.5;
        pole.castShadow = true;

        // Larger chair wheels base
        const wheelMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#444444"),
            metalness: 0.6,
            roughness: 0.4
        });

        const wheelBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 0.08, 20),  // BIGGER: was 0.3
            wheelMat
        );
        wheelBase.position.y = 0.04;
        wheelBase.position.x = 0.7;
        wheelBase.position.z = -3.5;
        wheelBase.castShadow = true;

        chairGroup.add(chairSeat, backrestMesh, pole, wheelBase);
        chairGroup.position.set(4.5, 0, -0.2);
        scene.add(chairGroup);
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
        luxBase.position.x = -4.2;
        luxBase.position.z = -4.2;
        luxBase.castShadow = true;

        // Lamp pole
        const luxPole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.025, 0.025, 1.8, 16),
            lampMat
        );
        luxPole.position.y = 1;
        luxPole.position.x = -4.2;
        luxPole.position.z = -4.2;
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
        luxShade.position.x = -4.2;
        luxShade.position.z = -4.2;
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
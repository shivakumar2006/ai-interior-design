import { useEffect, useRef } from "react";
import { z } from "zod";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

    useEffect(() => {
        if (!containerRef.current) return;

        /* ================= SCENE ================= */
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#f3f3f3");

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

        /* ================= RUG ================= */
        const rugMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(rugColor),
            roughness: 0.9,
        });
        const rug = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 5),
            rugMat
        );
        rug.rotation.x = -Math.PI / 2;
        rug.position.set(1.5, 0.01, -2.5);
        rug.position.z = -4.2;
        scene.add(rug);
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

        // DOOR
        const doorWidth = 1.4;
        const doorHeight = 2.8;
        const doorZ = -2.2;
        const frameThickness = 0.12;

        const doorGroup = new THREE.Group();

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
        door.position.set(-7 + 0.12, (doorHeight - 0.15) / 2, doorZ);
        door.position.x = -6.5;
        door.position.z = -2.8;
        door.position.y = 1.4;
        door.castShadow = true;

        const handle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.035, 0.22, 20),
            handleMat
        );
        handle.rotation.z = Math.PI / 2;
        handle.position.set(-7 + 0.18, doorHeight * 0.45, doorZ + 0.45);

        doorGroup.add(frameL, frameR, frameT, door, handle);
        scene.add(doorGroup);

        doorGroup.position.x = 0;
        doorGroup.position.z = 7.2;

        // SOFT WALL GRAZING LIGHT
        const wallGrazing = new THREE.DirectionalLight(0xffead2, 0.45);
        wallGrazing.position.set(0, 4, -2);
        wallGrazing.target.position.set(0, 3, -7);
        scene.add(wallGrazing, wallGrazing.target);

        /* ================= WINDOW ================= */
        const windowFrame = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 1.6, 0.1),
            new THREE.MeshStandardMaterial({ color: "#eaeaea" })
        );
        windowFrame.position.set(3.5, 3.5, -6.9);
        scene.add(windowFrame);

        /* ================= BED ================= */
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
        meshesRef.current.bedBase = baseMat;

        const headboardMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(headboardColor)
        });
        const headboard = new THREE.Mesh(
            new THREE.BoxGeometry(2.6, 1.4, 0.2),
            headboardMat
        );
        headboard.position.set(0, 1, -1.7);
        headboard.position.z = -3.5;
        meshesRef.current.headboard = headboardMat;

        bed.add(mattress, base, headboard);
        bed.position.set(1.5, 0, -3);
        bed.traverse(o => (o.castShadow = true));
        scene.add(bed);

        /* ================= SOFA ================= */
        const sofaGroup = new THREE.Group();

        const sofaMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(sofaColor),
            roughness: 0.7
        });

        // Sofa base/frame
        const sofaBase = new THREE.Mesh(
            new THREE.BoxGeometry(3.5, 0.4, 1.2),
            sofaMat
        );
        sofaBase.position.y = 0.2;
        sofaBase.castShadow = true;

        // Sofa cushion/seat
        const sofaCushion = new THREE.Mesh(
            new THREE.BoxGeometry(3.4, 0.5, 1),
            sofaMat
        );
        sofaCushion.position.y = 0.65;
        sofaCushion.castShadow = true;

        // Sofa backrest
        const sofaBackrest = new THREE.Mesh(
            new THREE.BoxGeometry(3.4, 1.2, 0.3),
            sofaMat
        );
        sofaBackrest.position.set(0, 1.3, -0.5);
        sofaBackrest.castShadow = true;

        // Left armrest
        const sofaArmL = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.8, 1),
            sofaMat
        );
        sofaArmL.position.set(-1.8, 0.7, 0);
        sofaArmL.castShadow = true;

        // Right armrest
        const sofaArmR = sofaArmL.clone();
        sofaArmR.position.x = 1.8;

        sofaGroup.add(sofaBase, sofaCushion, sofaBackrest, sofaArmL, sofaArmR);
        sofaGroup.position.set(-2.5, 0, 2);
        scene.add(sofaGroup);
        meshesRef.current.sofa = sofaMat;

        /* ================= SIDE TABLE ================= */
        const tableMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(furnitureColor)
        });
        const table = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.5, 0.6),
            tableMat
        );
        table.position.set(3.2, 0.25, -1.8);
        table.position.z = -6.1;
        table.castShadow = true;
        scene.add(table);
        meshesRef.current.table = tableMat;

        /* ================= LAMP - PROPERLY SHAPED ================= */
        const lampGroup = new THREE.Group();

        const lampMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(lampColor),
            metalness: 0.4,
            roughness: 0.2
        });

        // Lamp base (stand)
        const lampBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.2, 0.1, 32),
            lampMat
        );
        lampBase.position.y = 0.05;
        lampBase.position.z = -4.4;
        lampBase.position.x = -3.5;
        lampBase.castShadow = true;

        // Lamp pole (vertical rod)
        const lampPole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 1.5, 16),
            lampMat
        );
        lampPole.position.y = 0.8;
        lampPole.position.z = -4.4;
        lampPole.position.x = -3.5;
        lampPole.castShadow = true;

        // Lamp head (shade top - cone)
        const lampShadeTop = new THREE.Mesh(
            new THREE.ConeGeometry(0.25, 0.4, 32),
            lampMat
        );
        lampShadeTop.position.y = 1.8;
        lampShadeTop.position.z = -4.4;
        lampShadeTop.position.x = -3.5;
        lampShadeTop.castShadow = true;

        // Lamp shade bottom (cylinder)
        const lampShadeBottom = new THREE.Mesh(
            new THREE.CylinderGeometry(0.28, 0.25, 0.35, 32),
            lampMat
        );
        lampShadeBottom.position.y = 1.45;
        lampShadeBottom.position.z = -4.4;
        lampShadeBottom.position.x = -3.5;
        lampShadeBottom.castShadow = true;

        lampGroup.add(lampBase, lampPole, lampShadeBottom, lampShadeTop);
        lampGroup.position.set(3.2, 0, -1.8);
        scene.add(lampGroup);
        meshesRef.current.lamp = lampMat;

        /* ================= LAMP LIGHT ================= */
        const lampLight = new THREE.PointLight(0xffddaa, 0.8, 8);
        lampLight.position.set(3.2, 2, -1.8);
        scene.add(lampLight);

        /* ================= PLANT ================= */
        const potMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(potColor)
        });
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.3, 0.4),
            potMat
        );
        pot.position.set(-5.5, 0.2, -2);
        pot.castShadow = true;
        meshesRef.current.pot = potMat;

        const plantMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(plantColor)
        });
        const plant = new THREE.Mesh(
            new THREE.SphereGeometry(0.6, 16, 16),
            plantMat
        );
        plant.position.set(-5.5, 1, -2);
        plant.castShadow = true;
        meshesRef.current.plant = plantMat;

        scene.add(pot, plant);

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

        // Update colors
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
        <div
            ref={containerRef}
            style={{ height: "600px" }}
            className="w-full rounded-xl overflow-hidden shadow-xl border"
        />
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
import { useEffect, useRef } from "react";
import { z } from "zod";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const Room3D = () => {
    const containerRef = useRef(null);

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
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(14, 14),
            new THREE.MeshStandardMaterial({
                color: "#d2b48c",
                roughness: 0.65,
                metalness: 0.05,
            })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);

        /* ================= RUG ================= */
        const rug = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 5),
            new THREE.MeshStandardMaterial({
                color: "#bfa58a",
                roughness: 0.9,
            })
        );
        rug.rotation.x = -Math.PI / 2;
        rug.position.set(1.5, 0.01, -2.5);
        scene.add(rug);

        /* ================= LUXURY WALLS ================= */

        /* ================= ARCHITECTURAL LUXURY WALLS ================= */

        // -------- Materials --------

        /* ================= HIGH-QUALITY ARCHITECTURAL WALLS ================= */

        // ---------- Materials ----------
        const baseWallMat = new THREE.MeshStandardMaterial({
            color: "#e6ddd3",
            roughness: 0.85,
        });

        const accentWallMat = new THREE.MeshStandardMaterial({
            color: "#c4b29f",
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

        // ---------- WALL THICKNESS ----------
        const wallThickness = 0.25;
        const wallHeight = 6;

        // ---------- BACK WALL (ACCENT) ----------
        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(14, wallHeight, wallThickness),
            accentWallMat
        );
        backWall.position.set(0, wallHeight / 2, -7 - wallThickness / 2);
        backWall.receiveShadow = true;
        scene.add(backWall);

        // ---------- BACK WALL TRIMS (FLUSH PANELS) ----------
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

        // ---------- LEFT WALL (BASE) ----------
        const sideWallDepth = 14;

        const sideWall = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, sideWallDepth),
            baseWallMat
        );

        // Center the wall so it aligns with floor + back wall
        sideWall.position.set(
            -7 - wallThickness / 2,
            wallHeight / 2,
            -7 + sideWallDepth / 2
        );

        sideWall.receiveShadow = true;
        scene.add(sideWall);

        // ---------- DOOR OPENING (LUXURY SCALE) ----------
        const doorWidth = 1.4;
        const doorHeight = 2.8;
        const doorZ = -2.2;

        // Door frame thickness (luxury = thicker)
        const frameThickness = 0.12;

        // Left frame
        const frameL = new THREE.Mesh(
            new THREE.BoxGeometry(frameThickness, doorHeight, 0.18),
            trimMat
        );
        frameL.position.set(-7.01, doorHeight / 2, doorZ - doorWidth / 2);

        // Right frame
        const frameR = frameL.clone();
        frameR.position.z = doorZ + doorWidth / 2;

        // Top frame
        const frameT = new THREE.Mesh(
            new THREE.BoxGeometry(frameThickness, frameThickness, doorWidth + 0.2),
            trimMat
        );
        frameT.position.set(
            -7.01,
            doorHeight + frameThickness / 2,
            doorZ
        );

        // Door panel (slightly inset, taller)
        // Door panel (CLOSED — flush with wall)
        const door = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, doorHeight - 0.15, 0.06),
            doorMat
        );

        // Push door INTO the wall so it looks closed
        door.position.set(
            -7 + 0.12,                 // inside wall thickness
            (doorHeight - 0.15) / 2,
            doorZ
        );

        door.castShadow = true;

        // Door handle (placed higher for tall door)
        const handle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.035, 0.22, 20),
            handleMat
        );
        handle.rotation.z = Math.PI / 2;
        handle.position.set(
            -7 + 0.18,
            doorHeight * 0.45,
            doorZ + 0.45
        );


        // Add door parts
        scene.add(frameL, frameR, frameT, door, handle);


        // ---------- SOFT WALL GRAZING LIGHT ----------
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

        const mattress = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 0.4, 3.2),
            new THREE.MeshStandardMaterial({ color: "#f5f5f5", roughness: 0.8 })
        );
        mattress.position.y = 0.6;

        const base = new THREE.Mesh(
            new THREE.BoxGeometry(2.6, 0.4, 3.4),
            new THREE.MeshStandardMaterial({ color: "#7a5c43", roughness: 0.6 })
        );
        base.position.y = 0.2;

        const headboard = new THREE.Mesh(
            new THREE.BoxGeometry(2.6, 1.4, 0.2),
            new THREE.MeshStandardMaterial({ color: "#6b4f3a" })
        );
        headboard.position.set(0, 1, -1.7);

        bed.add(mattress, base, headboard);
        bed.position.set(1.5, 0, -3);
        bed.traverse(o => (o.castShadow = true));
        scene.add(bed);

        /* ================= SIDE TABLE ================= */
        const table = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.5, 0.6),
            new THREE.MeshStandardMaterial({ color: "#8a6a4f" })
        );
        table.position.set(3.2, 0.25, -1.8);
        table.castShadow = true;
        scene.add(table);

        /* ================= PLANT ================= */
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.3, 0.4),
            new THREE.MeshStandardMaterial({ color: "#c9b29b" })
        );
        pot.position.set(-5.5, 0.2, -2);

        const plant = new THREE.Mesh(
            new THREE.SphereGeometry(0.6, 16, 16),
            new THREE.MeshStandardMaterial({ color: "#5f8f5f" })
        );
        plant.position.set(-5.5, 1, -2);

        scene.add(pot, plant);

        /* ================= LAMP ================= */
        const lampLight = new THREE.PointLight(0xffddaa, 0.7, 6);
        lampLight.position.set(3.2, 2, -1.8);
        scene.add(lampLight);

        /* ================= ANIMATION ================= */
        const animate = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        /* ================= CLEANUP ================= */
        return () => {
            controls.dispose();
            renderer.dispose();
            // containerRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ height: "600px" }}
            className="w-full rounded-xl overflow-hidden shadow-xl border"
        />
    );
};

export const Room3DSchema = z.object({});

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { XREstimatedLight } from "three/examples/jsm/webxr/XREstimatedLight.js";

export const RoomAR = ({
    furnitureItems = [
        { name: "Sofa", position: [0, 0, 0], size: [3.5, 1.2, 1.2], color: "#5a5a5a" },
        { name: "Table", position: [0, 0.25, 2], size: [0.6, 0.5, 0.6], color: "#8a6a4f" },
        { name: "Lamp", position: [2, 0, 1.5], size: [0.3, 1.8, 0.3], color: "#ffd700" },
    ],
    wallColor = "#e6ddd3",
    floorColor = "#d2b48c",
}) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const sessionRef = useRef(null);
    const [arSupported, setArSupported] = useState(true);
    const [arActive, setArActive] = useState(false);
    const [selectedFurniture, setSelectedFurniture] = useState(null);

    useEffect(() => {
        // Check AR support
        if (!navigator.xr) {
            setArSupported(false);
            return;
        }

        navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
            setArSupported(supported);
        });
    }, []);

    useEffect(() => {
        if (!containerRef.current || !arSupported) return;

        // ===== SCENE SETUP =====
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // ===== CAMERA & RENDERER =====
        const camera = new THREE.PerspectiveCamera(
            75,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            xrCompatible: true
        });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.xr.enabled = true;
        renderer.xr.setReferenceSpaceType("local");
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // ===== LIGHTING =====
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // ===== GROUND PLANE (Visual reference) =====
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(floorColor),
            roughness: 0.8,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        ground.receiveShadow = true;
        scene.add(ground);

        // ===== FURNITURE OBJECTS =====
        const furnitureGroup = new THREE.Group();
        furnitureGroup.name = "furniture-group";

        furnitureItems.forEach((item, idx) => {
            const geometry = new THREE.BoxGeometry(item.size[0], item.size[1], item.size[2]);
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(item.color),
                roughness: 0.6,
                metalness: 0.2,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(item.position[0], item.position[1], item.position[2]);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.userData = {
                name: item.name,
                initialPosition: item.position.slice(),
                dragging: false
            };
            mesh.name = `furniture-${idx}`;
            furnitureGroup.add(mesh);
        });

        scene.add(furnitureGroup);

        // ===== AR SESSION HANDLING =====
        let controller;

        async function onSessionStarted(session) {
            sessionRef.current = session;
            setArActive(true);

            session.addEventListener("end", () => {
                sessionRef.current = null;
                setArActive(false);
            });

            // Setup controller for touch interactions
            const gl = renderer.getContext();
            controller = session.inputSources[0];

            renderer.xr.setSession(session);
        }

        // ===== RAYCASTING FOR SELECTION =====
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function onTouchStart(event) {
            if (!arActive) return;

            const touch = event.touches[0];
            mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(furnitureGroup.children);

            if (intersects.length > 0) {
                const selected = intersects[0].object;
                selected.userData.dragging = true;
                setSelectedFurniture(selected.userData.name);

                // Highlight selected furniture
                selected.material.emissive.setHex(0x444444);
            }
        }

        function onTouchMove(event) {
            if (!arActive || !selectedFurniture) return;

            const touch = event.touches[0];
            mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            // Move furniture on ground plane
            const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            const targetPosition = new THREE.Vector3();
            raycaster.ray.intersectPlane(groundPlane, targetPosition);

            const furniture = furnitureGroup.children.find(
                (child) => child.userData.name === selectedFurniture
            );

            if (furniture) {
                furniture.position.x = targetPosition.x;
                furniture.position.z = targetPosition.z;
            }
        }

        function onTouchEnd(event) {
            if (!selectedFurniture) return;

            const furniture = furnitureGroup.children.find(
                (child) => child.userData.name === selectedFurniture
            );

            if (furniture) {
                furniture.userData.dragging = false;
                furniture.material.emissive.setHex(0x000000);
            }

            setSelectedFurniture(null);
        }

        renderer.domElement.addEventListener("touchstart", onTouchStart);
        renderer.domElement.addEventListener("touchmove", onTouchMove);
        renderer.domElement.addEventListener("touchend", onTouchEnd);

        // ===== ANIMATION LOOP =====
        renderer.xr.addEventListener("sessionstart", onSessionStarted);

        renderer.setAnimationLoop((time, frame) => {
            renderer.render(scene, camera);
        });

        // ===== CLEANUP =====
        return () => {
            renderer.domElement.removeEventListener("touchstart", onTouchStart);
            renderer.domElement.removeEventListener("touchmove", onTouchMove);
            renderer.domElement.removeEventListener("touchend", onTouchEnd);
            renderer.dispose();
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, [furnitureItems, floorColor, arSupported]);

    if (!arSupported) {
        return (
            <div className="w-full h-96 flex items-center justify-center bg-red-50 border-2 border-red-200 rounded-lg">
                <div className="text-center">
                    <p className="text-red-900 font-semibold mb-2">AR Not Supported</p>
                    <p className="text-red-700 text-sm">
                        Your device or browser doesn't support WebAR. Try using:
                        <br />
                        Chrome/Firefox on Android or Safari on iOS 12+
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            {/* AR Container */}
            <div
                ref={containerRef}
                className="w-full rounded-xl overflow-hidden border-2 border-gray-300 bg-black"
                style={{ height: "500px" }}
            />

            {/* AR Controls */}
            <div className="flex flex-col gap-4 bg-white border border-gray-200 rounded-lg p-4">
                {!arActive ? (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600 font-light">
                            📱 Click below to start AR mode and see furniture in your real space
                        </p>
                        <button
                            onClick={async () => {
                                try {
                                    const session = await navigator.xr.requestSession("immersive-ar", {
                                        requiredFeatures: ["hit-test"],
                                        optionalFeatures: ["dom-overlay", "dom-overlay-for-handheld-ar"],
                                        domOverlay: { root: document.body },
                                    });
                                    sessionRef.current = session;
                                    setArActive(true);
                                } catch (err) {
                                    console.error("AR session error:", err);
                                }
                            }}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
                        >
                            🔳 Start AR View
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm text-green-600 font-light">
                            ✅ AR Active! Tap furniture to move them around
                        </p>
                        {selectedFurniture && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                <p className="text-sm text-blue-900">
                                    📌 Moving: <strong>{selectedFurniture}</strong>
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                    Drag to reposition
                                </p>
                            </div>
                        )}
                        <button
                            onClick={() => {
                                if (sessionRef.current) {
                                    sessionRef.current.end();
                                }
                            }}
                            className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
                        >
                            Exit AR Mode
                        </button>
                    </div>
                )}

                {/* Info */}
                <div className="text-xs text-gray-500 font-light space-y-1">
                    <p>💡 Tips:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Point camera at a flat surface</li>
                        <li>Tap furniture to select and move</li>
                        <li>Swipe to rotate view</li>
                        <li>Pinch to zoom in/out</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export const RoomARSchema = z.object({
    furnitureItems: z.array(z.object({
        name: z.string(),
        position: z.array(z.number()),
        size: z.array(z.number()),
        color: z.string(),
    })).optional(),
    wallColor: z.string().optional().default("#e6ddd3"),
    floorColor: z.string().optional().default("#d2b48c"),
});
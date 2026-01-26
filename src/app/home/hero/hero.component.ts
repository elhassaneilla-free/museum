import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import * as THREE from 'three';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.component.html',
  styles: [],
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroContainer') heroContainer!: ElementRef;
  @ViewChild('headline') headline!: ElementRef;
  @ViewChild('subheadline') subheadline!: ElementRef;
  @ViewChild('cta') cta!: ElementRef;
  @ViewChild('threeCanvas') threeCanvas!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private paintbrushGroup!: THREE.Group;
  private inkBottleGroup!: THREE.Group;
  private animationFrameId!: number;

  ngAfterViewInit() {
    this.initThreeJs();
    this.initAnimations();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initThreeJs() {
    // Canvas dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // SCENE
    this.scene = new THREE.Scene();
    
    // CAMERA
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.z = 10;

    // RENDERER
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.threeCanvas.nativeElement,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LIGHTING
    // Ambient light roughly simulates indirect lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Main directional light (Gold/Warm)
    const mainLight = new THREE.DirectionalLight(0xffd700, 2.0); 
    mainLight.position.set(5, 5, 10);
    this.scene.add(mainLight);

    // Rim light/Back light for definition
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.0); 
    rimLight.position.set(-5, 5, -5);
    this.scene.add(rimLight);

    // Soft fill light
    const fillLight = new THREE.PointLight(0xc6a664, 1.0, 50);
    fillLight.position.set(0, -5, 5);
    this.scene.add(fillLight);

    // MATERIALS
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xDAA520, 
      metalness: 0.8,
      roughness: 0.15,
    });
    
    const darkWoodMaterial = new THREE.MeshStandardMaterial({
      color: 0x3f2a14,
      metalness: 0.1,
      roughness: 0.6,
    });
    
    const bristleMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.9,
      metalness: 0.1
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x222222,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.9,
      transmission: 0.2, // Some glass-like transmission
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });


    // --- OBJECT 1: HIGH-FIDELITY PAINTBRUSH ---
    this.paintbrushGroup = new THREE.Group();

    // 1. Handle (Curved/Organic using Lathe)
    // Points for the profile of the handle
    const handlePoints = [];
    const handleLen = 3.5;
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const y = t * handleLen;
        // Shape function: tapers at bottom, swells in middle, tapers near ferrule
        const radius = 0.06 + Math.sin(t * Math.PI) * 0.06; 
        handlePoints.push(new THREE.Vector2(radius, y));
    }
    const handleGeo = new THREE.LatheGeometry(handlePoints, 64);
    const handle = new THREE.Mesh(handleGeo, darkWoodMaterial);
    // Center the handle vertically relative to group center approximately
    handle.position.y = -handleLen / 2;

    // 2. Ferrule (Metal part holding bristles)
    const ferruleHeight = 0.8;
    const ferruleGeo = new THREE.CylinderGeometry(0.12, 0.12, ferruleHeight, 64);
    const ferrule = new THREE.Mesh(ferruleGeo, goldMaterial);
    ferrule.position.y = handleLen / 2; // Sit on top of handle

    // 3. Bristles (Rounded Cone)
    const bristleHeight = 1.0;
    // Using Lathe for a more "bulbous" brush tip shape
    const bristlePoints = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const y = t * bristleHeight;
        // Teardrop / flame shape
        const radius = 0.12 * (1 - t) * (1 + t * 0.5); 
        bristlePoints.push(new THREE.Vector2(radius, y));
    }
    const bristleGeo = new THREE.LatheGeometry(bristlePoints, 64);
    const bristles = new THREE.Mesh(bristleGeo, bristleMaterial);
    bristles.position.y = (handleLen / 2) + (ferruleHeight / 2); // Sit on top of ferrule

    // Combine
    this.paintbrushGroup.add(handle);
    this.paintbrushGroup.add(ferrule);
    this.paintbrushGroup.add(bristles);

    // Adjustment: Bigger and Lower
    this.paintbrushGroup.scale.set(1.8, 1.8, 1.8); 
    // Position Top-Right but Lower
    this.paintbrushGroup.position.set(6.5, 0.5, 0); 
    this.paintbrushGroup.rotation.z = Math.PI * 0.75; // Upside down (pointing down-left) 
    this.scene.add(this.paintbrushGroup);


    // --- OBJECT 2: ELEGANT INK BOTTLE ---
    this.inkBottleGroup = new THREE.Group();

    // Bottle Shape (Lathe for smooth curves)
    const bottlePoints = [];
    // Base
    bottlePoints.push(new THREE.Vector2(0, 0));
    bottlePoints.push(new THREE.Vector2(1.2, 0));
    bottlePoints.push(new THREE.Vector2(1.2, 0.2)); // little base rim
    // Body curve
    for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const x = 1.2 - Math.sin(t * Math.PI * 0.5) * 0.4; // Tapers up
        bottlePoints.push(new THREE.Vector2(x, 0.2 + t * 1.5));
    }
    // Neck
    bottlePoints.push(new THREE.Vector2(0.5, 1.7));
    bottlePoints.push(new THREE.Vector2(0.5, 2.2));
    // Rim
    bottlePoints.push(new THREE.Vector2(0.6, 2.2));
    bottlePoints.push(new THREE.Vector2(0.6, 2.3));
    bottlePoints.push(new THREE.Vector2(0.4, 2.3)); // Inner rim

    const bottleGeo = new THREE.LatheGeometry(bottlePoints, 64);
    const bottle = new THREE.Mesh(bottleGeo, glassMaterial); // Dark glassy look
    
    // Add some "Ink" inside? Or just let the dark material do the work.
    // Let's add a gold stopper/cap floating slightly above or on it.
    const capGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 64);
    const cap = new THREE.Mesh(capGeo, goldMaterial);
    cap.position.y = 2.4; 

    // Combine
    this.inkBottleGroup.add(bottle);
    this.inkBottleGroup.add(cap);

    // Position Bottom-Left
    this.inkBottleGroup.scale.set(1.2, 1.2, 1.2);
    this.inkBottleGroup.position.set(-6.5, -2.5, 0);
    this.inkBottleGroup.rotation.x = 0.2;
    this.inkBottleGroup.rotation.z = 0.1;
    this.scene.add(this.inkBottleGroup);

    // ANIMATION LOOP
    this.animate();

    // Resize Handler
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.001;

    // Paintbrush Animation (Float + Rotate)
    if (this.paintbrushGroup) {
      this.paintbrushGroup.rotation.y = Math.sin(time * 0.5) * 0.2; // Gentle sway
      this.paintbrushGroup.position.y = 0.5 + Math.sin(time * 0.8) * 0.1; // Float at lower position
    }

    // Ink Bottle Animation (Float + Rotate)
    if (this.inkBottleGroup) {
      this.inkBottleGroup.rotation.y = time * 0.2; // Constant slow rotation
      this.inkBottleGroup.position.y = -2 + Math.cos(time * 0.7) * 0.2; // Float
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize() {
    if (this.camera && this.renderer) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  private initAnimations() {
    // Initial states set in CSS or immediately here
    // But for GSAP fromTo or set, we do it here.

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      this.headline.nativeElement,
      { opacity: 0, y: 50 },
      { duration: 2.0, opacity: 1, y: 0, delay: 0.5 }
    )
      .fromTo(
        this.subheadline.nativeElement,
        { opacity: 0, y: 30 },
        { duration: 2.0, opacity: 1, y: 0 },
        '-=1.5' // Overlap
      )
      .fromTo(
        this.cta.nativeElement,
        { opacity: 0, y: 20 },
        { duration: 1.5, opacity: 1, y: 0 },
        '-=1.5'
      );
  }
}

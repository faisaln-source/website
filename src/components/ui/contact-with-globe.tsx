"use client";

import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowRight, Mail, Phone, MessageCircle } from "lucide-react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as d3 from "d3";
import { feature } from "topojson-client";
import type {
  Topology,
  GeometryCollection,
  GeometryObject,
} from "topojson-specification";
import type { GeoPermissibleObjects } from "d3";

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

// â”€â”€ MakeWise contact info â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CONTACT_LINKS = [
  {
    icon: MessageCircle,
    label: "WhatsApp: +91 70120 80365",
    href: "https://wa.me/917012080365?text=Hi%20MakeWise%2C%20I%20have%20a%20project%20idea!",
  },
  {
    icon: Mail,
    label: "makewisedigitalsolution@gmail.com",
    href: "mailto:makewisedigitalsolution@gmail.com",
  },
  {
    icon: Phone,
    label: "+91 70120 80365",
    href: "tel:+917012080365",
  },
];

interface GlobeWireframeProps {
  width?: number;
  height?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  graticuleColor?: string;
  graticuleOpacity?: number;
  sphereOutlineColor?: string;
  sphereOutlineWidth?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  rotateToLocation?: string | [number, number];
  rotateCities?: string[];
  rotationSpeed?: number;
  initialRotation?: [number, number];
  enableInteraction?: boolean;
  showGraticule?: boolean;
  animationDuration?: number;
  startAsGlobe?: boolean;
  countryFillColor?: string;
  countryHoverColor?: string;
  variant?: "wireframe" | "wireframesolid" | "solid";
  scale?: number;
  backgroundColor?: string;
}

interface GeoFeature {
  type: string;
  geometry: GeometryObject;
  properties: Record<string, unknown>;
}

interface WorldAtlasTopology extends Topology {
  objects: {
    countries: GeometryCollection;
  };
}

interface CustomProjection extends d3.GeoProjection {
  alpha(value: number): CustomProjection;
  alpha(): number;
}

const cityCoordinates: Record<string, [number, number]> = {
  "san francisco": [37.7749, -122.4194],
  "new york": [40.7128, -74.006],
  london: [51.5074, -0.1278],
  tokyo: [35.6762, 139.6503],
  paris: [48.8566, 2.3522],
  moscow: [55.7558, 37.6176],
  dubai: [25.2048, 55.2708],
  singapore: [1.3521, 103.8198],
  sydney: [-33.8688, 151.2093],
  mumbai: [19.076, 72.8777],
  "los angeles": [34.0522, -118.2437],
  chicago: [41.8781, -87.6298],
};

function orthographicRaw(x: number, y: number): [number, number] {
  const cosy = Math.cos(y);
  return [cosy * Math.sin(x), Math.sin(y)];
}

function equirectangularRaw(lambda: number, phi: number): [number, number] {
  return [lambda, phi];
}

function interpolateProjection(
  raw0: (lambda: number, phi: number) => [number, number],
  raw1: (lambda: number, phi: number) => [number, number],
): CustomProjection {
  let t = 0;

  const createRawProjection = (
    alpha: number,
  ): ((lambda: number, phi: number) => [number, number]) => {
    return (lambda: number, phi: number): [number, number] => {
      const [x0, y0] = raw0(lambda, phi);
      const [x1, y1] = raw1(lambda, phi);
      return [x0 + alpha * (x1 - x0), y0 + alpha * (y1 - y0)];
    };
  };

  const projection = d3.geoProjection(
    createRawProjection(t),
  ) as unknown as CustomProjection;

  const alphaMethod = ((value?: number): CustomProjection | number => {
    if (value !== undefined) {
      t = +value;
      const newProjection = d3.geoProjection(
        createRawProjection(t),
      ) as unknown as CustomProjection;
      if (projection.scale()) newProjection.scale(projection.scale());
      if (projection.translate()) newProjection.translate(projection.translate());
      if (projection.rotate()) newProjection.rotate(projection.rotate());
      if (projection.precision()) newProjection.precision(projection.precision());
      newProjection.alpha = alphaMethod as CustomProjection["alpha"];
      return newProjection;
    }
    return t;
  }) as CustomProjection["alpha"];

  projection.alpha = alphaMethod;
  return projection;
}

function GlobeWireframe({
  width,
  height,
  className = "aspect-square w-full max-w-150",
  strokeColor = "currentColor",
  strokeWidth = 1.0,
  graticuleColor = "currentColor",
  graticuleOpacity = 0.2,
  sphereOutlineColor = "currentColor",
  sphereOutlineWidth = 1,
  autoRotate = true,
  autoRotateSpeed = 0.5,
  rotateToLocation,
  rotateCities = [],
  rotationSpeed = 3000,
  initialRotation = [0, 0],
  enableInteraction = true,
  showGraticule = true,
  countryFillColor,
  countryHoverColor,
  variant = "wireframe",
  scale = 1,
  backgroundColor,
}: GlobeWireframeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress] = useState(0);
  const [worldData, setWorldData] = useState<GeoFeature[]>([]);
  const [rotation, setRotation] = useState<[number, number]>(initialRotation);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState([0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const rotationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const rotationAnimFrame = useRef<number | null>(null);
  const rotationStartTime = useRef<number | null>(null);
  const rotationFrom = useRef<[number, number]>([0, 0]);
  const rotationTo = useRef<[number, number]>([0, 0]);
  const animationFrame = useRef<number | null>(null);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const rotationRef = useRef(rotation);

  useEffect(() => { rotationRef.current = rotation; }, [rotation]);

  const useResponsive = !width && !height;
  const finalWidth = useResponsive ? dimensions.width : width || 800;
  const finalHeight = useResponsive ? dimensions.height : height || 500;

  const defaultStrokeColor = strokeColor || "currentColor";
  const defaultGraticuleColor = graticuleColor || "currentColor";
  const defaultSphereOutlineColor = sphereOutlineColor || "currentColor";
  const defaultCountryFillColor = countryFillColor || (variant === "solid" ? "currentColor" : "none");
  const defaultBackgroundColor = backgroundColor || "transparent";

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const updateDimensions = () => {
      if (container && useResponsive) {
        const w = container.offsetWidth || 300;
        setDimensions({ width: w, height: w });
      }
    };
    updateDimensions();
    if (useResponsive) {
      resizeObserver.current = new ResizeObserver(updateDimensions);
      resizeObserver.current.observe(container);
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(container);
    return () => {
      resizeObserver.current?.disconnect();
      observer.unobserve(container);
    };
  }, [useResponsive]);

  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
        const world = (await response.json()) as WorldAtlasTopology;
        const countries = feature(world, world.objects.countries).features as GeoFeature[];
        setWorldData(countries);
      } catch {
        setWorldData([]);
      }
    };
    loadWorldData();
  }, []);

  useEffect(() => {
    if (!autoRotate || !isVisible || isDragging || rotateCities.length > 0) {
      if (animationFrame.current) { cancelAnimationFrame(animationFrame.current); animationFrame.current = null; }
      return;
    }
    const rotate = () => {
      setRotation((prev) => [(prev[0] + autoRotateSpeed) % 360, prev[1]]);
      animationFrame.current = requestAnimationFrame(rotate);
    };
    animationFrame.current = requestAnimationFrame(rotate);
    return () => { if (animationFrame.current) cancelAnimationFrame(animationFrame.current); };
  }, [autoRotate, autoRotateSpeed, isVisible, isDragging, rotateCities.length]);

  const animateRotationTo = useCallback((target: [number, number], duration = 1200) => {
    if (rotationAnimFrame.current) cancelAnimationFrame(rotationAnimFrame.current);
    rotationFrom.current = rotationRef.current;
    rotationTo.current = target;
    rotationStartTime.current = performance.now();
    const animate = (time: number) => {
      const elapsed = time - (rotationStartTime.current || 0);
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setRotation([
        rotationFrom.current[0] + (rotationTo.current[0] - rotationFrom.current[0]) * eased,
        rotationFrom.current[1] + (rotationTo.current[1] - rotationFrom.current[1]) * eased,
      ]);
      if (t < 1) rotationAnimFrame.current = requestAnimationFrame(animate);
    };
    rotationAnimFrame.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (rotateCities.length === 0 || !isVisible) return;
    const rotateToNextCity = () => {
      const nextIndex = (currentCityIndex + 1) % rotateCities.length;
      const city = rotateCities[nextIndex].toLowerCase();
      const coords = cityCoordinates[city];
      if (coords) { animateRotationTo([-coords[1], -coords[0]], rotationSpeed * 0.6); setCurrentCityIndex(nextIndex); }
    };
    const city = rotateCities[currentCityIndex].toLowerCase();
    const coords = cityCoordinates[city];
    if (coords) animateRotationTo([-coords[1], -coords[0]], rotationSpeed * 0.6);
    rotationInterval.current = setInterval(rotateToNextCity, rotationSpeed);
    return () => { if (rotationInterval.current) clearInterval(rotationInterval.current); };
  }, [rotateCities, currentCityIndex, rotationSpeed, isVisible, animateRotationTo]);

  useEffect(() => {
    if (!rotateToLocation) return;
    let coords: [number, number];
    if (typeof rotateToLocation === "string") {
      coords = cityCoordinates[rotateToLocation.toLowerCase()] || [0, 0];
    } else {
      coords = rotateToLocation;
    }
    setRotation([-coords[1], -coords[0]]);
  }, [rotateToLocation]);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!enableInteraction) return;
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) setLastMouse([event.clientX - rect.left, event.clientY - rect.top]);
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !enableInteraction) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cur = [event.clientX - rect.left, event.clientY - rect.top];
    const dx = cur[0] - lastMouse[0], dy = cur[1] - lastMouse[1];
    setRotation((prev) => [prev[0] + dx * 0.5, Math.max(-90, Math.min(90, prev[1] - dy * 0.5))]);
    setLastMouse(cur);
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleTouchStart = (event: React.TouchEvent) => {
    if (!enableInteraction || event.touches.length !== 1) return;
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) setLastMouse([event.touches[0].clientX - rect.left, event.touches[0].clientY - rect.top]);
  };
  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isDragging || !enableInteraction || event.touches.length !== 1) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cur = [event.touches[0].clientX - rect.left, event.touches[0].clientY - rect.top];
    const dx = cur[0] - lastMouse[0], dy = cur[1] - lastMouse[1];
    setRotation((prev) => [prev[0] + dx * 0.5, Math.max(-90, Math.min(90, prev[1] - dy * 0.5))]);
    setLastMouse(cur);
  };

  const getResolvedColor = (color: string, fallback: string) => {
    if (color && color !== "currentColor") return color;
    if (typeof window !== "undefined" && canvasRef.current) {
      const computed = window.getComputedStyle(canvasRef.current).color;
      if (computed && computed !== "currentColor") return computed;
    }
    return fallback;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || worldData.length === 0 || !isVisible) return;
    if (useResponsive && dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    const w = Math.round(finalWidth * dpr);
    const h = Math.round(finalHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, finalWidth, finalHeight);

    let projection: d3.GeoProjection | CustomProjection;
    if (variant === "wireframe") {
      const t = progress / 100;
      const alpha = Math.pow(t, 0.5);
      const baseScale = Math.min(finalWidth, finalHeight) / 2;
      const scaleRange = d3.scaleLinear().domain([0, 1]).range([baseScale * 0.9 * scale, baseScale * 0.54 * scale]);
      projection = interpolateProjection(orthographicRaw, equirectangularRaw)
        .scale(scaleRange(alpha)).translate([finalWidth / 2, finalHeight / 2])
        .rotate([rotation[0], rotation[1]]).precision(0.5);
      (projection as CustomProjection).alpha(alpha);
    } else {
      projection = d3.geoOrthographic()
        .scale((Math.min(finalWidth, finalHeight) / 2) * scale * 0.9)
        .translate([finalWidth / 2, finalHeight / 2])
        .rotate([rotation[0], rotation[1]]).precision(0.5);
    }

    const path = d3.geoPath(projection, ctx);

    if (defaultBackgroundColor !== "transparent") {
      ctx.beginPath();
      ctx.arc(finalWidth / 2, finalHeight / 2, (Math.min(finalWidth, finalHeight) / 2) * scale * 0.9, 0, 2 * Math.PI);
      ctx.fillStyle = defaultBackgroundColor;
      ctx.fill();
    }

    const shouldGraticule = variant === "wireframe" && showGraticule && graticuleOpacity > 0;
    if (shouldGraticule) {
      try {
        const graticule = d3.geoGraticule();
        ctx.beginPath();
        path(graticule());
        ctx.strokeStyle = getResolvedColor(defaultGraticuleColor, "rgba(255, 255, 255, 0.2)");
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = graticuleOpacity;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      } catch {}
    }

    try {
      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.strokeStyle = getResolvedColor(defaultSphereOutlineColor, "rgba(234, 88, 12, 0.4)");
      ctx.lineWidth = variant === "wireframe" ? sphereOutlineWidth : 1.5;
      ctx.globalAlpha = variant === "wireframe" ? 1.0 : 0.8;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    } catch {}

    try {
      ctx.beginPath();
      for (let i = 0; i < worldData.length; i++) {
        path(worldData[i] as unknown as GeoPermissibleObjects);
      }
      if (variant === "solid") {
        ctx.fillStyle = getResolvedColor(defaultCountryFillColor, "rgba(234, 88, 12, 0.2)");
        ctx.globalAlpha = 0.35;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
      ctx.strokeStyle = getResolvedColor(defaultStrokeColor, "rgba(234, 88, 12, 0.7)");
      ctx.lineWidth = variant === "solid" ? strokeWidth * 0.5 : strokeWidth;
      ctx.stroke();
    } catch {}

    ctx.restore();
  }, [
    worldData, progress, rotation, isVisible, finalWidth, finalHeight,
    defaultStrokeColor, strokeWidth, defaultGraticuleColor, graticuleOpacity,
    defaultSphereOutlineColor, sphereOutlineWidth, showGraticule,
    defaultCountryFillColor, countryHoverColor, variant, scale,
    defaultBackgroundColor, useResponsive, dimensions.width,
  ]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={finalWidth}
        height={finalHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onTouchCancel={handleMouseUp}
        className={useResponsive ? "w-full h-full opacity-0 transition-opacity duration-700" : ""}
        style={{
          cursor: enableInteraction ? (isDragging ? "grabbing" : "grab") : "default",
          opacity: useResponsive ? (dimensions.width > 0 ? 1 : 0) : 1,
          touchAction: "pan-y",
        }}
      />
    </div>
  );
}

// â”€â”€ Dotted separator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FormDots = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
  const isHorizontal = orientation === "horizontal";
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn("shrink-0 flex items-center justify-center overflow-hidden", isHorizontal ? "w-full" : "h-full", className)}
      {...props}
    >
      <div className={cn("relative", isHorizontal ? "w-full h-4" : "h-full w-4")}>
        <div
          className={cn("absolute inset-0 bg-repeat", "text-neutral-400 dark:text-white/20")}
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 0.8px, transparent 0.8px)",
            backgroundSize: isHorizontal ? "6px 100%" : "100% 6px",
            maskImage: isHorizontal
              ? "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)"
              : "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        />
      </div>
    </SeparatorPrimitive.Root>
  );
});
FormDots.displayName = "FormDots";

// â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface ContactWithGlobeProps {
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
}

export default function ContactWithGlobe({
  title = "Start your project",
  subtitle = "Get in touch",
  description = "Tell us what you need — we respond with a custom quote within hours. Direct collaboration, transparent pricing, fast delivery.",
  className,
}: ContactWithGlobeProps) {
  const [formState, setFormState] = useState({ name: "", service: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project inquiry from ${formState.name}${formState.service ? ` â€” ${formState.service}` : ""}`);
    const body = encodeURIComponent(`Name: ${formState.name}\nService: ${formState.service}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`);
    window.open(`mailto:makewisedigitalsolution@gmail.com?subject=${subject}&body=${body}`, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      className={cn("relative w-full overflow-hidden py-20", className)}
      style={{ background: "var(--page-background)" }}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: -12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease: smoothEase }}
            className="inline-flex items-center px-4 py-1.5 rounded-full"
            style={{ background: "var(--brand-alpha-weak)", border: "1px solid var(--brand-alpha-medium)" }}
          >
            <span className="text-sm font-medium" style={{ color: "var(--brand-on-background-medium)" }}>{subtitle}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold"
            style={{ color: "var(--neutral-on-background-strong)" }}
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
            className="text-base max-w-md"
            style={{ color: "var(--neutral-on-background-weak)" }}
          >
            {description}
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">

          {/* Left â€” contact links + globe */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold" style={{ color: "var(--neutral-on-background-strong)" }}>Reach us directly</h3>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--neutral-on-background-weak)" }}>
                Prefer a quick chat? Message us on WhatsApp — we typically respond within the hour.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {CONTACT_LINKS.map(({ icon: Icon, label, href }, i) => (
                <motion.a
                  key={label} href={href} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: smoothEase }}
                  className="group flex items-center gap-3 w-fit text-sm transition-colors duration-200"
                  style={{ color: "var(--neutral-on-background-weak)" }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                    style={{
                      background: "var(--neutral-alpha-weak)",
                      border: "1px solid var(--neutral-border-medium)",
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: "var(--neutral-on-background-weak)" }} />
                  </div>
                  {label}
                </motion.a>
              ))}
            </div>

            {/* Globe */}
            <div className="relative overflow-hidden h-52">
              <GlobeWireframe
                className="w-full aspect-square max-w-full absolute top-0 left-0"
                variant="wireframesolid"
                autoRotate
                autoRotateSpeed={0.45}
                strokeWidth={0.6}
                graticuleOpacity={0.12}
                rotateCities={["mumbai", "london", "singapore", "tokyo", "dubai"]}
                rotationSpeed={3500}
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
                style={{ background: "linear-gradient(to top, var(--page-background), transparent)" }}
              />
            </div>
          </motion.div>

          {/* Right â€” contact form */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
            className="rounded-2xl p-6 sm:p-8 flex flex-col gap-5"
            style={{
              background: "var(--surface-background)",
              border: "1px solid var(--neutral-border-medium)",
            }}
          >
            <div>
              <h3 className="text-lg font-semibold mb-0.5" style={{ color: "var(--neutral-on-background-strong)" }}>Send a message</h3>
              <p className="text-sm" style={{ color: "var(--neutral-on-background-weak)" }}>
                Fill out the form and we'll get back to you with a quote.
              </p>
            </div>

            <FormDots />

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--neutral-on-background-weak)" }}>Your Name</label>
                  <input
                    type="text" required placeholder="e.g. Arjun Kumar"
                    value={formState.name} onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200"
                    style={{
                      background: "var(--surface-background)",
                      border: "1px solid var(--neutral-border-medium)",
                      color: "var(--neutral-on-background-strong)",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--neutral-on-background-weak)" }}>Service Needed</label>
                  <select
                    value={formState.service} onChange={e => setFormState(s => ({ ...s, service: e.target.value }))}
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200"
                    style={{
                      background: "var(--surface-background)",
                      border: "1px solid var(--neutral-border-medium)",
                      color: "var(--neutral-on-background-strong)",
                    }}
                  >
                    <option value="">Select service...</option>
                    <option>ATS Resume</option>
                    <option>Portfolio Website</option>
                    <option>Business Website</option>
                    <option>Web Application</option>
                    <option>POS Software</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--neutral-on-background-weak)" }}>Email Address</label>
                <input
                  type="email" required placeholder="you@example.com"
                  value={formState.email} onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200"
                  style={{
                    background: "var(--neutral-alpha-weak)",
                    border: "1px solid var(--neutral-border-medium)",
                    color: "var(--neutral-on-background-strong)",
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--neutral-on-background-weak)" }}>Project Details</label>
                <textarea
                  required rows={4}
                  placeholder="Describe your project — what you need, your timeline, and budget range."
                  value={formState.message} onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all duration-200"
                  style={{
                    background: "var(--neutral-alpha-weak)",
                    border: "1px solid var(--neutral-border-medium)",
                    color: "var(--neutral-on-background-strong)",
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-fit h-11 px-8 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-200"
                style={{
                  background: "var(--brand-background-strong)",
                  color: "var(--brand-on-background-strong)",
                }}
              >
                {submitted ? "âœ“ Email opened!" : <>Send Message <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "motion/react";

/* ------------------------------------------------------------------ defaults */
const STRIP_BORDER = {
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(255, 255, 255, 0.28)",
};
const PLUS_BORDER = {
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(255, 255, 255, 0.72)",
};
const TAG_BORDER = {
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(255, 255, 255, 0.66)",
};
const BUTTON_BORDER = {
  borderWidth: 0,
  borderStyle: "solid",
  borderColor: "rgb(20, 20, 20)",
};

export const DEFAULT_SWATCH_IMAGES = [
  {
    src: "https://framerusercontent.com/images/W1vHh9m78CQqEck7nFU4aEdqsWw.jpg",
    alt: "Pistachio green paper sculpture of layered curved sheets with deep green shadows",
  },
  {
    src: "https://framerusercontent.com/images/KZzoIZZFWmevQrxW20QNfraoSxQ.jpg",
    alt: "Rose pink paper sculpture of layered petals with raspberry shadows",
  },
  {
    src: "https://framerusercontent.com/images/UOfiwX1MqEHC0FC9UNmOF30LY.jpg",
    alt: "Periwinkle paper sheets flowing in waves with deep cobalt shadows",
  },
  {
    src: "https://framerusercontent.com/images/55pg3RZwwb6bZpDnzTRmAEHvhPA.jpg",
    alt: "Stacked aqua paper layers rippling with deep teal shadows",
  },
  {
    src: "https://framerusercontent.com/images/d5EaywqblJ9eH7URTE5IBMBX73g.jpg",
    alt: "Apricot paper fan sculpture of layered sheets with burnt orange shadows",
  },
];

export interface SwatchItem {
  title: string;
  description?: string;
  tags?: string;
  image?: { src: string; alt?: string; srcSet?: string };
  color?: string;
  focus?: number;
  button?: string;
  link?: string;
  newTab?: boolean;
}

export interface SwatchAccordionProps {
  items?: SwatchItem[];
  openItem?: number;
  trigger?: "hover" | "click";
  stripLink?: boolean;
  autoplay?: boolean;
  interval?: number;
  direction?: "auto" | "horizontal" | "vertical";
  stripWidth?: number;
  barHeight?: number;
  narrowLayout?: "image" | "full";
  numbers?: boolean;
  scrim?: boolean;
  stripBorder?: any;
  titleTag?: "h2" | "h3" | "h4" | "p";
  titleFont?: any;
  stripFont?: any;
  bodyFont?: any;
  labelFont?: any;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonRadius?: string;
  buttonBorder?: any;
  plusRadius?: string;
  plusBorder?: any;
  tagRadius?: string;
  tagBorder?: any;
  padding?: string;
  gap?: string;
  radius?: string;
  transition?: any;
  style?: React.CSSProperties;
  className?: string;
}

/* ------------------------------------------------------------------ helpers */
function hasLink(link?: string): boolean {
  return typeof link === "string" && link.trim().length > 0;
}

function borderPx(v: any): string | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return `${Math.max(0, v)}px`;
  if (typeof v === "string" && v.trim())
    return /^\d*\.?\d+$/.test(v.trim()) ? `${v.trim()}px` : v.trim();
  return undefined;
}

function colorKey(c: any) {
  const s = String(c || "").trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4)
      h = h.split("").map((x) => x + x).join("");
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
    return [
      n(0),
      n(2),
      n(4),
      h.length === 8 ? Math.round((n(6) / 255) * 100) / 100 : 1,
    ].join(",");
  }
  m = s.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? Math.round(p[3] * 100) / 100 : 1].join(
      ",",
    );
  }
  return s.replace(/\s+/g, "");
}

function readBorder(value: any, fallback: any) {
  const v = value && typeof value === "object" ? value : fallback;
  const all = borderPx(v.borderWidth);
  const sides = [
    v.borderTopWidth,
    v.borderRightWidth,
    v.borderBottomWidth,
    v.borderLeftWidth,
  ].map((side) => borderPx(side) ?? all ?? "0px");
  const style = v.borderStyle || "solid";
  const color = v.borderColor || fallback.borderColor || "transparent";
  const base = borderPx(fallback.borderWidth) || "0px";
  const isDefault =
    sides.every((side) => side === base) &&
    style === (fallback.borderStyle || "solid") &&
    colorKey(color) === colorKey(fallback.borderColor);
  return { isDefault, sides, width: sides.join(" "), style, color };
}

function pad2(n: number) {
  return n < 9 ? `0${n + 1}` : `${n + 1}`;
}

function parseBox(value: any, fallback: string) {
  const parts = String(value || fallback).trim().split(/\s+/).filter(Boolean);
  const [t, r = t, b = t, l = r] = parts.length ? parts : [fallback];
  return { t, r, b, l };
}

function splitFont(font: any, fallbackSize: string) {
  const { fontSize, ...rest } = font || {};
  const size =
    typeof fontSize === "number" ? `${fontSize}px` : fontSize || fallbackSize;
  return { size, rest };
}

const NAMED_EASE: Record<string, string> = {
  linear: "linear",
  easeIn: "cubic-bezier(0.42, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.58, 1)",
  easeInOut: "cubic-bezier(0.42, 0, 0.58, 1)",
  circIn: "cubic-bezier(0.55, 0, 1, 0.45)",
  circOut: "cubic-bezier(0, 0.55, 0.45, 1)",
  circInOut: "cubic-bezier(0.85, 0, 0.15, 1)",
  backIn: "cubic-bezier(0.31, 0.01, 0.66, -0.59)",
  backOut: "cubic-bezier(0.33, 1.53, 0.69, 0.99)",
  backInOut: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
};
const FALLBACK_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function toCssTransition(t: any) {
  const delay = Math.max(0, Number(t?.delay) || 0);
  if (t && t.type && t.type !== "spring") {
    const ease =
      Array.isArray(t.ease) && t.ease.length === 4
        ? `cubic-bezier(${t.ease.map((v: any) => Number(v) || 0).join(", ")})`
        : NAMED_EASE[t.ease] || FALLBACK_EASE;
    return {
      ease,
      fallback: ease,
      duration: Math.max(0.05, Number(t.duration) || 0.6),
      delay,
    };
  }

  let omega: number;
  let zeta: number;
  if (t && Number.isFinite(t.stiffness) && Number.isFinite(t.damping)) {
    const mass = Number(t.mass) || 1;
    omega = Math.sqrt(Math.max(1, t.stiffness) / mass);
    zeta = Math.max(
      0.05,
      t.damping / (2 * Math.sqrt(Math.max(1, t.stiffness) * mass)),
    );
  } else {
    const d = Math.max(0.1, Number(t?.duration) || 0.7);
    zeta = Math.min(
      1,
      Math.max(0.05, 1 - (Number.isFinite(t?.bounce) ? t.bounce : 0.12)),
    );
    omega =
      zeta >= 1
        ? 6.64 / d
        : Math.log(100 / Math.sqrt(1 - zeta * zeta)) / (zeta * d);
  }

  const x = (time: number) => {
    if (zeta >= 1) return 1 - (1 + omega * time) * Math.exp(-omega * time);
    const wd = omega * Math.sqrt(1 - zeta * zeta);
    return (
      1 -
      Math.exp(-zeta * omega * time) *
        (Math.cos(wd * time) + (zeta * omega) / wd * Math.sin(wd * time))
    );
  };

  let total = 0.05;
  while (total < 4) {
    let settled = true;
    for (let k = 0; k <= 10; k++) {
      if (Math.abs(1 - x(total + k * 0.02)) > 0.001) {
        settled = false;
        break;
      }
    }
    if (settled) break;
    total += 0.02;
  }

  const steps = 40;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const v = i === steps ? 1 : x((total * i) / steps);
    pts.push(String(Math.round(v * 1e4) / 1e4));
  }

  return {
    ease: `linear(${pts.join(", ")})`,
    fallback: FALLBACK_EASE,
    duration: total,
    delay,
  };
}

/* ------------------------------------------------------------------ icons */
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 2.5V11.5M2.5 7H11.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function graphemes(text: string) {
  const Seg = typeof Intl !== "undefined" ? (Intl as any).Segmenter : undefined;
  if (Seg)
    return Array.from(
      new Seg(undefined, { granularity: "grapheme" }).segment(text),
      (s: any) => s.segment,
    );
  return Array.from(text);
}

function SplitTitle({ text }: { text: string }) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  let c = 0;
  return (
    <span aria-hidden="true">
      {words.map((word, wi) => (
        <React.Fragment key={wi}>
          <span className="swa-w" style={{ "--wi": String(wi) } as any}>
            {graphemes(word).map((ch, k) => (
              <span
                key={k}
                className="swa-c"
                style={{ "--c": String(c++) } as any}
              >
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );
}

function countChars(text: string) {
  return Math.max(1, String(text || "").replace(/\s+/g, "").length);
}

/* ------------------------------------------------------------------ component */
export default function SwatchAccordion(props: SwatchAccordionProps) {
  const {
    items = [],
    openItem = 2,
    trigger = "hover",
    stripLink = true,
    autoplay = false,
    interval = 5,
    direction = "auto",
    stripWidth = 92,
    barHeight = 64,
    narrowLayout = "image",
    numbers = true,
    scrim = true,
    stripBorder = STRIP_BORDER,
    titleTag = "h3",
    titleFont,
    stripFont,
    bodyFont,
    labelFont,
    textColor = "#141414",
    buttonColor = "#141414",
    buttonTextColor = "#FFFFFF",
    buttonRadius = "999px",
    buttonBorder = BUTTON_BORDER,
    plusRadius = "999px",
    plusBorder = PLUS_BORDER,
    tagRadius = "999px",
    tagBorder = TAG_BORDER,
    padding = "28px",
    gap = "8px",
    radius = "24px",
    transition = { type: "spring", duration: 0.75, bounce: 0.1, delay: 0 },
    style,
    className,
  } = props;

  const count = items.length;
  const reduced = !!useReducedMotion();
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "0px 0px -10% 0px" });
  const triggerRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const hoverTimer = React.useRef<number | null>(null);
  const initial = Math.min(Math.max(Math.round(openItem) - 1, 0), count - 1);

  const [{ active, prev }, setOpenState] = React.useState({
    active: initial,
    prev: initial,
  });

  const setActive = React.useCallback((next: any) => {
    setOpenState((s) => {
      const value = typeof next === "function" ? next(s.active) : next;
      return value === s.active ? s : { active: value, prev: s.active };
    });
  }, []);

  const [hoverPause, setHoverPause] = React.useState(false);
  const [focusPause, setFocusPause] = React.useState(false);
  const paused = hoverPause || focusPause;
  const [cycle, setCycle] = React.useState(0);

  React.useEffect(() => {
    setOpenState({ active: initial, prev: initial });
  }, [initial]);

  React.useEffect(() => {
    return () => {
      if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current);
    };
  }, []);

  const [flippedIndex, setFlippedIndex] = React.useState<number | null>(null);

  const toggleFlip = React.useCallback((index: number) => {
    setFlippedIndex((curr) => (curr === index ? null : index));
  }, []);

  const autoplayOn = autoplay && !reduced && count > 1;

  const open = React.useCallback(
    (index: number, andFlip = false) => {
      setCycle((c) => c + 1);
      setActive(index);
      setFlippedIndex(andFlip ? index : null);
    },
    [setActive],
  );

  const advance = React.useCallback(() => {
    setCycle((c) => c + 1);
    setActive((a: number) => (a + 1) % count);
    setFlippedIndex(null);
  }, [count, setActive]);

  const onStripEnter = (e: React.PointerEvent, index: number) => {
    if (trigger !== "hover") return;
    if (index === active) return; // Do not interrupt or clear flip if already active
    if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      hoverTimer.current = null;
      open(index, false);
    }, 60);
  };

  const onStripLeave = () => {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (active === index) {
        toggleFlip(index);
      } else {
        open(index, false);
      }
      return;
    }
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % count;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (index - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    if (next >= 0) {
      e.preventDefault();
      triggerRefs.current[next]?.focus();
    }
  };

  const t = toCssTransition(
    reduced ? { type: "tween", duration: 0.01, ease: "linear" } : transition,
  );
  const title = splitFont(titleFont, "52px");
  const strip = splitFont(stripFont, "22px");
  const body = splitFont(bodyFont, "16px");
  const label = splitFont(labelFont, "12px");
  const Heading = (titleTag || "h3") as React.ElementType;
  const autoHeight = !(
    style &&
    (style.height === "100%" || typeof style.height === "number")
  );
  const pad = parseBox(padding, "28px");
  const gapParts = String(gap || "8px").trim().split(/\s+/).filter(Boolean);
  const rowGap = gapParts[0] || "8px";
  const colGap = gapParts[1] || rowGap;

  const many = count > 8;
  const stripPx = Math.max(40, stripWidth);
  const barPx = Math.max(40, barHeight);
  const closedSize = many
    ? `min(${stripPx}px, max(48px, calc((100cqw * 0.6 - ${count - 1} * ${colGap}) / ${count - 1})))`
    : `${stripPx}px`;
  const barSize =
    many && !autoHeight
      ? `min(${barPx}px, max(44px, calc((100cqh * 0.6 - ${count - 1} * ${rowGap}) / ${count - 1})))`
      : `${barPx}px`;

  const toRadius = (v: any) =>
    typeof v === "number"
      ? `${Number.isFinite(v) && v < 100 ? Math.max(0, v) : 999}px`
      : String(v || "").trim() || "999px";
  const sb = readBorder(stripBorder, STRIP_BORDER);
  const pb = readBorder(plusBorder, PLUS_BORDER);
  const tb = readBorder(tagBorder, TAG_BORDER);
  const bb = readBorder(buttonBorder, BUTTON_BORDER);

  const borderVars: Record<string, string> = {};
  if (!sb.isDefault)
    Object.assign(borderVars, {
      "--swa-sb-w": sb.width,
      "--swa-sb-s": sb.style,
      "--swa-sb-c": sb.color,
    });
  if (!pb.isDefault)
    Object.assign(borderVars, {
      "--swa-pb-w": pb.width,
      "--swa-pb-s": pb.style,
      "--swa-pb-c": pb.color,
      "--swa-pb-t": pb.sides[0],
      "--swa-pb-r": pb.sides[1],
      "--swa-pb-b": pb.sides[2],
      "--swa-pb-l": pb.sides[3],
    });
  if (!tb.isDefault)
    Object.assign(borderVars, {
      "--swa-tb-w": tb.width,
      "--swa-tb-s": tb.style,
      "--swa-tb-c": tb.color,
    });
  if (!bb.isDefault)
    Object.assign(borderVars, {
      "--swa-bb-w": bb.width,
      "--swa-bb-s": bb.style,
      "--swa-bb-c": bb.color,
    });

  const rootStyle: React.CSSProperties = {
    ...style,
    position: "relative",
    color: textColor,
    ["--swa-n" as any]: String(count),
    ["--swa-closed" as any]: closedSize,
    ["--swa-bar" as any]: barSize,
    ["--swa-gap" as any]: colGap,
    ["--swa-gap-row" as any]: rowGap,
    ["--swa-radius" as any]: radius,
    ["--swa-pt" as any]: pad.t,
    ["--swa-pr" as any]: pad.r,
    ["--swa-pb" as any]: pad.b,
    ["--swa-pl" as any]: pad.l,
    ["--swa-text" as any]: textColor,
    ["--swa-btn" as any]: buttonColor,
    ["--swa-btn-text" as any]: buttonTextColor,
    ["--swa-btn-r" as any]: toRadius(buttonRadius),
    ["--swa-plus-r" as any]: toRadius(plusRadius),
    ["--swa-tag-r" as any]: toRadius(tagRadius),
    ...borderVars,
    ["--swa-title-size" as any]: title.size,
    ["--swa-strip-size" as any]: strip.size,
    ["--swa-body-size" as any]: body.size,
    ["--swa-label-size" as any]: label.size,
    ["--swa-dur" as any]: `${t.duration}s`,
    ["--swa-delay" as any]: `${t.delay}s`,
    ["--swa-ease" as any]: t.ease,
    ["--swa-ease-fallback" as any]: t.fallback,
  };

  return (
    <div
      ref={rootRef}
      className={`swa ${className || ""}`}
      data-dir={direction}
      data-auto-height={autoHeight ? "" : undefined}
      data-scrim={scrim ? "" : undefined}
      data-narrow={narrowLayout === "full" ? "full" : undefined}
      data-strip-border={sb.isDefault ? undefined : "custom"}
      data-plus-border={pb.isDefault ? undefined : "custom"}
      data-tag-border={tb.isDefault ? undefined : "custom"}
      data-btn-border={bb.isDefault ? undefined : "custom"}
      data-many={many ? "" : undefined}
      style={rootStyle}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHoverPause(true)}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setHoverPause(false);
        onStripLeave();
      }}
      onFocus={(e) => {
        let keyboard = true;
        try {
          keyboard = e.target.matches(":focus-visible");
        } catch (err) {}
        setFocusPause(keyboard);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocusPause(false);
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="swa-track">
        {items.map((item, index) => {
          const isOpen = index === active;
          const isFlipped = isOpen && flippedIndex === index;
          const pinEnd =
            (isOpen && index > prev) || (index === prev && !isOpen && index > active);
          const image =
            item.image?.src
              ? item.image
              : DEFAULT_SWATCH_IMAGES[index % DEFAULT_SWATCH_IMAGES.length];
          const focus =
            Math.min(
              100,
              Math.max(0, Number.isFinite(item.focus) ? (item.focus as number) : 50),
            ) / 100;
          const tags = String(item.tags || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          const linked = hasLink(item.link);
          const triggerId = `swa-${uid}-t${index}`;
          const panelId = `swa-${uid}-p${index}`;
          const headingId = `swa-${uid}-h${index}`;
          const stripStyle: React.CSSProperties = {
            ["--swa-color" as any]: item.color || "#E9E7E1",
            ["--swa-focus" as any]: String(focus),
          };

          return (
            <div
              key={index}
              className="swa-strip"
              data-open={isOpen ? "" : undefined}
              data-pin={pinEnd ? "end" : undefined}
              data-flipped={isFlipped ? "" : undefined}
              style={stripStyle}
              onClick={() => {
                if (!isOpen) {
                  open(index, false);
                } else {
                  toggleFlip(index);
                }
              }}
              onPointerEnter={(e) => onStripEnter(e, index)}
              onMouseEnter={() => {
                if (trigger === "hover" && active !== index) {
                  open(index, false);
                }
              }}
              onPointerLeave={onStripLeave}
            >
              {/* 3D FLIPPER CONTAINER */}
              <div className="swa-flipper">
                {/* FRONT FACE: IMAGE ONLY */}
                <div
                  className="swa-flip-face swa-flip-front"
                  onClick={(e) => {
                    if (isOpen) {
                      e.stopPropagation();
                      toggleFlip(index);
                    }
                  }}
                >
                  <div className="swa-media" aria-hidden="true">
                    <img
                      className="swa-img"
                      src={image.src}
                      srcSet={(image as any)?.srcSet}
                      sizes="(max-width: 640px) 100vw, 1100px"
                      alt={image.alt || ""}
                      draggable={false}
                      loading="eager"
                      decoding="async"
                    />
                    <div className="swa-scrim" />
                  </div>

                  {isOpen && (
                    <div
                      className="swa-front-overlay"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlip(index);
                      }}
                    >
                      <div className="swa-front-top">
                        <div className="swa-front-badge">
                          <span className="swa-front-num">{pad2(index)}</span>
                          <span className="swa-front-title-pill">{item.title}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* BACK FACE: WRITINGS ONLY */}
                <div
                  className="swa-flip-face swa-flip-back"
                  onClick={() => {
                    toggleFlip(index);
                  }}
                >
                  <div className="swa-back-container">
                    <div className="swa-back-header">
                      <div className="swa-back-badge-group">
                        <span className="swa-back-num">{pad2(index)}</span>
                        <span className="swa-back-category">SERVICE OVERVIEW</span>
                      </div>
                      <button
                        type="button"
                        className="swa-back-flip-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFlip(index);
                        }}
                        aria-label="Flip back to photo"
                      >
                        <span className="swa-flip-icon">↺</span>
                        <span>Show photo</span>
                      </button>
                    </div>

                    <div className="swa-back-body">
                      <Heading
                        id={headingId}
                        className="swa-back-title"
                        style={title.rest}
                      >
                        {item.title}
                      </Heading>

                      {tags.length > 0 && (
                        <div className="swa-back-tags" aria-label="Tags">
                          {tags.map((tag, ti) => (
                            <span key={ti} className="swa-back-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.description && (
                        <p className="swa-back-desc" style={body.rest}>
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="swa-back-footer">
                      {item.button && item.button.trim() && linked ? (
                        <a
                          className="swa-back-cta"
                          href={item.link}
                          target={item.newTab ? "_blank" : undefined}
                          rel={item.newTab ? "noopener noreferrer" : undefined}
                          onClick={(e) => e.stopPropagation()}
                          style={body.rest}
                        >
                          <span>{item.button}</span>
                          <ArrowIcon />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Accessible Trigger Button for Keyboard */}
              <button
                ref={(el) => {
                  triggerRefs.current[index] = el;
                }}
                id={triggerId}
                type="button"
                className="swa-trigger"
                aria-label={item.title || `Item ${index + 1}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOpen) open(index, false);
                  else toggleFlip(index);
                }}
                onKeyDown={(e) => onKeyDown(e, index)}
              />

              {/* Collapsed Strip Elements */}
              <div className="swa-closed" aria-hidden="true">
                {numbers ? (
                  <span className="swa-num" style={label.rest}>
                    {pad2(index)}
                  </span>
                ) : (
                  <span />
                )}
                <span className="swa-vt">
                  <span className="swa-vtitle" style={strip.rest}>
                    {item.title}
                  </span>
                </span>
                <span
                  className="swa-plw"
                  onClick={(e) => {
                    e.stopPropagation();
                    open(index, true);
                  }}
                >
                  <span className="swa-plus">
                    <PlusIcon className="swa-pi" />
                    <span className="swa-pf">
                      <PlusIcon className="swa-pi" />
                    </span>
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ styles */
const CSS = `
.swa{container-type:inline-size;container-name:swa;box-sizing:border-box;width:100%;height:100%;-webkit-font-smoothing:antialiased;--swa-out:cubic-bezier(.22,1,.36,1);--swa-pop:cubic-bezier(.34,1.45,.64,1);--swa-reveal:calc(var(--swa-delay) + var(--swa-dur) * .26);--swa-return:calc(var(--swa-delay) + var(--swa-dur) * .34);}
.swa *,.swa *::before,.swa *::after{box-sizing:border-box;}
.swa[data-auto-height]{height:auto;}
.swa-track{display:flex;flex-direction:row;row-gap:var(--swa-gap-row);column-gap:var(--swa-gap);width:100%;height:100%;}
.swa[data-auto-height] .swa-track{height:auto;aspect-ratio:16 / 9;min-height:480px;}
.swa-strip{--swa-open-w:calc(100cqw - (var(--swa-n) - 1) * (var(--swa-closed) + var(--swa-gap)));position:relative;flex:0 0 var(--swa-closed);min-width:0;min-height:0;border-radius:var(--swa-radius);overflow:hidden;isolation:isolate;background:linear-gradient(105deg,color-mix(in srgb,var(--swa-color) 90%,#000) 0%,var(--swa-color) 55%,color-mix(in srgb,var(--swa-color) 78%,#fff) 100%);background-color:var(--swa-color);transition-property:flex-grow,flex-basis,height;transition-duration:var(--swa-dur);transition-delay:var(--swa-delay);transition-timing-function:var(--swa-ease-fallback);-webkit-tap-highlight-color:transparent;perspective:1400px;-webkit-perspective:1400px;perspective-origin:center center;-webkit-perspective-origin:center center;}
@supports (transition-timing-function: linear(0, 1)){.swa-strip{transition-timing-function:var(--swa-ease);}}
.swa-strip[data-open]{flex-grow:1;}
.swa-strip::after{content:"";position:absolute;inset:0;z-index:6;border-radius:inherit;pointer-events:none;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28),inset 0 1px 0 rgba(255,255,255,.35);}

/* 3D Flipper Engine */
.swa-flipper{position:absolute;inset:0;width:100%;height:100%;transform-style:preserve-3d;-webkit-transform-style:preserve-3d;transition:transform .65s cubic-bezier(.2,.85,.3,1);transform:rotateY(0deg);border-radius:inherit;transform-origin:center center;}
.swa-strip[data-flipped] .swa-flipper{transform:rotateY(180deg);}
.swa-flip-face{position:absolute;inset:0;width:100%;height:100%;border-radius:inherit;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;transform-origin:center center;}
.swa-flip-front{transform:rotateY(0deg);z-index:2;cursor:pointer;}
.swa-strip[data-flipped] .swa-flip-front{pointer-events:none;}
.swa-flip-back{transform:rotateY(180deg);z-index:3;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .25s ease;}
.swa-strip[data-flipped] .swa-flip-back{opacity:1;pointer-events:auto;}

/* Front Face Elements (Photo Only) */
.swa-media{position:absolute;inset:0;z-index:0;overflow:hidden;border-radius:inherit;clip-path:inset(0 round var(--swa-radius));-webkit-clip-path:inset(0 round var(--swa-radius));}
.swa-img{position:absolute;top:0;height:100%;width:var(--swa-open-w);max-width:none;left:calc((100% - var(--swa-open-w)) * var(--swa-focus));object-fit:cover;object-position:calc(var(--swa-focus) * 100%) 50%;display:block;user-select:none;-webkit-user-select:none;pointer-events:none;transform:scale(1.08);transform-origin:calc(var(--swa-focus) * 100%) 55%;transition:transform 1.2s cubic-bezier(.22,1,.36,1),filter .6s ease;image-rendering:-webkit-optimize-contrast;}
.swa-strip[data-open] .swa-img{transform:scale(1);}
.swa-scrim{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .6s ease;background:radial-gradient(130% 80% at 0% 100%, color-mix(in srgb,var(--swa-color) 88%,transparent) 0%, color-mix(in srgb,var(--swa-color) 55%,transparent) 32%, transparent 62%);}
.swa[data-scrim] .swa-strip[data-open] .swa-scrim{opacity:1;}

.swa-front-overlay{position:absolute;inset:0;z-index:5;pointer-events:auto;display:flex;flex-direction:column;justify-content:flex-start;padding:26px 28px;cursor:pointer;}
.swa-front-top{display:flex;align-items:center;justify-content:flex-start;}
.swa-front-badge{display:inline-flex;align-items:center;gap:10px;height:38px;padding:0 16px 0 8px;border-radius:999px;background:rgba(14,14,18,.8);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.25);box-shadow:0 8px 24px -6px rgba(0,0,0,.6);}
.swa-front-num{display:grid;place-items:center;width:24px;height:24px;border-radius:999px;background:var(--swa-color);color:#141414;font-size:11px;font-weight:900;line-height:1;}
.swa-front-title-pill{font-size:14px;font-weight:800;color:#ffffff !important;letter-spacing:.02em;text-shadow:0 1px 3px rgba(0,0,0,.8);}

/* Back Face Elements (Writings Only) */
.swa-back-container{position:absolute;inset:0;width:100%;height:100%;padding:32px 36px;display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(circle at 85% 15%, color-mix(in srgb,var(--swa-color) 32%,transparent) 0%, transparent 55%),radial-gradient(circle at 10% 90%, color-mix(in srgb,var(--swa-color) 20%,transparent) 0%, transparent 60%),#111116;border-radius:inherit;border:1px solid rgba(255,255,255,.16);box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 24px 50px -12px rgba(0,0,0,.7);color:#ffffff;}
.swa-back-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;}
.swa-back-badge-group{display:flex;align-items:center;gap:10px;}
.swa-back-num{display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:var(--swa-color);color:#141414;font-size:12px;font-weight:900;line-height:1;}
.swa-back-category{font-size:11px;font-weight:700;letter-spacing:.08em;color:rgba(255,255,255,.6);text-transform:uppercase;}
.swa-back-flip-btn{display:inline-flex;align-items:center;gap:7px;height:34px;padding:0 13px;border-radius:999px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);color:#ffffff;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s ease;}
.swa-back-flip-btn:hover{background:rgba(255,255,255,.25);transform:scale(1.04);}
.swa-back-body{display:flex;flex-direction:column;align-items:flex-start;margin:auto 0;max-width:520px;}
.swa-back-title{font-size:36px;font-weight:800;letter-spacing:-0.03em;color:#ffffff !important;margin:0 0 14px;line-height:1.15;text-shadow:0 2px 10px rgba(0,0,0,.6);}
.swa-back-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;}
.swa-back-tag{display:inline-flex;align-items:center;height:28px;padding:0 12px;border-radius:999px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#ffffff;font-size:12px;font-weight:600;}
.swa-back-desc{font-size:15.5px;line-height:1.6;color:rgba(255,255,255,.85);margin:0 0 12px;max-width:48ch;text-wrap:pretty;}
.swa-back-footer{display:flex;align-items:center;justify-content:space-between;gap:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.1);flex-wrap:wrap;}
.swa-back-cta{display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 22px;border-radius:999px;background:var(--swa-color);color:#141414;font-size:14px;font-weight:700;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease;box-shadow:0 8px 24px -6px color-mix(in srgb,var(--swa-color) 60%,transparent);cursor:pointer;}
.swa-back-cta:hover{transform:translateY(-2px);box-shadow:0 12px 30px -4px color-mix(in srgb,var(--swa-color) 80%,transparent);}

/* Trigger button */
.swa-trigger{appearance:none;-webkit-appearance:none;position:absolute;inset:0;z-index:2;margin:0;padding:0;border:0;background:transparent;border-radius:inherit;cursor:pointer;outline:none;}
.swa-strip[data-open] .swa-trigger{cursor:default;pointer-events:none;}
.swa-trigger:focus-visible{box-shadow:inset 0 0 0 2px rgba(255,255,255,.95),inset 0 0 0 4px var(--swa-text);}

/* Collapsed Strip */
.swa-closed{position:absolute;top:0;bottom:0;left:0;width:min(100%, calc(var(--swa-closed) + 14px));z-index:4;pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:var(--swa-pt) 0 calc(var(--swa-pb) + 3px);}
.swa-num{display:inline-flex;align-items:center;height:30px;font-size:var(--swa-label-size);color:#ffffff !important;opacity:.95;font-variant-numeric:tabular-nums;letter-spacing:.04em;line-height:1;user-select:none;-webkit-user-select:none;font-weight:800;text-shadow:0 2px 8px rgba(0,0,0,.95);}
.swa-closed .swa-num{transition:opacity .5s ease var(--swa-return),transform .7s var(--swa-out) var(--swa-return);}
.swa-strip[data-open] .swa-closed{opacity:0;pointer-events:none;transition:opacity .2s ease;}
.swa-strip[data-open] .swa-closed .swa-num{opacity:0;transform:translateY(-6px);transition:opacity .14s ease,transform .3s ease;}
.swa-vt{display:flex;margin-top:auto;margin-bottom:18px;transition:opacity .55s ease calc(var(--swa-return) + 60ms),transform .9s var(--swa-out) calc(var(--swa-return) + 60ms),filter .55s ease calc(var(--swa-return) + 60ms);}
.swa-strip[data-open] .swa-vt{opacity:0;transform:translateY(18px);filter:blur(6px);transition:opacity .18s ease,transform .32s cubic-bezier(.4,0,1,1),filter .18s ease;}
.swa-vtitle{font-size:var(--swa-strip-size);color:#ffffff !important;writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap;line-height:1;user-select:none;-webkit-user-select:none;transition:transform .5s var(--swa-out);font-weight:800;letter-spacing:.03em;text-shadow:0 2px 10px rgba(0,0,0,.95),0 0 6px rgba(0,0,0,.9),0 0 2px rgba(0,0,0,1);filter:drop-shadow(0 2px 8px rgba(0,0,0,.85));}
.swa-plw{display:grid;cursor:pointer;pointer-events:auto;transition:transform .8s var(--swa-pop) calc(var(--swa-return) + 120ms);}
.swa-strip[data-open] .swa-plw{transform:scale(.55) rotate(45deg);transition:transform .34s cubic-bezier(.4,0,.2,1);pointer-events:none;}
.swa-plus{position:relative;display:grid;place-items:center;width:40px;height:40px;border-radius:var(--swa-plus-r,999px);color:#ffffff !important;background:rgba(18,18,22,.8) !important;-webkit-backdrop-filter:blur(14px) saturate(1.4);backdrop-filter:blur(14px) saturate(1.4);border:1px solid rgba(255,255,255,.35);box-shadow:0 4px 18px rgba(0,0,0,.6);transition:opacity .4s ease calc(var(--swa-return) + 120ms),transform .45s var(--swa-out);}
.swa-strip[data-open] .swa-plus{opacity:0;transition:opacity .2s ease .08s,transform .45s var(--swa-out);}
.swa-pf{position:absolute;inset:-1px;display:grid;place-items:center;border-radius:inherit;background:#ffffff;color:#141414;clip-path:inset(100% 0 0 0);-webkit-clip-path:inset(100% 0 0 0);transition:clip-path .45s var(--swa-out),-webkit-clip-path .45s var(--swa-out);}
.swa-strip[data-open] .swa-pf{clip-path:inset(0 0 0 0);-webkit-clip-path:inset(0 0 0 0);transition:clip-path .3s var(--swa-out),-webkit-clip-path .3s var(--swa-out);}
.swa-pi{display:block;transition:transform .6s var(--swa-out);}

/* Responsive & Mobile */
@container swa (max-width: 640px){
  .swa[data-dir="auto"] .swa-track{flex-direction:column;}
  .swa[data-dir="auto"] .swa-strip{flex:0 0 var(--swa-bar);}
  .swa[data-dir="auto"] .swa-strip[data-open]{flex-grow:1;}
  .swa[data-dir="auto"] .swa-img{width:100%;height:auto;aspect-ratio:4 / 3;left:0;top:0;transform-origin:50% 0;-webkit-mask-image:linear-gradient(to bottom,#000 68%,transparent 100%);mask-image:linear-gradient(to bottom,#000 68%,transparent 100%);}
  .swa[data-dir="auto"] .swa-closed{width:auto;right:0;flex-direction:row;justify-content:flex-start;gap:14px;padding:0 14px 0 20px;}
  .swa[data-dir="auto"] .swa-vt{margin:0 auto 0 0;}
  .swa[data-dir="auto"] .swa-vtitle{writing-mode:horizontal-tb;transform:none;}
  .swa[data-dir="auto"][data-auto-height] .swa-strip{flex:none;height:var(--swa-bar);transition-property:height;}
  .swa[data-dir="auto"][data-auto-height] .swa-strip[data-open]{height:calc(75cqw + 232px);}
  .swa-back-container{padding:20px;}
  .swa-back-title{font-size:24px;margin-bottom:8px;}
  .swa-back-desc{font-size:13px;line-height:1.45;}
  .swa-back-tags{display:none;}
}

@media (hover:hover) and (pointer:fine){
  .swa-strip:not([data-open]):hover{flex-basis:calc(var(--swa-closed) + 14px);}
  .swa-strip:not([data-open]):hover .swa-pf{clip-path:inset(0 0 0 0);-webkit-clip-path:inset(0 0 0 0);}
  .swa-strip:not([data-open]):hover .swa-pi{transform:rotate(90deg);}
  .swa-strip:not([data-open]):hover .swa-vtitle{transform:rotate(180deg) translateX(4px);}
  .swa-strip:not([data-open]):hover .swa-img{transform:scale(1.04);}
  .swa-strip[data-open]:hover .swa-img{transform:scale(1.015);}
}
@media (prefers-reduced-motion: reduce){
  .swa *,.swa *::before,.swa *::after{transition-duration:.01ms !important;transition-delay:0s !important;}
  .swa-img,.swa-strip[data-open] .swa-img{transform:none !important;}
}
@media (prefers-contrast: more){
  .swa-desc{opacity:1;}
  .swa-num{opacity:1;}
  .swa-scrim{background:color-mix(in srgb,var(--swa-color) 70%,transparent) !important;}
}
.swa[data-strip-border] .swa-strip::after{box-shadow:none;border-style:var(--swa-sb-s);border-color:var(--swa-sb-c);border-width:var(--swa-sb-w);}
.swa[data-plus-border] .swa-plus{border-style:var(--swa-pb-s);border-color:var(--swa-pb-c);border-width:var(--swa-pb-w);box-shadow:0 6px 18px -10px rgba(20,20,20,.35);}
.swa[data-plus-border] .swa-pf{inset:auto;top:calc(var(--swa-pb-t) * -1);right:calc(var(--swa-pb-r) * -1);bottom:calc(var(--swa-pb-b) * -1);left:calc(var(--swa-pb-l) * -1);}
.swa[data-tag-border] .swa-tag{border-style:var(--swa-tb-s);border-color:var(--swa-tb-c);border-width:var(--swa-tb-w);}
.swa[data-btn-border] .swa-cta{border-style:var(--swa-bb-s);border-color:var(--swa-bb-c);border-width:var(--swa-bb-w);}
.swa[data-many]:not([data-auto-height]){container-type:size;}
`;

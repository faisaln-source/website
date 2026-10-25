"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Mail, Copy, Check, X, ArrowUpRight, Laptop } from "lucide-react";
import styles from "./EmailModal.module.css";

export interface EmailData {
  to?: string;
  subject?: string;
  body?: string;
}

const DEFAULT_EMAIL = "makewisedigitalsolution@gmail.com";
const STORAGE_KEY = "makewise_preferred_email_client";

/**
 * Detects if the current user is visiting from a mobile device (phone or tablet)
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || "";
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTouchPhone = window.matchMedia && window.matchMedia("(max-width: 768px)").matches && "ontouchstart" in window;
  return isMobileUA || isTouchPhone;
}

/**
 * Opens email intelligently:
 * 1. On mobile phone -> Opens the phone's native default email app (Gmail on Android, Apple Mail on iOS).
 * 2. On desktop -> If user saved 'gmail', opens web Gmail directly. If 'default', opens mailto. Otherwise displays a sleek client selector.
 */
export function openEmailClient({
  to = DEFAULT_EMAIL,
  subject = "",
  body = "",
}: EmailData = {}) {
  if (typeof window === "undefined") return;

  const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Mobile always opens the phone's corresponding native mail app
  if (isMobileDevice()) {
    window.location.href = mailtoUrl;
    return;
  }

  // Check saved desktop preference
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "gmail") {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (saved === "default") {
      window.location.href = mailtoUrl;
      return;
    }
  } catch (err) {
    // localStorage might be disabled
  }

  // Desktop with no saved preference: trigger selector modal
  window.dispatchEvent(
    new CustomEvent("makewise:open-email-modal", {
      detail: { to, subject, body },
    })
  );
}

export function EmailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<EmailData>({ to: DEFAULT_EMAIL, subject: "", body: "" });
  const [remember, setRemember] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hasSavedPreference, setHasSavedPreference] = useState(false);

  useEffect(() => {
    try {
      setHasSavedPreference(Boolean(localStorage.getItem(STORAGE_KEY)));
    } catch {
      // ignore
    }

    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<EmailData>;
      setData({
        to: customEvent.detail?.to || DEFAULT_EMAIL,
        subject: customEvent.detail?.subject || "",
        body: customEvent.detail?.body || "",
      });
      setIsOpen(true);
      setCopied(false);
    };

    window.addEventListener("makewise:open-email-modal", handleOpen);
    return () => {
      window.removeEventListener("makewise:open-email-modal", handleOpen);
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const to = data.to || DEFAULT_EMAIL;
  const subject = data.subject || "";
  const body = data.body || "";

  const handleChooseGmail = () => {
    if (remember) {
      try {
        localStorage.setItem(STORAGE_KEY, "gmail");
        setHasSavedPreference(true);
      } catch {
        // ignore
      }
    }
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
    handleClose();
  };

  const handleChooseDefaultApp = () => {
    if (remember) {
      try {
        localStorage.setItem(STORAGE_KEY, "default");
        setHasSavedPreference(true);
      } catch {
        // ignore
      }
    }
    const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    handleClose();
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(to);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetPreference = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHasSavedPreference(false);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
    >
      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h3 id="email-modal-title" className={styles.title}>
              Contact via Email
            </h3>
            <p className={styles.subtitle}>
              Choose how you would like to open your email client
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Client Options */}
        <div className={styles.optionsList}>
          {/* Option 1: Gmail (Web) */}
          <button
            type="button"
            onClick={handleChooseGmail}
            className={`${styles.optionButton} ${styles.gmailOption}`}
          >
            <div className={`${styles.iconWrapper} ${styles.gmailIconWrapper}`}>
              <Mail size={22} />
            </div>
            <div className={styles.optionContent}>
              <div className={styles.optionHeader}>
                <span className={styles.optionTitle}>Gmail (Web)</span>
                <span className={styles.badge}>Recommended</span>
              </div>
              <span className={styles.optionDesc}>
                Opens Gmail in your browser with recipient &amp; subject prefilled
              </span>
            </div>
            <ArrowUpRight size={18} style={{ opacity: 0.6 }} />
          </button>

          {/* Option 2: Default System Mail */}
          <button
            type="button"
            onClick={handleChooseDefaultApp}
            className={styles.optionButton}
          >
            <div className={`${styles.iconWrapper} ${styles.appIconWrapper}`}>
              <Laptop size={22} />
            </div>
            <div className={styles.optionContent}>
              <div className={styles.optionHeader}>
                <span className={styles.optionTitle}>Default Mail App</span>
              </div>
              <span className={styles.optionDesc}>
                Opens your computer&apos;s installed desktop mail application
              </span>
            </div>
            <ArrowUpRight size={18} style={{ opacity: 0.6 }} />
          </button>

          {/* Option 3: Copy Email Address */}
          <button
            type="button"
            onClick={handleCopyEmail}
            className={styles.optionButton}
          >
            <div className={`${styles.iconWrapper} ${styles.copyIconWrapper}`}>
              {copied ? <Check size={22} /> : <Copy size={22} />}
            </div>
            <div className={styles.optionContent}>
              <div className={styles.optionHeader}>
                <span className={styles.optionTitle}>
                  {copied ? "Copied to clipboard!" : "Copy Email Address"}
                </span>
              </div>
              <span className={styles.optionDesc}>{to}</span>
            </div>
          </button>
        </div>

        {/* Footer / Remember Choice */}
        <div className={styles.rememberFooter}>
          <label className={styles.rememberLabel}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className={styles.rememberCheckbox}
            />
            <span>Remember my choice on this computer</span>
          </label>

          {hasSavedPreference && (
            <button
              type="button"
              onClick={handleResetPreference}
              className={styles.resetButton}
            >
              Reset saved default
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailModal;

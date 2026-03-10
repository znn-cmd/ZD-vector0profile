"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({ trigger, children, align = "right", className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 180;
    const menuHeight = 220;
    const padding = 4;
    const left = Math.max(
      8,
      Math.min(
        align === "right" ? rect.right - menuWidth : rect.left,
        window.innerWidth - menuWidth - 8
      )
    );
    const spaceBelow = window.innerHeight - rect.bottom - padding;
    const openUpward = spaceBelow < menuHeight && rect.top > spaceBelow;
    const top = openUpward ? rect.top - menuHeight - padding : rect.bottom + padding;
    setPosition({ top, left });
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      <div
        ref={triggerRef}
        className={cn("relative inline-block", className)}
        onClick={() => setOpen(!open)}
      >
        {trigger}
      </div>
      {open &&
        typeof document !== "undefined" &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[100] min-w-[180px] animate-fade-in rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
            style={{ top: position.top, left: position.left }}
            onClick={() => setOpen(false)}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
}

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
}

export function DropdownItem({ className, danger, ...props }: DropdownItemProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
        danger ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-gray-100" />;
}

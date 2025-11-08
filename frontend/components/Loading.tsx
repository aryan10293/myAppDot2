import React from "react";

type LoadingProps = {
  size?: "sm" | "md" | "lg";
  message?: string;
  overlay?: boolean;
};

/**
 * Small, reusable spinner component using Tailwind.
 * - `overlay` shows a centered spinner on a translucent backdrop (useful for full-page loading)
 * - `message` displays a small helper text under the spinner
 * - `size` selects spinner size
 */
export default function Loading({ size = "md", message, overlay = false }: LoadingProps) {
  const sizeClass =
    size === "sm" ? "h-4 w-4 border-2" : size === "lg" ? "h-12 w-12 border-4" : "h-8 w-8 border-4";

  const spinner = (
    <span
      role="status"
      aria-label={message ? `${message} — loading` : "Loading"}
      className={`inline-block ${sizeClass} animate-spin rounded-full border-gray-200 border-t-indigo-600`}
    />
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
        <div className="flex flex-col items-center gap-3 rounded-lg bg-white/80 p-4 backdrop-blur-sm">
          {spinner}
          {message ? <div className="text-sm text-gray-700">{message}</div> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {spinner}
      {message ? <div className="text-xs text-gray-500">{message}</div> : null}
    </div>
  );
}

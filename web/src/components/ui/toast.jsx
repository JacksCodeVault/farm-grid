import * as React from "react";

export function Toast({ message, open, onOpenChange }) {
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => onOpenChange(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange]);

  if (!open) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black text-white px-4 py-2 rounded shadow-lg">
      {message}
    </div>
  );
}

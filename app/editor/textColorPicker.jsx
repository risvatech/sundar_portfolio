"use client";

import {useEffect, useRef, useState} from "react";

const TEXT_COLORS = [
  "#000000",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#D1D5DB",
  "#FFFFFF",

  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",

  "#10B981",
  "#14B8A6",
  "#06B6D4",
  "#0EA5E9",
  "#3B82F6",
  "#6366F1",

  "#8B5CF6",
  "#A855F7",
  "#D946EF",
  "#EC4899",
  "#F43F5E",
  "#7F1D1D",
];

export default function TextColorPicker({
  onSelect,
  currentColor = "#000000",
}) {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(currentColor);

  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const selectColor = (color) => {
    setSelectedColor(color);
    onSelect?.(color);
    setOpen(false);
  };

  return (
      <div ref = {containerRef}
           className = "relative" >
        <button
            type = "button"
            title = "Text color"
            onMouseDown = {(e) => {
              e.preventDefault();
              setOpen((prev) => !prev);
            }}
            className = "flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm text-gray-600 transition hover:bg-gray-100"
        >
        <span className = "relative flex h-6 w-6 items-center justify-center" >
          A

          <span
              className = "absolute bottom-0 left-1/2 h-[3px] w-4 -translate-x-1/2 rounded"
              style = {{
                backgroundColor: selectedColor,
              }}
          />
        </span >
        </button >

        {open && (
            <div className = "absolute left-0 top-full z-50 mt-2 w-[220px] rounded-lg border border-gray-200 bg-white p-3 shadow-lg" >
              <div className = "mb-3 text-xs font-medium text-gray-500" >
                Text color
              </div >

              <div className = "grid grid-cols-6 gap-2" >
                {TEXT_COLORS.map((color) => (
                    <button
                        key = {color}
                        type = "button"
                        title = {color}
                        onMouseDown = {(e) => {
                          e.preventDefault();
                          selectColor(color);
                        }}
                        className = {`h-7 w-7 rounded-md border transition hover:scale-110 ${
                            selectedColor === color
                                ? "ring-2 ring-gray-400 ring-offset-1"
                                : "border-gray-200"
                        }`}
                        style = {{
                          backgroundColor: color,
                        }}
                    />
                ))}
              </div >

              <div className = "mt-3 border-t border-gray-100 pt-3" >
                <label className = "flex cursor-pointer items-center justify-between gap-3 text-xs text-gray-600" >
                  Custom color

                  <input
                      type = "color"
                      value = {selectedColor}
                      onChange = {(e) => {
                        selectColor(e.target.value);
                      }}
                      className = "h-7 w-9 cursor-pointer border-0 bg-transparent p-0"
                  />
                </label >
              </div >
            </div >
        )}
      </div >
  );
}
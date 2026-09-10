"use client";

import {useEffect, useRef, useState} from "react";

const HIGHLIGHT_COLORS = [
  "#FEF08A",
  "#FDE68A",
  "#FED7AA",
  "#FECACA",
  "#FBCFE8",
  "#E9D5FF",

  "#DDD6FE",
  "#C7D2FE",
  "#BFDBFE",
  "#BAE6FD",
  "#A5F3FC",
  "#99F6E4",

  "#A7F3D0",
  "#BBF7D0",
  "#D9F99D",
  "#ECFCCB",
  "#F3F4F6",
  "#D1D5DB",

  "#FACC15",
  "#FB923C",
  "#F87171",
  "#F472B6",
  "#C084FC",
  "#818CF8",
];

export default function HighlightColorPicker({
  onSelect,
  currentColor = "#FEF08A",
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
      <div
          ref = {containerRef}
          className = "relative"
      >
        <button
            type = "button"
            title = "Highlight color"
            onMouseDown = {(e) => {
              e.preventDefault();
              setOpen((prev) => !prev);
            }}
            className = "flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm text-gray-600 transition hover:bg-gray-100"
        >
        <span className = "relative flex h-6 w-6 items-center justify-center" >
          <span
              className = "flex h-5 w-5 items-center justify-center rounded text-xs font-medium"
              style = {{
                backgroundColor: selectedColor,
              }}
          >
            A
          </span >
        </span >
        </button >

        {open && (
            <div className = "absolute left-0 top-full z-50 mt-2 w-[220px] rounded-lg border border-gray-200 bg-white p-3 shadow-lg" >
              <div className = "mb-3 text-xs font-medium text-gray-500" >
                Highlight color
              </div >

              <div className = "grid grid-cols-6 gap-2" >
                {HIGHLIGHT_COLORS.map((color) => (
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
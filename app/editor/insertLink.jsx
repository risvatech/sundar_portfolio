"use client";

import {useEffect, useRef, useState} from "react";

export default function InsertLink({
  editorRef,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const containerRef = useRef(null);
  const savedRangeRef = useRef(null);
  const inputRef = useRef(null);

  const saveSelection = () => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);

    // Make sure selection belongs to our editor
    if (
        editorRef.current &&
        editorRef.current.contains(range.commonAncestorContainer)
    ) {
      savedRangeRef.current = range.cloneRange();
    }
  };

  const restoreSelection = () => {
    const range = savedRangeRef.current;

    if (!range) return;

    const selection = window.getSelection();

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleOpen = () => {
    saveSelection();

    setOpen((prev) => !prev);
  };

  const handleInsert = () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) return;

    const safeUrl = /^https?:\/\//i.test(trimmedUrl)
        ? trimmedUrl
        : `https://${trimmedUrl}`;

    editorRef.current?.focus();

    restoreSelection();

    const selection = window.getSelection();

    // Selected text exists
    if (selection && !selection.isCollapsed) {
      document.execCommand(
          "createLink",
          false,
          safeUrl
      );
    } else {
      // No text selected: insert URL as link
      document.execCommand(
          "insertHTML",
          false,
          `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeUrl}</a>`
      );
    }

    onChange?.();

    setUrl("");
    setOpen(false);
    savedRangeRef.current = null;
  };

  const handleRemoveLink = () => {
    editorRef.current?.focus();

    restoreSelection();

    document.execCommand(
        "unlink",
        false,
        null
    );

    onChange?.();

    setUrl("");
    setOpen(false);
    savedRangeRef.current = null;
  };

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
        "mousedown",
        handleOutsideClick
    );

    return () => {
      document.removeEventListener(
          "mousedown",
          handleOutsideClick
      );
    };
  }, []);

  return (
      <div
          ref = {containerRef}
          className = "relative"
      >
        <button
            type = "button"
            title = "Insert link"
            onMouseDown = {(e) => {
              e.preventDefault();
              handleOpen();
            }}
            className = "flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm text-gray-600 transition hover:bg-gray-100"
        >
          🔗
        </button >

        {open && (
            <div className = "absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg" >
              <div className = "mb-2 text-xs font-medium text-gray-600" >
                Insert link
              </div >

              <input
                  ref = {inputRef}
                  type = "text"
                  value = {url}
                  placeholder = "https://example.com"
                  onChange = {(e) => {
                    setUrl(e.target.value);
                  }}
                  onKeyDown = {(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleInsert();
                    }

                    if (e.key === "Escape") {
                      setOpen(false);
                    }
                  }}
                  className = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none"
              />

              <div className = "mt-3 flex items-center justify-between" >
                <button
                    type = "button"
                    onClick = {handleRemoveLink}
                    className = "text-xs text-red-500 hover:text-red-600"
                >
                  Remove link
                </button >

                <div className = "flex gap-2" >
                  <button
                      type = "button"
                      onClick = {() => {
                        setOpen(false);
                        setUrl("");
                      }}
                      className = "rounded-md px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button >

                  <button
                      type = "button"
                      onClick = {handleInsert}
                      disabled = {!url.trim()}
                      className = "rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Apply
                  </button >
                </div >
              </div >
            </div >
        )}
      </div >
  );
}
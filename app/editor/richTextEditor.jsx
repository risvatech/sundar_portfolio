"use client";

import { useEffect, useRef, useState } from "react";
import TextColorPicker from "./textColorPicker";
import HighlightColorPicker from "./highlightColorPicker";
import InsertLink from "./insertLink";
import { sanitizeHtml } from "./sanitizeHtml";

const ToolbarButton = ({ children, title, active = false, onClick }) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => {
      e.preventDefault(); // keep editor selection
      onClick?.();
    }}
    className={`flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm transition ${
      active ? "bg-gray-200 text-gray-950" : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

const Separator = () => <div className="mx-1 h-6 w-px bg-gray-200" />;

const exec = (command, value = null) => {
  document.execCommand(command, false, value);
};

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start writing...",
}) {
  const editorRef = useRef(null);
  const fileRef = useRef(null);

  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
  });

  const [active, setActive] = useState({});

  useEffect(() => {
    const editor = editorRef.current;

    if (editor && editor.innerHTML !== value) {
      editor.innerHTML = value || "";
      updateStats(editor.innerText);
    }
  }, [value]);

  const updateStats = (text = "") => {
    const clean = text.trim();

    const words = clean ? clean.split(/\s+/).filter(Boolean).length : 0;

    setStats({
      words,
      chars: text.length,
    });
  };

  const emitChange = () => {
    const editor = editorRef.current;
    if (!editor) return;

    updateStats(editor.innerText);

    onChange?.(editor.innerHTML);
  };

  const updateActiveFormats = () => {
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
    });
  };

  const run = (command, commandValue = null) => {
    editorRef.current?.focus();

    exec(command, commandValue);

    emitChange();
    updateActiveFormats();
  };

  const setBlock = (tag) => {
    editorRef.current?.focus();

    exec("formatBlock", tag);

    emitChange();
    updateActiveFormats();
  };

  const handleEditorClick = (e) => {
    const link = e.target.closest("a");

    if (!link) return;

    e.preventDefault();
    e.stopPropagation();

    const href = link.getAttribute("href");

    if (!href) return;

    window.open(href, "_blank", "noopener,noreferrer");
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return;
    }

    // Shift + Enter = normal line break
    if (e.shiftKey) {
      e.preventDefault();

      document.execCommand("insertLineBreak", false, null);

      emitChange();
      return;
    }

    const range = selection.getRangeAt(0);

    // Find current block
    let current = range.startContainer;

    if (current.nodeType === Node.TEXT_NODE) {
      current = current.parentElement;
    }

    const editor = editorRef.current;

    if (!editor) return;

    // If inside a list, let browser handle Enter normally
    if (current?.closest("li")) {
      return;
    }

    e.preventDefault();

    // New clean paragraph
    const newParagraph = document.createElement("div");

    newParagraph.appendChild(document.createElement("br"));

    // Find top-level block inside editor
    let block = current;

    while (block?.parentElement && block.parentElement !== editor) {
      block = block.parentElement;
    }

    if (block && block !== editor) {
      block.insertAdjacentElement("afterend", newParagraph);
    } else {
      editor.appendChild(newParagraph);
    }

    // Put cursor in new paragraph
    const newRange = document.createRange();

    newRange.setStart(newParagraph, 0);

    newRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(newRange);

    emitChange();
  };
  const handleEditorContainerClick = (e) => {
    // Don't interfere with toolbar/footer
    if (e.target.closest("[data-editor-toolbar]")) return;
    if (e.target.closest("[data-editor-footer]")) return;

    // Link handling remains separate
    if (e.target.closest("a")) return;

    const editor = editorRef.current;

    if (!editor) return;

    // If the actual content was clicked, browser handles caret placement.
    if (editor.contains(e.target) && e.target !== editor) {
      return;
    }

    editor.focus();

    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(editor);
    range.collapse(false);

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const insertImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      editorRef.current?.focus();

      exec("insertImage", reader.result);

      emitChange();
    };

    reader.readAsDataURL(file);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      insertImage(file);
    }

    e.target.value = "";
  };

  const handlePaste = (e) => {
    const clipboard = e.clipboardData;

    if (!clipboard) return;

    // 1. HTML — preserve design
    const html = clipboard.getData("text/html");

    if (html) {
      e.preventDefault();

      const cleanHtml = sanitizeHtml(html);

      document.execCommand("insertHTML", false, cleanHtml);

      emitChange();

      return;
    }

    // 2. Image
    const items = [...clipboard.items];

    const image = items.find((item) => item.type.startsWith("image/"));

    if (image) {
      e.preventDefault();

      const file = image.getAsFile();

      if (file) {
        insertImage(file);
      }

      return;
    }

    // 3. Plain text
    const text = clipboard.getData("text/plain");

    if (!text) return;

    e.preventDefault();

    document.execCommand("insertText", false, text);

    emitChange();
  };

  return (
    <div className="w-full overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Toolbar */}
      <div
        data-editor-toolbar
        className="sticky top-0 z-20 flex min-h-14 flex-wrap items-center gap-1 rounded-t-xl border-b border-gray-200 bg-white/95 px-4 py-2 backdrop-blur"
      >
        <ToolbarButton title="Undo" onClick={() => run("undo")}>
          ↶
        </ToolbarButton>

        <ToolbarButton title="Redo" onClick={() => run("redo")}>
          ↷
        </ToolbarButton>

        <Separator />

        <ToolbarButton
          title="Bold"
          active={active.bold}
          onClick={() => run("bold")}
        >
          <b>B</b>
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          active={active.italic}
          onClick={() => run("italic")}
        >
          <i>I</i>
        </ToolbarButton>

        <ToolbarButton
          title="Underline"
          active={active.underline}
          onClick={() => run("underline")}
        >
          <u>U</u>
        </ToolbarButton>

        <ToolbarButton
          title="Strikethrough"
          active={active.strikeThrough}
          onClick={() => run("strikeThrough")}
        >
          <s>S</s>
        </ToolbarButton>

        <Separator />

        <InsertLink editorRef={editorRef} onChange={emitChange} />

        <TextColorPicker
          onSelect={(color) => {
            run("foreColor", color);
          }}
        />

        <HighlightColorPicker
          onSelect={(color) => {
            run("hiliteColor", color);
          }}
        />

        <Separator />

        <ToolbarButton title="Heading 1" onClick={() => setBlock("h1")}>
          H1
        </ToolbarButton>

        <ToolbarButton title="Heading 2" onClick={() => setBlock("h2")}>
          H2
        </ToolbarButton>

        <ToolbarButton title="Heading 3" onClick={() => setBlock("h3")}>
          H3
        </ToolbarButton>

        <Separator />

        <ToolbarButton
          title="Bullet list"
          active={active.insertUnorderedList}
          onClick={() => run("insertUnorderedList")}
        >
          • List
        </ToolbarButton>

        <ToolbarButton
          title="Numbered list"
          active={active.insertOrderedList}
          onClick={() => run("insertOrderedList")}
        >
          1. List
        </ToolbarButton>

        <Separator />

        <ToolbarButton
          title="Insert image"
          onClick={() => fileRef.current?.click()}
        >
          🖼
        </ToolbarButton>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageSelect}
        />
      </div>

      {/* Document area */}
      <div
        className="relative min-h-100 cursor-text bg-white"
        onClick={handleEditorContainerClick}
      >
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={emitChange}
          onKeyDown={handleKeyDown}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onPaste={handlePaste}
          onClick={handleEditorClick}
          className="rich-editor min-h-100 w-full cursor-text px-8 py-7 text-[15px] leading-7 text-gray-800 outline-none"
        />
      </div>

      {/* Footer */}
      <div
        data-editor-footer
        className="flex items-center justify-between rounded-b-xl border-t border-gray-100 bg-gray-50/70 px-5 py-2.5"
      >
        <span className="text-xs text-gray-400">Rich text</span>

        <div className="flex gap-4 text-xs text-gray-400">
          <span>{stats.words} words</span>
          <span>{stats.chars} chars</span>
        </div>
      </div>
    </div>
  );
}

const BLOCKED_TAGS = new Set([
  "SCRIPT",
  "IFRAME",
  "OBJECT",
  "EMBED",
  "FORM",
  "INPUT",
  "TEXTAREA",
  "BUTTON",
  "SELECT",
  "OPTION",
  "META",
  "LINK",
  "BASE",
  "NOSCRIPT",
  "TEMPLATE",
  "SVG",
  "MATH",
]);

const DANGEROUS_STYLES = new Set([
  "position",
  "z-index",

  "top",
  "right",
  "bottom",
  "left",

  "inset",
  "inset-block",
  "inset-inline",

  "content",

  "behavior",
  "-moz-binding",
]);

const DANGEROUS_PROTOCOLS = [
  "javascript:",
  "vbscript:",
];

function isDangerousCss(value = "") {
  const normalized = value.replace(/\s+/g, "").toLowerCase();

  return (
      normalized.includes("expression(") ||
      normalized.includes("javascript:") ||
      normalized.includes("vbscript:") ||
      normalized.includes("-moz-binding") ||
      normalized.includes("behavior:")
  );
}

function sanitizeStyle(element) {
  const styles = [];

  for (const property of element.style) {
    const normalizedProperty =
        property.toLowerCase();

    const value =
        element.style.getPropertyValue(property);

    if (
        DANGEROUS_STYLES.has(normalizedProperty)
    ) {
      continue;
    }

    if (isDangerousCss(value)) {
      continue;
    }

    styles.push({
      property,
      value,
      priority:
          element.style.getPropertyPriority(property),
    });
  }

  element.removeAttribute("style");

  styles.forEach(
      ({property, value, priority}) => {
        element.style.setProperty(
            property,
            value,
            priority
        );
      }
  );
}

function sanitizeUrl(value) {
  if (!value) return null;

  const normalized = value.trim().replace(/[\u0000-\u001F\u007F\s]/g, "").toLowerCase();

  if (
      DANGEROUS_PROTOCOLS.some((protocol) =>
          normalized.startsWith(protocol)
      )
  ) {
    return null;
  }

  return value;
}

function sanitizeElement(element) {
  // Remove dangerous elements completely
  if (BLOCKED_TAGS.has(element.tagName)) {
    element.remove();
    return;
  }

  // Remove dangerous attributes
  [...element.attributes].forEach((attribute) => {
    const name = attribute.name.toLowerCase();
    const value = attribute.value;

    // onclick, onerror, onload, etc.
    if (name.startsWith("on")) {
      element.removeAttribute(attribute.name);
      return;
    }

    if (
        [
          "srcdoc",
          "contenteditable",
          "formaction",
          "autofocus",
        ].includes(name)
    ) {
      element.removeAttribute(attribute.name);
      return;
    }

    if (
        [
          "href",
          "src",
          "action",
          "poster",
        ].includes(name)
    ) {
      const safeValue = sanitizeUrl(value);

      if (!safeValue) {
        element.removeAttribute(attribute.name);
      }
    }
  });

  sanitizeStyle(element);

  // Links
  if (element.tagName === "A") {
    const href = element.getAttribute("href");

    if (href) {
      element.setAttribute(
          "target",
          "_blank"
      );

      element.setAttribute(
          "rel",
          "noopener noreferrer"
      );
    }
  }
}

export function sanitizeHtml(html = "") {
  if (!html) return "";

  const parser = new DOMParser();

  const doc = parser.parseFromString(
      html,
      "text/html"
  );

  const elements = [
    ...doc.body.querySelectorAll("*"),
  ];

  elements.forEach(sanitizeElement);

  return doc.body.innerHTML;
}
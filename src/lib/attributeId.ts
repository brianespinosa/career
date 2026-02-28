export const toAttributeId = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const scrollToAttribute = (name: string): void => {
  const el = document.getElementById(toAttributeId(name));
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const range = document.createRange();
  range.selectNodeContents(el);
  const description = el.nextElementSibling;
  if (description) {
    range.setEnd(description, description.childNodes.length);
  }
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
};

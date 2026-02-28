export const toAttributeId = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const scrollToAttribute = (name: string): void => {
  document
    .getElementById(toAttributeId(name))
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

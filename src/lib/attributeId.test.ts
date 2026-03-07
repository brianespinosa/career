import { describe, expect, it } from 'vitest';
import { toAttributeId } from './attributeId';

describe('toAttributeId', () => {
  it('lowercases the name', () => {
    expect(toAttributeId('Foo')).toBe('foo');
  });

  it('replaces spaces with hyphens', () => {
    expect(toAttributeId('hello world')).toBe('hello-world');
  });

  it('collapses multiple non-alphanumeric chars into a single hyphen', () => {
    expect(toAttributeId('foo  --  bar')).toBe('foo-bar');
  });

  it('strips leading and trailing hyphens', () => {
    expect(toAttributeId('  foo  ')).toBe('foo');
  });

  it('handles mixed punctuation and casing', () => {
    expect(toAttributeId('Technical & Strategic Thinking')).toBe(
      'technical-strategic-thinking',
    );
  });

  it('handles already-valid kebab-case input', () => {
    expect(toAttributeId('foo-bar')).toBe('foo-bar');
  });
});

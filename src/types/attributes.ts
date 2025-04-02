import ATTRIBUTES from '@/data/attributes.json';

export type AttributeKeys = keyof typeof ATTRIBUTES;

export type AttributeValues = {
  color: string;
  description: string;
  key: string;
  name: string;
  param: string;
  theme: string;
  value: number;
};

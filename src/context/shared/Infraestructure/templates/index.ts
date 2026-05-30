import { TemplateParams } from './base';
import { templateIHV } from './ihv';
import { templateSCI } from './sci';
import { templateSISCI } from './sisci';

export type TemplateKey = 'ihv' | 'sci' | 'sisci';

const registry: Record<string, (p: TemplateParams) => string> = {
  ihv: templateIHV,
  sci: templateSCI,
  sisci: templateSISCI,
};

// Devuelve la plantilla por clave; si no existe, usa IHV como predeterminada.
export const getTemplate = (key?: string | null): ((p: TemplateParams) => string) => {
  return (key && registry[key]) || templateIHV;
};

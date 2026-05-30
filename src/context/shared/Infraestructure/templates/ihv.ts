import { baseTemplate, TemplateParams } from './base';

// Caso IHV — azul
export const templateIHV = (p: TemplateParams): string => baseTemplate(p, { brand: 'IHV', accentColor: '#2563eb' });

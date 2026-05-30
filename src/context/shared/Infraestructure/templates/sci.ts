import { baseTemplate, TemplateParams } from './base';

// Caso SCI — morado
export const templateSCI = (p: TemplateParams): string => baseTemplate(p, { brand: 'SCI', accentColor: '#7c3aed' });

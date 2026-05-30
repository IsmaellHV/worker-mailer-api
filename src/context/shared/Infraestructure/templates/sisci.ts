import { baseTemplate, TemplateParams } from './base';

// Caso SISCI — rojo
export const templateSISCI = (p: TemplateParams): string => baseTemplate(p, { brand: 'SISCI', accentColor: '#dc2626' });

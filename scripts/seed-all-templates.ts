/**
 * Combines all template parts into a single array.
 */
import { indianFestivalTemplates, TemplateData } from './seed-templates-part1';
import {
  nationalDayTemplates,
  indianOccasionTemplates,
  internationalTemplates,
  islamicTemplates,
  christianTemplates,
  sikhTemplates,
  buddhistTemplates,
  jainTemplates,
  businessTemplates,
} from './seed-templates-part2';

export type { TemplateData };

export const allTemplates: TemplateData[] = [
  ...indianFestivalTemplates,
  ...nationalDayTemplates,
  ...indianOccasionTemplates,
  ...internationalTemplates,
  ...islamicTemplates,
  ...christianTemplates,
  ...sikhTemplates,
  ...buddhistTemplates,
  ...jainTemplates,
  ...businessTemplates,
];

console.log(`\nAll templates combined: ${allTemplates.length}`);
console.log(`  Indian Festivals: ${indianFestivalTemplates.length}`);
console.log(`  National Days: ${nationalDayTemplates.length}`);
console.log(`  Indian Occasions: ${indianOccasionTemplates.length}`);
console.log(`  International: ${internationalTemplates.length}`);
console.log(`  Islamic: ${islamicTemplates.length}`);
console.log(`  Christian: ${christianTemplates.length}`);
console.log(`  Sikh: ${sikhTemplates.length}`);
console.log(`  Buddhist: ${buddhistTemplates.length}`);
console.log(`  Jain: ${jainTemplates.length}`);
console.log(`  Business: ${businessTemplates.length}`);

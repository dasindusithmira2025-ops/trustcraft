/**
 * Sponsored placements — TrustCraft's revenue line on the professional side.
 *
 * These are shown to the PROFESSIONAL while they price a job, never to the
 * customer, and never inside the quotation document itself.  The picker is
 * deliberately dumb: category in, sponsored placement out.
 */

export interface Ad {
  id: string
  sponsor: string
  headline: string
  body: string
  cta: string
  icon: string
  hue: number
}

const ADS: Record<string, Ad[]> = {
  plumbers: [
    {
      id: 'ad-plumb-1', sponsor: 'LankaPipe Trade Supplies',
      headline: 'Save 15% on professional plumbing supplies',
      body: 'Trade pricing on pipes, traps, fittings and repair equipment. Same-day pickup in Colombo.',
      cta: 'View Offer', icon: 'wrench', hue: 205,
    },
  ],
  electricians: [
    {
      id: 'ad-elec-1', sponsor: 'VoltMart Electrical',
      headline: '20% off wiring, switches and testing tools',
      body: 'Certified cable, breakers and multimeters at registered-electrician pricing.',
      cta: 'View Offer', icon: 'sparkle', hue: 275,
    },
  ],
  ac: [
    {
      id: 'ad-ac-1', sponsor: 'CoolTech Spares',
      headline: 'AC spare parts and gas at trade rates',
      body: 'Compressors, capacitors, service kits and refrigerant from a licensed supplier.',
      cta: 'View Offer', icon: 'flip', hue: 190,
    },
  ],
  carpenters: [
    {
      id: 'ad-carp-1', sponsor: 'TimberLine Hardware',
      headline: 'Bulk timber, hinges and power tools',
      body: 'Seasoned board, cabinet hardware and cordless tools with a trade account discount.',
      cta: 'View Offer', icon: 'cases', hue: 30,
    },
  ],
  painters: [
    {
      id: 'ad-paint-1', sponsor: 'ColourWorks Pro',
      headline: '10% off paint, rollers and protective gear',
      body: 'Interior and weather-coat ranges, brushes, masking and safety equipment.',
      cta: 'View Offer', icon: 'edit', hue: 340,
    },
  ],
  cleaners: [
    {
      id: 'ad-clean-1', sponsor: 'PureLine Supplies',
      headline: 'Industrial cleaning chemicals in bulk',
      body: 'Degreasers, mould treatment and microfibre at wholesale prices.',
      cta: 'View Offer', icon: 'star', hue: 160,
    },
  ],
  appliance: [
    {
      id: 'ad-appl-1', sponsor: 'PartsHub Lanka',
      headline: 'Genuine appliance spares, next-day',
      body: 'Motors, thermostats, belts and boards for the major brands.',
      cta: 'View Offer', icon: 'card', hue: 250,
    },
  ],
}

const FALLBACK: Ad = {
  id: 'ad-generic', sponsor: 'TrustCraft Trade Store',
  headline: 'Trade pricing on tools and materials',
  body: 'Verified professionals get member rates across the TrustCraft supplier network.',
  cta: 'View Offer', icon: 'cases', hue: 212,
}

/** The sponsored placement relevant to the job being quoted. */
export const adFor = (category: string): Ad => ADS[category]?.[0] ?? FALLBACK

import { buildLegacyTheme } from 'sanity'

const props = {
  '--my-white': '#FFF8F0', // Cream
  '--my-black': '#3A2D35', // Ink
  '--my-brand': '#F47B89', // Coral
  '--my-red': '#F47B89',   // Coral for danger/red
  '--my-yellow': '#D4853A', // Amber
  '--my-green': '#A8C5A0',  // Sage
}

export const myTheme = buildLegacyTheme({
  /* Base theme colors */
  '--black': props['--my-black'],
  '--white': props['--my-white'],

  '--gray': '#6B5E65', // Graphite
  '--gray-base': '#6B5E65',

  '--component-bg': props['--my-white'],
  '--component-text-color': props['--my-black'],

  /* Brand */
  '--brand-primary': props['--my-brand'],

  /* Default button */
  '--default-button-color': '#6B5E65',
  '--default-button-primary-color': props['--my-brand'],
  '--default-button-success-color': props['--my-green'],
  '--default-button-warning-color': props['--my-yellow'],
  '--default-button-danger-color': props['--my-red'],

  /* State */
  '--state-info-color': props['--my-brand'],
  '--state-success-color': props['--my-green'],
  '--state-warning-color': props['--my-yellow'],
  '--state-danger-color': props['--my-red'],

  /* Navbar */
  '--main-navigation-color': props['--my-black'],
  '--main-navigation-color--inverted': props['--my-white'],

  '--focus-color': props['--my-brand'],
})

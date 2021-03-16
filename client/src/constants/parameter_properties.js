/**
 * An object which determines the ranges of different parameters used, and other
 * useful information on each property that will be consistent across forms.
 *
 * `html` is an html string that doesn't need an enclosing element which will
 * determine how the title of the property is displayed. For example:
 * `n<sub>s</sub>`.
 *
 * `plainName` is a simple string with no HTML that will be the name of the
 * property and displayed to the user. If this exists, `html` should not exist.
 *
 * `helpText` is a string that will show to the user in tooltips or other
 * areas where additional info might populate to further explain the property.
 *
 * `range` determines if the property should act as a slider. By default,
 * this is false. If it is a range, min and max should be defined.
 *
 * @type {{
 *  [parameterName: string]: {
 *    min?: number,
 *    max?: number,
 *    step?: number,
 *    html?: string,
 *    plainName?: string
 *    helpText?: string,
 *    range?: boolean
 *  }
 * }}
 */
const PARAMETER_PROPERTIES = {
  lnk_min: {
    min: Math.log(1 * 10 ** -10),
  },
  lnk_max: {
    max: Math.log(2 * 10 ** 6),
  },
  dlnk: {
    min: 0.005,
    max: 0.5,
  },
  n: {
    html: 'n<sub>s</sub>',
    min: -4,
    max: 3,
    helpText: 'Spectral Index',
  },
  sigma_8: {
    html: '&#963<sub>8</sub>',
    min: 0.1,
    helpText: 'RMS Mass Fluctuations',
  },
  z: {
    html: 'Redshift',
    min: 0,
    max: 1100,
  },
  H0: {
    html: 'H<sub>0</sub>',
    min: 10,
    max: 500,
    step: 1,
  },
  Ob0: {
    html: '&#937;<sub>b</sub>',
    min: 0.005,
    max: 0.65,
    step: 0.001,
  },
  Om0: {
    html: '&#937;<sub>m</sub>',
    min: 0.02,
    max: 2,
    step: 0.01,
  },
  delta_c: {
    html: '&#948;<sub>c</sub>',
    min: 1,
    max: 3,
  },
  Mmin: {
    plainName: 'Mass Range Min (log10)',
    range: true,
    min: 0,
    max: 20,
  },
  Mmax: {
    plainName: 'Mass Range Max (log10)',
    range: true,
    min: 0,
    max: 20,
  },
  dlog10m: {
    plainName: 'Mass resolution (log10)',
    range: true,
    min: 0.005,
    max: 1,
  },
  /**
   * Need to do something about the scales for the below 2.
   */
  rmin: {
    plainName: 'Scale (log10)',
    min: -3.0,
    max: 3.0,
    step: 0.05,
  },
  rmax: {
    plainName: 'Scale (log10)',
    min: -3.0,
    max: 3.0,
    step: 0.05,
  },
  rnum: {
    label: 'Number of r bins',
    min: 5.0,
    max: 100,
    value: 5,
  },
  hm_logk_min: {
    label: 'Wavenumber Min (log10)',
    min: -3.0,
    max: 3.0,
    step: 0.05,
  },
  hm_logk_max: {
    label: 'Wavenumber Max (log10)',
    min: -3.0,
    max: 3.0,
    step: 0.05,
  },
  hm_dlog10k: {
    label: 'Halo Model k bin size',
    min: 0.01,
    max: 1.0,
  },
  force_1halo_turnover: {
    label: 'Force 1-halo turnover?',
  },
};

export default PARAMETER_PROPERTIES;

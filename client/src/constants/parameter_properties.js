/**
 * If this field is defined, it means that it is part of a range slider combo
 * of parameters where the max cannot be lower than the min and the min cannot
 * be higher than the max.
 *
 * @typedef RangeSlider
 * @type {{
 *  isRangeSliderMin?: boolean,
 *  isRangeSliderMax?: boolean,
 *  rangeSliderMaxParameter?: string,
 *  rangeSliderMinParameter?: string,
 * }}
 */

/**
 * An object which determines the ranges of different parameters used, and other
 * useful information on each property that will be consistent across forms.
 *
 * `visible` determines if the field should be visible to the end user or not.
 * By default this is true.
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
 * `options` should be an object containing the different options for the field.
 * This should only be filled out if the field accepts a string, and should be
 * an object with the key being what is stored for the value when one of the
 * options is selected, and the value being what is shown to the user. This
 * MUST be filled out for parameters that accept a string.
 *
 * @type {{
 *  [parameterName: string]: {
 *    visible?: boolean,
 *    min?: number,
 *    max?: number,
 *    step?: number,
 *    html?: string,
 *    plainName?: string
 *    helpText?: string,
 *    range?: boolean,
 *    rangeSlider?: RangeSlider,
 *    options?: {
 *      [optionValue: string]: string
 *    }
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
    plainName: 'Number of r bins',
    min: 5.0,
    max: 100,
    value: 5,
  },
  hm_logk_min: {
    plainName: 'Wavenumber Min (log10)',
    min: -3.0,
    max: 3.0,
    step: 0.05,
    rangeSlider: {
      isRangeSliderMin: true,
      rangeSliderMaxParameter: 'hm_logk_max',
    },
  },
  hm_logk_max: {
    plainName: 'Wavenumber Max (log10)',
    min: -3.0,
    max: 3.0,
    step: 0.05,
    rangeSlider: {
      isRangeSliderMax: true,
      rangeSliderMinParameter: 'hm_logk_min',
    },
  },
  hm_dlog10k: {
    plainName: 'Halo Model k bin size',
    min: 0.01,
    max: 1.0,
  },
  force_1halo_turnover: {
    plainName: 'Force 1-halo turnover?',
  },
  camb_params: {
    visible: false,
  },
  dark_energy_params: {
    visible: false,
  },
  sample: {
    plainName: 'Sample',
    options: {
      relaxed: 'relaxed',
      full: 'full',
    },
  },
  hc_spectrum: {
    plainName: 'Halo Centre Spectrum',
    options: {
      linear: 'linear',
      nonlinear: 'nonlinear',
      filtered_lin: 'filtered linear',
      filtered_n1: 'filtered non-linear',
    },
  },
};

export default PARAMETER_PROPERTIES;

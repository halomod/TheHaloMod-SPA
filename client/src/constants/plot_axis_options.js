const plotAxisOptions = {
  k: {
    x: [
      'k',
    ],
    y: [
      'delta_k',
      'nonlinear_delta_k',
      'nonlinear_power',
      'power',
      'transfer_function',
    ],
  },
  k_hm: {
    x: [
      'k_hm',
    ],
    y: [
      'power_1h_auto_matter',
      'power_1h_auto_tracer',
      'power_1h_cross_tracer_matter',
      'power_1h_cs_auto_tracer',
      'power_1h_ss_auto_tracer',
      'power_2h_auto_matter',
      'power_2h_auto_tracer',
      'power_2h_cross_tracer_matter',
      'power_auto_matter',
      'power_auto_tracer',
      'power_cross_tracer_matter',
    ],
  },
  r: {
    x: [
      'r',
    ],
    y: [
      'corr_1h_auto_matter',
      'corr_1h_auto_tracer',
      'corr_1h_cross_tracer_matter',
      'corr_1h_cs_auto_tracer',
      'corr_1h_ss_auto_tracer',
      'corr_2h_auto_matter',
      'corr_2h_auto_tracer',
      'corr_2h_cross_tracer_matter',
      'corr_auto_matter',
      'corr_auto_tracer',
      'corr_cross_tracer_matter',
      'corr_linear_mm',
      'sd_bias_correction',
    ],
  },
  m: {
    x: [
      'm',
      'sigma',
      'radii',
      'lnsigma',
      'halo_bias',
      'n_eff',
    ],
    y: [
      'central_occupation',
      'cmz_relation',
      'dndlnm',
      'dndlog10m',
      'dndm',
      'fsigma',
      'halo_bias',
      'lnsigma',
      'n_eff',
      'ngtm',
      'radii',
      'rho_gtm',
      'rho_ltm',
      'satellite_occupation',
      'sigma',
      'total_occupation',
      'tracer_cmz_relation',
    ],
  },
};

export default plotAxisOptions;

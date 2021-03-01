import deepFreeze from 'deep-freeze';

export default deepFreeze({
  plotOptions: {
    central_occupation: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: 'Central Tracer Occupation',
      yscale: 'log',
    },
    cmz_relation: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: 'Halo Concentration',
      yscale: 'log',
    },
    corr_1h_auto_matter: {
      xlab: 'Scale, $r$ [Mpc/$h$]', // R Label
      ylab: '1-halo matter correlation, $\\xi_{1h}(r)$',
      yscale: 'log',
    },
    corr_1h_auto_tracer: {
      xlab: 'Scale, $r$ [Mpc/$h$]', // R Label
      ylab: '1-halo tracer correlation, $\\xi_{1h}(r)$',
      yscale: 'log',
    },
    corr_1h_cross_tracer_matter: {
      xlab: 'Scale, $r$ [Mpc/$h$]', // R Label
      ylab: '1-halo matter-tracer correlation, $\\xi_{1h}^{m\\times T}(r)$',
      yscale: 'linear',
    },
    corr_1h_cs_auto_tracer: {
      xlab: 'Scale, $r$ [Mpc/$h$]', // R Label
      ylab: '1-halo central-sallite tracer correlation, $\\xi_{1h}^{cs}(r)$',
      yscale: 'log',
    },
    corr_1h_ss_auto_tracer: {
      xlab: 'Scale, $r$ [Mpc/$h$]', // R Label
      ylab: '1-halo satellite-sallite tracer correlation, $\\xi_{1h}^{ss}(r)$',
      yscale: 'log',
    },
    corr_2h_auto_matter: {
      xlab: 'Scale, $r$ [Mpc/$h$]', // R Label
      ylab: '2-halo matter correlation, $\\xi_{2h}(r)$',
      yscale: 'log',
    },
    corr_2h_auto_tracer: {
      xlab: 'Scale, $r$ [Mpc/$h$]', // R Label
      ylab: '2-halo tracer correlation, $\\xi_{2h}(r)$',
      yscale: 'log',
    },
    corr_2h_cross_tracer_matter: {
      xlab: 'Scale, $r$ [Mpc/$h$]', // R Label
      ylab: '2-halo matter-tracer correlation, $\\xi_{2h}^{m\\times T}(r)$',
      yscale: 'log',
    },
    corr_auto_matter: {
      xlab: 'Scale, $r$ [Mpc/$h$]', // R Label
      ylab: 'Matter correlation, $\\xi_{mm}(r)$',
      yscale: 'log',
    },
    corr_auto_tracer: {
      xlab: 'Scale, $r$ [Mpc/$h$]', // R Label
      ylab: 'Tracer correlation, $\\xi_{2h}(r)$',
      yscale: 'log',
    },
    corr_cross_tracer_matter: {
      xlab: 'Scale, $r$ [Mpc/$h$]', // R Label
      ylab: 'Matter-tracer correlation, $\\xi_{m\\times T}(r)$',
      yscale: 'log',
    },
    corr_linear_mm: {
      xlab: 'Scale, $r$ [Mpc/$h$]', // R Label
      ylab: 'Linear matter correlation, $\\xi_{m}^{\\rm lin}(r)$',
      yscale: 'log',
    },
    delta_k: {
      xlab: 'Wavenumber, $k$ [$h$/Mpc]', // K Label
      ylab: '$\\Delta(k)$',
      yscale: 'log',
    },
    dndlnm: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: 'Mass Function $\\left( \\frac{dn}{d\\ln M} \\right) h^3 Mpc^{-3}$',
      yscale: 'log',
    },
    dndlog10m: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: 'Mass Function $\\left( \\frac{dn}{d\\log_{10}M} \\right) h^3 Mpc^{-3}$',
      yscale: 'log',
    },
    dndm: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: 'Mass Function $\\left( \\frac{dn}{dM} \\right) h^4 Mpc^{-3}M_\\odot^{-1}$',
      yscale: 'log',
    },
    fsigma: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: '$f(\\sigma) = \\nu f(\\nu)$',
      yscale: 'linear',
    },
    halo_bias: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: 'Halo Bias',
      yscale: 'log',
    },
    how_big: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: 'Box Size, $L$ Mpc$h^{-1}$',
      yscale: 'log',
    },
    lnsigma: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: '$\\ln(\\sigma^{-1})$',
      yscale: 'linear',
    },
    n_eff: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: 'Effective Spectral Index, $n_{eff}$',
      yscale: 'linear',
    },
    ngtm: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: '$n(>M) h^3 Mpc^{-3}$',
      yscale: 'log',
    },
    nonlinear_delta_k: {
      xlab: 'Wavenumber, $k$ [$h$/Mpc]', // K Label
      ylab: '$\\Delta^2_{\\rm halofit}(k)$',
      yscale: 'log',
    },
    nonlinear_power: {
      xlab: 'Wavenumber, $k$ [$h$/Mpc]', // K Label
      ylab: '$P_{\\rm halofit}(k)$ [Mpc$^3 h^{-3}$]',
      yscale: 'log',
    },
    power: {
      xlab: 'Wavenumber, $k$ [$h$/Mpc]', // K Label
      ylab: '$P(k)$, [Mpc$^3 h^{-3}$]',
      yscale: 'log',
    },
    power_1h_auto_matter: {
      xlab: 'Fourier Scale, $k$ [$h$/Mpc]', // KHM LABEL
      ylab: '1-halo matter $P_{mm}^{1h}(k)$ [Mpc$^3 h^{-3}$]',
      yscale: 'log',
    },
    power_1h_auto_tracer: {
      xlab: 'Fourier Scale, $k$ [$h$/Mpc]', // KHM LABEL
      ylab: '1-halo tracer $P_{TT}^{1h}(k)$ [Mpc$^3 h^{-3}$]',
      yscale: 'log',
    },
    power_1h_cross_tracer_matter: {
      xlab: 'Fourier Scale, $k$ [$h$/Mpc]', // KHM LABEL
      ylab: '1-halo matter-tracer $P_{m\\times T}^{1h}(k)$ [Mpc$^3 h^{-3}$]',
      yscale: 'log',
    },
    power_1h_cs_auto_tracer: {
      xlab: 'Fourier Scale, $k$ [$h$/Mpc]', // KHM LABEL
      ylab: '1-halo cen-sat tracer $P_{TT}^{1h, cs}(k)$ [Mpc$^3 h^{-3}$]',
      yscale: 'log',
    },
    power_1h_ss_auto_tracer: {
      xlab: 'Fourier Scale, $k$ [$h$/Mpc]', // KHM LABEL
      ylab: '1-halo sat-sat tracer $P_{TT}^{1h, ss}(k)$ [Mpc$^3 h^{-3}$]',
      yscale: 'log',
    },
    power_2h_auto_matter: {
      xlab: 'Fourier Scale, $k$ [$h$/Mpc]', // KHM LABEL
      ylab: '2-halo matter $P_{mm}^{2h}(k)$ [Mpc$^3 h^{-3}$]',
      yscale: 'log',
    },
    power_2h_auto_tracer: {
      xlab: 'Fourier Scale, $k$ [$h$/Mpc]', // KHM LABEL
      ylab: '2-halo tracer $P_{TT}^{2h}(k)$ [Mpc$^3 h^{-3}$]',
      yscale: 'log',
    },
    power_2h_cross_tracer_matter: {
      xlab: 'Fourier Scale, $k$ [$h$/Mpc]', // KHM LABEL
      ylab: '2-halo matter-tracer $P_{m\\times T}^{2h}(k)$ [Mpc$^3 h^{-3}$]',
      yscale: 'log',
    },
    power_auto_matter: {
      xlab: 'Fourier Scale, $k$ [$h$/Mpc]', // KHM LABEL
      ylab: '2-halo matter $P_{mm}(k)$ [Mpc$^3 h^{-3}$]',
      yscale: 'log',
    },
    power_auto_tracer: {
      xlab: 'Fourier Scale, $k$ [$h$/Mpc]', // KHM LABEL
      ylab: 'Tracer $P_{TT}(k)$ [Mpc$^3 h^{-3}$]',
      yscale: 'log',
    },
    power_cross_tracer_matter: {
      xlab: 'Fourier Scale, $k$ [$h$/Mpc]', // KHM LABEL
      ylab: 'Matter-tracer $P_{m\\times T}(k)$ [Mpc$^3 h^{-3}$]',
      yscale: 'log',
    },
    radii: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: 'Radius [Mpc/$h$]',
      yscale: 'log',
    },
    rho_gtm: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: '$\\rho(>M)$, $M_{\\odot}h^{2}Mpc^{-3}$',
      yscale: 'log',
    },
    rho_ltm: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: '$\\rho(<M)$, $M_{\\odot}h^{2}Mpc^{-3}$',
      yscale: 'linear',
    },
    satellite_occupation: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: 'Satellite Tracer Occupation',
      yscale: 'log',
    },
    sd_bias_correction: {
      xlab: 'Scale, $r$ [Mpc/$h$]', // R Label
      ylab: 'Scale-dependent bias correction',
      yscale: 'linear',
    },
    sigma: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: 'Mass Variance, $\\sigma$',
      yscale: 'linear',
    },
    total_occupation: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: 'Total Tracer Occupation',
      yscale: 'log',
    },
    tracer_cmz_relation: {
      xlab: 'Mass $(M_{\\odot}h^{-1})$', // M Label
      ylab: 'Tracer Concentration',
      yscale: 'log',
    },
    transfer_function: {
      xlab: 'Wavenumber, $k$ [$h$/Mpc]', // K Label
      ylab: '$T(k)$, [Mpc$^3 h^{-3}$]',
      yscale: 'log',
    },
  },
  xLabels: {
    k: 'Wavenumber, $k$ [$h$/Mpc]', // K Label
    k_hm: 'Fourier Scale, $k$ [$h$/Mpc]', // KHM LABEL
    m: 'Mass $(M_{\\odot}h^{-1})$', // M Label
    r: 'Scale, $r$ [Mpc/$h$]', // R Label
  },
});

export const m = deepFreeze({
  x: [
    'm',
    'sigma',
    'radii',
    'lnsigma',
    'halo_bias',
    'n_eff',
    'dndm',
    'ngtm',
    'dndlnm',
    'dndlog10m',
    'rho_gtm',
    'rho_ltm',
  ],
  y: [
    'central_occupation',
    'cmz_relation',
    'dndlnm',
    'dndlog10m',
    'dndm',
    'fsigma',
    'halo_bias',
    'how_big',
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
    'k_hm',
  ],
});

export const k = deepFreeze({
  x: ['k'],
  y: [
    'delta_k',
    'nonlinear_delta_k',
    'nonlinear_power',
    'power',
    'transfer_function',
  ],
});
export const k_hm = deepFreeze({
  x: ['k_hm'],
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
});
export const r = deepFreeze({
  x: ['r'],
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
});

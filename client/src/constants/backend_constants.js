import deepFreeze from 'deep-freeze';

export default deepFreeze({
  cosmo_model: 'Planck15',
  n: 0.9667,
  sigma_8: 0.8159,
  lnk_min: -18.420680743952367,
  lnk_max: 9.903487552536127,
  dlnk: 0.05,
  z: 0,
  transfer_model: 'CAMB',
  takahashi: true,
  growth_model: 'GrowthFactor',
  hmf_model: 'Tinker08',
  Mmin: 0,
  Mmax: 18,
  dlog10m: 0.01,
  mdef_model: null,
  delta_c: 1.686,
  filter_model: 'TopHat',
  disable_mass_conversion: true,
  halo_profile_model: 'NFW',
  halo_concentration_model: 'Duffy08',
  bias_model: 'Tinker10',
  sd_bias_model: null,
  exclusion_model: 'NoExclusion',
  dr_table: 0.01,
  rmin: 0.01,
  rmax: 120,
  rnum: 100,
  rlog: true,
  hm_logk_min: -2,
  hm_logk_max: 2,
  hm_dlog10k: 0.05,
  hc_spectrum: 'nonlinear',
  force_1halo_turnover: true,
  hod_model: 'Zehavi05',
  tracer_profile_model: null,
  tracer_concentration_model: null,
  tracer_density: null,
  halo_model_params: {
    rmin: -2,
    rmax: 2.1,
    rnum: 100,
    hm_logk_min: -2.0,
    hm_logk_max: 2.0,
    hm_dlog10k: 0.05,
    hc_spectrum: 'nonlinear',
    force_1halo_turnover: true,
  },
  Cosmo_params: {
    Planck13: {
      cosmo_params: {
        H0: 67.77,
        Ob0: 0.048252,
        Om0: 0.30712,
      },
      z: 0.0,
      n: 0.9619,
      sigma_8: 0.8347,
    },
    Planck15: {
      cosmo_params: {
        H0: 67.74,
        Ob0: 0.0486,
        Om0: 0.3075,
      },
      z: 0.0,
      n: 0.965,
      sigma_8: 0.802,
    },
    WMAP5: {
      cosmo_params: {
        H0: 70.2,
        Ob0: 0.0459,
        Om0: 0.277,
      },
      z: 0.0,
      n: 0.962,
      sigma_8: 0.817,
    },
    WMAP7: {
      cosmo_params: {
        H0: 70.4,
        Ob0: 0.0455,
        Om0: 0.272,
      },
      z: 0.0,
      n: 0.967,
      sigma_8: 0.81,
    },
    WMAP9: {
      cosmo_params: {
        H0: 69.32,
        Ob0: 0.04628,
        Om0: 0.2865,
      },
      z: 0.0,
      n: 0.9646,
      sigma_8: 0.817,
    },
  },
  _GrowthFactor_params: {
    GrowthFactor: {
      dlna: 0.01,
      amin: 1e-8,
    },
    GenMFGrowth: {
      dz: 0.01,
      zmax: 1000,
    },
    Carroll1992: {
      dz: 0.01,
      zmax: 1000,
    },
    CambGrowth: {},
  },
  TransferComponent_params: {
    FromFile: {
      fname: '',
    },
    CAMB: {
      camb_params: null,
      dark_energy_params: {},
      extrapolate_with_eh: false,
    },
    FromArray: {
      k: null,
      T: null,
    },
    EH_BAO: {},
    EH_NoBAO: {},
    BBKS: {
      a: 2.34,
      b: 3.89,
      c: 16.1,
      d: 5.47,
      e: 6.71,
    },
    BondEfs: {
      a: 37.1,
      b: 21.1,
      c: 10.8,
      nu: 1.12,
    },
    EH: {},
  },
  Filter_params: {
    TopHat: {},
    Gaussian: {},
    SharpK: {
      c: 2.5,
    },
    SharpKEllipsoid: {
      c: 2,
    },
  },
  MassDefinition_params: {
    SphericalOverdensity: {},
    SOGeneric: {},
    SOMean: {
      overdensity: 200,
    },
    SOCritical: {
      overdensity: 200,
    },
    SOVirial: {},
    FOF: {
      linking_length: 0.2,
    },
  },
  FittingFunction_params: {
    PS: {},
    SMT: {
      a: 0.707,
      p: 0.3,
      A: 0.3222,
    },
    // ST: {
    //   a: 0.707,
    //   p: 0.3,
    //   A: 0.3222,
    // },
    Jenkins: {
      A: 0.315,
      b: 0.61,
      c: 3.8,
    },
    Warren: {
      A: 0.7234,
      b: 1.625,
      c: 0.2538,
      d: 1.1982,
      e: 1,
    },
    Reed03: {
      a: 0.707,
      p: 0.3,
      A: 0.3222,
      c: 0.7,
    },
    Reed07: {
      A: 0.3222,
      p: 0.3,
      c: 1.08,
      a: 0.764,
    },
    Peacock: {
      a: 1.529,
      b: 0.704,
      c: 0.412,
    },
    Angulo: {
      A: 0.201,
      b: 1.7,
      c: 1.172,
      d: 2.08,
    },
    AnguloBound: {
      A: 0.265,
      b: 1.9,
      c: 1.4,
      d: 1.675,
    },
    Watson_FoF: {
      A: 0.282,
      b: 2.163,
      c: 1,
      d: 1.21,
      e: 1.406,
    },
    Watson: {
      C_a: 0.023,
      d_a: 0.456,
      d_b: 0.139,
      p: 0.072,
      q: 2.13,
      A_0: 0.194,
      alpha_0: 1.805,
      beta_0: 2.267,
      gamma_0: 1.287,
      z_hi: 6,
      A_hi: 0.563,
      alpha_hi: 0.874,
      beta_hi: 3.81,
      gamma_hi: 1.453,
      A_a: 1.097,
      A_b: 3.216,
      A_c: 0.074,
      alpha_a: 3.136,
      alpha_b: 3.058,
      alpha_c: 2.349,
      beta_a: 5.907,
      beta_b: 3.599,
      beta_c: 2.344,
      gamma_z: 1.318,
    },
    Crocce: {
      A_a: 0.58,
      A_b: 0.13,
      b_a: 1.37,
      b_b: 0.15,
      c_a: 0.3,
      c_b: 0.084,
      d_a: 1.036,
      d_b: 0.024,
      e: 1,
    },
    Courtin: {
      A: 0.348,
      a: 0.695,
      p: 0.1,
    },
    Bhattacharya: {
      A_a: 0.333,
      A_b: 0.11,
      a_a: 0.788,
      a_b: 0.01,
      p: 0.807,
      q: 1.795,
    },
    Tinker08: {
      A_200: 0.1858659,
      A_300: 0.1995973,
      A_400: 0.2115659,
      A_600: 0.2184113,
      A_800: 0.2480968,
      A_1200: 0.2546053,
      A_1600: 0.26,
      A_2400: 0.26,
      A_3200: 0.26,
      a_200: 1.466904,
      a_300: 1.521782,
      a_400: 1.559186,
      a_600: 1.614585,
      a_800: 1.869936,
      a_1200: 2.128056,
      a_1600: 2.301275,
      a_2400: 2.529241,
      a_3200: 2.661983,
      b_200: 2.571104,
      b_300: 2.254217,
      b_400: 2.048674,
      b_600: 1.869559,
      b_800: 1.588649,
      b_1200: 1.507134,
      b_1600: 1.464374,
      b_2400: 1.436827,
      b_3200: 1.40521,
      c_200: 1.193958,
      c_300: 1.270316,
      c_400: 1.335191,
      c_600: 1.446266,
      c_800: 1.581345,
      c_1200: 1.79505,
      c_1600: 1.965613,
      c_2400: 2.237466,
      c_3200: 2.439729,
      A_exp: 0.14,
      a_exp: 0.06,
    },
    Tinker10: {
      alpha_200: 0.368,
      alpha_300: 0.363,
      alpha_400: 0.385,
      alpha_600: 0.389,
      alpha_800: 0.393,
      alpha_1200: 0.365,
      alpha_1600: 0.379,
      alpha_2400: 0.355,
      alpha_3200: 0.327,
      beta_200: 0.589,
      beta_300: 0.585,
      beta_400: 0.544,
      beta_600: 0.543,
      beta_800: 0.564,
      beta_1200: 0.623,
      beta_1600: 0.637,
      beta_2400: 0.673,
      beta_3200: 0.702,
      gamma_200: 0.864,
      gamma_300: 0.922,
      gamma_400: 0.987,
      gamma_600: 1.09,
      gamma_800: 1.2,
      gamma_1200: 1.34,
      gamma_1600: 1.5,
      gamma_2400: 1.68,
      gamma_3200: 1.81,
      phi_200: -0.729,
      phi_300: -0.789,
      phi_400: -0.91,
      phi_600: -1.05,
      phi_800: -1.2,
      phi_1200: -1.26,
      phi_1600: -1.45,
      phi_2400: -1.5,
      phi_3200: -1.49,
      eta_200: -0.243,
      eta_300: -0.261,
      eta_400: -0.261,
      eta_600: -0.273,
      eta_800: -0.278,
      eta_1200: -0.301,
      eta_1600: -0.301,
      eta_2400: -0.319,
      eta_3200: -0.336,
      beta_exp: 0.2,
      phi_exp: -0.08,
      eta_exp: 0.27,
      gamma_exp: -0.01,
      max_z: 3,
    },
    // Behroozi: {
    //   alpha_200: 0.368,
    //   alpha_300: 0.363,
    //   alpha_400: 0.385,
    //   alpha_600: 0.389,
    //   alpha_800: 0.393,
    //   alpha_1200: 0.365,
    //   alpha_1600: 0.379,
    //   alpha_2400: 0.355,
    //   alpha_3200: 0.327,
    //   beta_200: 0.589,
    //   beta_300: 0.585,
    //   beta_400: 0.544,
    //   beta_600: 0.543,
    //   beta_800: 0.564,
    //   beta_1200: 0.623,
    //   beta_1600: 0.637,
    //   beta_2400: 0.673,
    //   beta_3200: 0.702,
    //   gamma_200: 0.864,
    //   gamma_300: 0.922,
    //   gamma_400: 0.987,
    //   gamma_600: 1.09,
    //   gamma_800: 1.2,
    //   gamma_1200: 1.34,
    //   gamma_1600: 1.5,
    //   gamma_2400: 1.68,
    //   gamma_3200: 1.81,
    //   phi_200: -0.729,
    //   phi_300: -0.789,
    //   phi_400: -0.91,
    //   phi_600: -1.05,
    //   phi_800: -1.2,
    //   phi_1200: -1.26,
    //   phi_1600: -1.45,
    //   phi_2400: -1.5,
    //   phi_3200: -1.49,
    //   eta_200: -0.243,
    //   eta_300: -0.261,
    //   eta_400: -0.261,
    //   eta_600: -0.273,
    //   eta_800: -0.278,
    //   eta_1200: -0.301,
    //   eta_1600: -0.301,
    //   eta_2400: -0.319,
    //   eta_3200: -0.336,
    //   beta_exp: 0.2,
    //   phi_exp: -0.08,
    //   eta_exp: 0.27,
    //   gamma_exp: -0.01,
    //   max_z: 3,
    // },
    Pillepich: {
      A: 0.6853,
      b: 1.868,
      c: 0.3324,
      d: 1.2266,
      e: 1,
    },
    Manera: {
      // A: null,
      a: 0.709,
      p: 0.289,
    },
    Ishiyama: {
      A: 0.193,
      b: 1.55,
      c: 1,
      d: 1.186,
      e: 2.184,
    },
  },
  WDM_params: {
    Viel05: {
      mu: 1.12,
      g_x: 1.5,
    },
    Bode01: {
      mu: 1.12,
      g_x: 1.5,
    },
  },
  WDMRecalibrateMF_params: {
    Schneider12_vCDM: {
      beta: 1.16,
    },
    Schneider12: {
      alpha: 0.6,
    },
    Lovell14: {
      beta: 0.99,
      gamma: 2.7,
    },
  },
  Profile_params: {
    NFW: {},
    NFWInf: {},
    Hernquist: {},
    HernquistInf: {},
    Moore: {},
    MooreInf: {},
    Constant: {},
    GeneralizedNFW: {
      alpha: 1,
    },
    GeneralizedNFWInf: {
      alpha: 1,
    },
    Einasto: {
      alpha: 0.18,
      use_interp: true,
    },
    CoredNFW: {},
  },
  CMRelation_params: {
    Bullock01: {
      F: 0.01,
      K: 3.4,
    },
    Bullock01Power: {
      a: 9,
      b: -0.13,
      c: 1,
    },
    Duffy08: {
      ms: 2000000000000,
      sample: 'relaxed',
    },
    Zehavi11: {
      a: 11,
      b: -0.13,
      c: 1,
      ms: 2260000000000,
    },
    Ludlow16: {
      f: 0.02,
      C: 650,
    },
    Ludlow16Empirical: {
      c0_0: 3.395,
      c0_z: -0.215,
      beta_0: 0.307,
      beta_z: 0.54,
      gamma1_0: 0.628,
      gamma1_z: -0.047,
      gamma2_0: 0.317,
      gamma2_z: -0.893,
    },
    Ludlow2016: {
      f: 0.02,
      C: 650,
    },
    Ludlow2016Empirical: {
      c0_0: 3.395,
      c0_z: -0.215,
      beta_0: 0.307,
      beta_z: 0.54,
      gamma1_0: 0.628,
      gamma1_z: -0.047,
      gamma2_0: 0.317,
      gamma2_z: -0.893,
    },
  },
  CMRelation_options: {
    Bullock01: 'Bullock (2001) Physical Form',
    Bullock01Power: 'Bullock (2001) Power-Law',
    Duffy08: 'Duffy (2008) Power-Law',
    Zehavi11: 'Zehavi (2011) Power-Law',
    Ludlow16: 'Ludlow (2016)',
    Ludlow16Empirical: 'Ludlow (2016) Empirical',
  },
  HOD_params: {
    Zehavi05: {
      M_min: 11.6222,
      M_1: 12.851,
      alpha: 1.049,
    },
    Zheng05: {
      M_min: 11.6222,
      M_1: 12.851,
      alpha: 1.049,
      M_0: 11.5047,
      sig_logm: 0.26,
    },
    Contreras13: {
      M_min: 11.6222,
      M_1: 12.851,
      alpha: 1.049,
      M_0: 11.5047,
      sig_logm: 0.26,
      fca: 0.5,
      fcb: 0,
      fs: 1,
      delta: 1,
      x: 1,
    },
    Geach12: {
      M_min: 11.6222,
      M_1: 12.851,
      alpha: 1.049,
      M_0: 11.5047,
      sig_logm: 0.26,
      fca: 0.5,
      fcb: 0,
      fs: 1,
      delta: 1,
      x: 1,
    },
    Tinker05: {
      M_min: 11.6222,
      M_1: 12.851,
      M_cut: 12,
    },
    Zehavi05WithMax: {
      M_min: 11.6222,
      M_1: 12.851,
      alpha: 1.049,
      M_max: 18,
    },
    Zehavi05Marked: {
      M_min: 11.6222,
      M_1: 12.851,
      logA: 0,
      alpha: 1.049,
      M_max: 18,
    },
    ContinuousPowerLaw: {
      M_min: 11.6222,
      M_1: 12.851,
      logA: 0,
      alpha: 1.049,
      M_max: 18,
      sigma_A: 0,
    },
    Constant: {
      logA: 0,
      M_min: 11,
      sigma_A: 0,
    },
  },
  Exclusion_options: {
    NoExclusion: 'No Exclusion',
    Sphere: 'Spherical Halos',
    DblSphere_: 'Spherical Overlapping Halos',
    DblEllipsoid_: 'Ellipsoidal Halos',
    NgMatched_: 'Density-Matched (Tinker 2005)',
  },
  Exclusion_params: {
    NoExclusion: {},
    Sphere: {},
    DblSphere: {},
    DblSphere_: {},
    DblEllipsoid: {},
    DblEllipsoid_: {},
    NgMatched: {},
    NgMatched_: {},
  },
  Bias_params: {
    UnityBias: {},
    Mo96: {},
    Jing98: {
      a: 0.5,
      b: 0.06,
      c: 0.02,
    },
    ST99: {
      q: 0.707,
      p: 0.3,
    },
    SMT01: {
      a: 0.707,
      b: 0.5,
      c: 0.6,
    },
    Seljak04: {
      a: 0.53,
      b: 0.39,
      c: 0.45,
      d: 0.13,
      e: 40,
      f: 0.0005,
      g: 1.5,
    },
    Seljak04Cosmo: {
      a: 0.53,
      b: 0.39,
      c: 0.45,
      d: 0.13,
      e: 40,
      f: 0.0005,
      g: 1.5,
      a1: 0.4,
      a2: 0.3,
    },
    Tinker05: {
      a: 0.707,
      b: 0.35,
      c: 0.8,
    },
    Mandelbaum05: {
      q: 0.73,
      p: 0.15,
    },
    Pillepich10: {
      B0: 0.647,
      B1: -0.32,
      B2: 0.568,
    },
    Manera10: {
      q: 0.709,
      p: 0.248,
    },
    Tinker10: {
      B: 0.183,
      b: 1.5,
      c: 2.4,
    },
    Tinker10PBSplit: {
      alpha_200: 0.368,
      alpha_300: 0.363,
      alpha_400: 0.385,
      alpha_600: 0.389,
      alpha_800: 0.393,
      alpha_1200: 0.365,
      alpha_1600: 0.379,
      alpha_2400: 0.355,
      alpha_3200: 0.327,
      beta_200: 0.589,
      beta_300: 0.585,
      beta_400: 0.544,
      beta_600: 0.543,
      beta_800: 0.564,
      beta_1200: 0.623,
      beta_1600: 0.637,
      beta_2400: 0.673,
      beta_3200: 0.702,
      gamma_200: 0.864,
      gamma_300: 0.922,
      gamma_400: 0.987,
      gamma_600: 1.09,
      gamma_800: 1.2,
      gamma_1200: 1.34,
      gamma_1600: 1.5,
      gamma_2400: 1.68,
      gamma_3200: 1.81,
      phi_200: -0.729,
      phi_300: -0.789,
      phi_400: -0.91,
      phi_600: -1.05,
      phi_800: -1.2,
      phi_1200: -1.26,
      phi_1600: -1.45,
      phi_2400: -1.5,
      phi_3200: -1.49,
      eta_200: -0.243,
      eta_300: -0.261,
      eta_400: -0.261,
      eta_600: -0.273,
      eta_800: -0.278,
      eta_1200: -0.301,
      eta_1600: -0.301,
      eta_2400: -0.319,
      eta_3200: -0.336,
      beta_exp: 0.2,
      phi_exp: -0.08,
      eta_exp: 0.27,
      gamma_exp: -0.01,
      max_z: 3,
    },
  },
  ScaleDepBias_params: {
    TinkerSD05: {
      a: 1.17,
      b: 1.49,
      c: 0.69,
      d: 2.09,
    },
  },
  _HODCross_params: {
    ConstantCorr: {
      R_ss: 0,
      R_cs: 0,
      R_sc: 0,
    },
  },
});

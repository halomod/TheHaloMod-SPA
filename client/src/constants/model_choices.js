/**
 * The model choices for different types of forms. This is held in its own file
 * because some forms have the same model choices between them.
 */
const modelChoices = {
  cosmo: {
    Planck13: 'Planck13',
    Planck15: 'Planck15',
    WMAP5: 'WMAP5',
    WMAP7: 'WMAP7',
    WMAP9: 'WMAP9',
  },
  hmf: {
    'Press-Schechter (1974)': 'PS',
    'Sheth-Mo-Tormen (2001)': 'SMT',
    'Jenkins (2001)': 'Jenkins',
    'Reed (2003)': 'Reed03',
    'Warren (2006)': 'Warren',
    'Reed (2007)': 'Reed07',
    'Peaock (2007)': 'Peacock',
    'Tinker (2008)': 'Tinker08',
    'Crocce (2010)': 'Crocce',
    'Courtin (2010)': 'Courtin',
    'Tinker (2010)': 'Tinker10',
    'Bhattacharya (2011)': 'Bhattacharya',
    'Angulo (2012)': 'Angulo',
    'Angulo (Subhaloes) (2012)': 'AnguloBound',
    'Watson (FoF Universal) (2012)': 'Watson_FoF',
    'Watson (Redshift Dependent) (2012)': 'Watson',
    'Behroozi (Tinker Extension to High-z) (2013)': 'Behroozi',
    'Pillepich (2010)': 'Pillepich',
    'Manera (2010)': 'Manera',
    'Ishiyama (2015)': 'Ishiyama',
  },
  hod: {
    'Zehavi (3-param), 2005': 'Zehavi05',
    'Zheng (5-param), 2005': 'Zheng05',
    'Contreras (9-param), 2013': 'Contreras13',
    'Geach (8-param), 2012': 'Geach12',
    'Tinker (3-param), 2005': 'Tinker05',
    'Zehavi (2005) with max': 'Zehavi05WithMax',
    'Zehavi (2005) dimensional': 'Zehavi05Marked',
    'Continuous Power Law': 'ContinuousPowerLaw',
    'Constant Occupancy': 'Constant',
  },
  bias: {
    'Tinker (2010)': 'Tinker10',
    Unbiased: 'UnityBias',
    'Mo (1996)': 'Mo96',
    'Jing (1998)': 'Jing98',
    'Sheth-Tormen (1999)': 'ST99',
    'Sheth-Mo-Tormen (2001)': 'SMT01',
    'Seljak (2004) Without Cosmo': 'Seljak04',
    'Seljack (2004) With Cosmo': 'Seljak04Cosmo',
    'Mandelbaum (2005)': 'Mandelbaum05',
    'Pillepich (2010)': 'Pillepich10',
    'Manera (2010)': 'Manera10',
    'Tinker (2010) Peak-Background Split': 'Tinker10PBSplit',
  },
  concentration: {
    'Bullock (2001) Physical Form': 'Bullock01',
    'Bullock (2001) Power-Law': 'Bullock01Power',
    'Duffy (2008) Power-Law': 'Duffy08',
    'Zehavi (2011) Power-Law': 'Zehavil11',
    'Ludlow (2016)': 'Ludlow2016',
    Ludlow16Empirical: 'Ludlow (2016) Empirical',
  },
  growth: {
    Integral: 'GrowthFactor',
    GenMF: 'GenMFGrowth',
    'Carroll (1992)': 'Carroll1992',
  },
  filter: {
    'Top-hat': 'TopHat',
    Gaussian: 'Gaussian',
    'Sharp-k': 'SharpK',
    'Sharp-k with ellipsoidal correction': 'SharpKEllipsoid',
  },
  mdef: {
    'Use native definition of mass function': 'SOGeneric',
    'Spherical Overdensity wrt mean': 'SOMean',
    'Spherical Overdensity wrt critical': 'SOCritical',
    'Virial Spherical Overdensity (Bryan and Norman)': 'SOVirial',
    'Friends-of-Friends': 'FOF',
  },
  transfer: {
    CAMB: 'CAMB',
    'Eisenstein-Hu (1998) (with BAO)': 'EH_BAO',
    'Eisenstein-Hu (1998) (no BAO)': 'EH_NoBAO',
    'BBKS (1986)': 'BBKS',
    'Bond-Efstathiou': 'BondEfs',
  },
  profile: {
    'NFW (1997)': 'NFW',
    Hernquist: 'Hernquist',
    Moore: 'Moore',
    'Generalized NFW': 'GeneralizedNFW',
    Einasto: 'Einasto',
    'Cored NFW': 'CoredNFW',
  },
  halo_exclusion: {
    'No Exclusion': 'NoExclusion',
    'Spherical Halos': 'Sphere',
    'Spherical Overlapping Halos': 'DblSphere',
    'Ellipsoidal Halos': 'DblEllipsoid',
    'Density-Matched (Tinker 2005)': 'NgMatched',
  },
};

// Add the tracer concentration null option
modelChoices.tracer_concentration = {
  'Same as Halo Concentration': 'null',
  ...modelChoices.concentration,
};
// Add the tracer profile null option
modelChoices.tracer_profile = {
  'Same as Halo Profile': 'null',
  ...modelChoices.profile,
};

export default modelChoices;

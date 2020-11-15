<template>
  <form novalidate>
    <md-field>
      <label> Model Name </label>
      <md-input v-model="model_metadata.model_name"/>
    </md-field>
    <md-field>
      <label> Plot Choice </label>
      <md-select v-model="model_metadata.fig_type">
        <md-option v-for="option in options" :key="option" :value="option">
          {{option}}
        </md-option>
      </md-select>
    </md-field>
  </form>
</template>

<script>
const options = [
  'dndm',
  'dndlnm',
  'dndlog10m',
  'fsigma',
  'ngtm',
  'rho_gtm',
  'rho_ltm',
  'how_big',
  'sigma',
  'lnsigma',
  'n_eff',
  'power',
  'transfer_function',
  'delta_k',
  'halo_bias',
  'cmz_relation',
  'corr_auto_tracer',
  'corr_2h_auto_tracer',
  'corr_1h_auto_tracer',
  'corr_1h_cs_auto_tracer',
  'corr_1h_ss_auto_tracer',
  'corr_linear_mm',
  'corr_1h_auto_matter',
  'corr_2h_auto_matter',
  'corr_1h_cross_tracer_matter',
  'corr_2h_cross_tracer_matter',
  'corr_auto_matter',
  'corr_cross_tracer_matter',
  'sd_bias_correction',
  'central_occupation',
  'satellite_occupation',
  'total_occupation',
  'power_2h_auto_matter',
  'power_1h_auto_matter',
  'power_auto_matter',
  'power_auto_tracer',
  'power_1h_auto_tracer',
  'power_2h_auto_tracer',
  'power_1h_cs_auto_tracer',
  'power_1h_ss_auto_tracer',
  'power_1h_cross_tracer_matter',
  'power_2h_cross_tracer_matter',
  'power_cross_tracer_matter',
  'nonlinear_delta_k',
  'nonlinear_power',
  'radii',
  'tracer_cmz_relation',
];

export default {
  name: 'ModelMetadataForm',
  title: 'Model Metadata',
  id: 'model-metadata',
  model: {
    prop: 'parent_model',
    event: 'onChange',
  },
  data() {
    return {
      options,
      model_metadata: {
        fig_type: 'dndm',
        model_name: 'Model',
      },
    };
  },
  updated() {
    this.$emit('onChange', this.model_metadata);
  },
};
</script>

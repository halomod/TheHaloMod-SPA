<template>
  <div class='md-layout-item'>
    <div v-if="typeof value === 'object'">
      <div v-for="(subVal, subKey) in value" :key="subKey">
        <recursive-input-field :value="subVal" />
      </div>
    </div>
    <div :key="param" v-for="(value, param) in model[params_key]">
      <md-checkbox
        v-if="typeof value === 'boolean'"
        class="md-primary"
        v-model="model[params_key][param]">
        {{param}}
      </md-checkbox>
      <div v-if="typeof value === 'object'">
        <div v-for="(subVal, subKey) in value" :key="subKey">
          <double-field
            :init="defaults[params_key][param][subKey]"
            :param="subKey"
            range=false
            v-model="model[params_key][param][subKey]"/>
        </div>
      </div>
      <double-field
        v-else
        :init="defaults[params_key][param]"
        :param="param"
        range=false
        v-model="model[params_key][param]"/>
    </div>
  </div>
</template>

<script>
/**
 * Represents a recursive input field that changes based on the type of data
 * that is given to it.
 *
 * The data given to it can be any data type. If it is an object, it will go
 * through each key value pair and display the input for that. If it is an
 * array, it will display a dropdown to select each option.
 */
export default {
  name: 'RecursiveInputField',
  props: {
    initialValue: {
      required: true,
    },
    value: {
      required: true,
    },
  },
};
</script>

<style>

</style>

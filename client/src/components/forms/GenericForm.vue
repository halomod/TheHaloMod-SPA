<template>
  <form novalidate>
    <div class='md-layout md-gutter'>
      <div class='md-layout-item'>
        <md-field>
          <label>{{title}}</label>
          <md-select v-model="localHMModelFlat[model_key]">
            <md-option
              v-for="(value, choice) in modelChoices"
              :key="choice"
              :value="value">
              {{choice}}
            </md-option>
          </md-select>
        </md-field>
      </div>

      <div class='md-layout-item'>
        <div :key="param" v-for="(value, param) in localHMModelFlat[params_key]">
          <md-checkbox
            v-if="typeof value === 'boolean'"
            class="md-primary"
            v-model="localHMModelFlat[params_key][param]">
            {{param}}
          </md-checkbox>
          <div v-else-if="typeof value === 'object'">
            <div v-for="(subVal, subKey) in value" :key="subKey">
              <double-field
                :init="localHMModelFlat[params_key][param][subKey]"
                :param="subKey"
                range=false
                v-model="localHMModelFlat[params_key][param][subKey]"/>
            </div>
          </div>
          <double-field
            v-else
            :init="localHMModelFlat[params_key][param]"
            :param="param"
            range=false
            v-model="localHMModelFlat[params_key][param]"/>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import clonedeep from 'lodash.clonedeep';
import DoubleField from '@/components/DoubleField.vue';
import Debug from 'debug';
import isEqual from 'lodash.isequal';

const debug = Debug('GenericForm.vue');
debug.enabled = true;

export default {
  name: 'GenericForm',
  model: {
    event: 'onChange',
  },
  props: {
    relevantHMModelFlat: {
      type: Object,
      required: true,
    },
    /**
     * See `forms.js` for descriptions on what each of the below props are for.
     */
    title: {
      type: String,
      required: true,
    },
    model_key: {
      type: String,
      required: true,
    },
    params_key: {
      type: String,
      required: true,
    },
    modelChoices: {
      type: Object,
      required: true,
    },
    /**
     * Holds the data for each model that could be chosen. The chosen model will
     * switch what is in localHMModelFlat to what is held inside, and
     * overwrite those values that correspond in localHMModelFlat.
     */
    modelChoicesData: {
      type: Object,
      required: true,
    },
    updateModelChoice: {
      type: Function,
      required: true,
    },
    /**
     * These are fields that don't change when the model changes, but they
     * should still be configured by the current form.
     */
    extraHMModelData: {
      type: Object,
      required: false,
    },
  },
  components: {
    DoubleField,
  },
  data() {
    return {
      /**
       * A local version of the relevant hmModelFlat.
       */
      localHMModelFlat: clonedeep(this.relevantHMModelFlat),
      /**
       * The cached options that the user has selected previously for the
       * different models, but possibly haven't been saved to the server yet.
       */
      localModelChoicesData: clonedeep(this.modelChoicesData),
      /**
       * A local version of the extraHMModelData.
       */
      localExtraHMModelData: clonedeep(this.extraHMModelData),
    };
  },
  created() {
    this.$watch(
      function toWatch() {
        return this.localHMModelFlat[this.model_key];
      },
      function updateParams(newModelName, oldModelName) {
        debug('updateParams was ran');
        debug('current localHMModelFlat is: ', this.localHMModelFlat);
        if (oldModelName === newModelName) return;
        // Use the method of updating appropriate to the form
        const [newHMModelFlat, newModelChoicesData] = this.updateModelChoice(
          oldModelName,
          newModelName,
          this.localHMModelFlat,
          this.localModelChoicesData,
        );
        // Change everything but the model name to avoid infinite loop
        debug('current localHMModelFlat is: ', this.localHMModelFlat);
        delete newHMModelFlat[this.model_key];
        debug('newHMModelFlat is: ', newHMModelFlat);
        this.localHMModelFlat = Object.assign(
          this.localHMModelFlat,
          newHMModelFlat,
        );
        this.localModelChoicesData = newModelChoicesData;
      },
    );
  },
  watch: {
    /**
     * If the state is changed locally, pass it up to the parent.
     */
    localHMModelFlat: {
      deep: true,
      handler() {
        this.$emit('onChange', clonedeep(this.localHMModelFlat));
      },
    },
    /**
     * If the state is changed by the parent, change the local values.
     */
    relevantHMModelFlat: {
      deep: true,
      handler(newHMModelFlat) {
        if (!isEqual(this.localHMModelFlat, newHMModelFlat)) {
          this.localHMModelFlat = clonedeep(this.relevantHMModelFlat);
        }
      },
    },
  },
};
</script>

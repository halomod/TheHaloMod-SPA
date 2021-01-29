<template>
  <md-list-item>
    <div class="md-list-item-text">
      <md-field :style="{width: '75%'}">
        <md-input
          @focus.native="editMode"
          ref="input"
          :value="localName"
          v-model="localName"/>
      </md-field>
      <!-- <label v-else @dblclick="focus">
        {{localName}}
      </label> -->
    </div>

    <div v-if="editing">
      <md-button
        class="md-icon-button"
        @click="reset">
        <md-icon>close</md-icon>
        <md-tooltip>Cancel</md-tooltip>
      </md-button>
      <md-button
        class="md-icon-button"
        @click="localName === name ? reset() : submit()">
        <md-icon>done</md-icon>
        <md-tooltip>Confirm</md-tooltip>
      </md-button>
    </div>
    <div v-else>
      <md-button
        class="md-icon-button"
        @click="$emit('edit-click', name)"
        :disabled="buttonsDisabled"
      >
        <md-icon>edit</md-icon>
        <md-tooltip>Edit</md-tooltip>
      </md-button>
      <md-button
        class="md-icon-button"
        @click="$emit('copy-click', name)"
        :disabled="buttonsDisabled"
      >
        <md-icon>content_copy</md-icon>
        <md-tooltip>Copy</md-tooltip>
      </md-button>
      <md-button
        class="md-icon-button"
        @click="$emit('delete-click', name)"
        :disabled="buttonsDisabled"
      >
        <md-icon>delete</md-icon>
        <md-tooltip>Delete</md-tooltip>
      </md-button>
    </div>
  </md-list-item>
</template>

<script>
export default {
  name: 'Model',
  props: {
    name: {
      type: String,
    },
    /**
     * Used to disable the buttons, like if the model is loading.
     */
    buttonsDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localName: this.name,
      editing: false,
    };
  },
  methods: {
    reset() {
      this.editing = false;
      this.localName = this.name;
    },
    editMode() {
      this.editing = true;
    },
    submit() {
      this.editing = false;
      this.$emit('rename-click', this.localName);
    },
  },
};
</script>

<style scoped>
  .md-field:before {
    height: 0px,
  }
  .md-field:after {
    height: 0px
  }
</style>

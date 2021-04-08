<template>
  <md-list-item>
    <div class="md-list-item-text">
      <md-field>
        <md-input
          @mousedown="(e) => blocked && !editing ? e.preventDefault() : null"
          @focus.native="editMode"
          :value="localName"
          v-model="localName"/>
      </md-field>
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
        :disabled="blocked"
      >
        <md-icon>edit</md-icon>
        <md-tooltip>Edit</md-tooltip>
      </md-button>
      <md-button
        class="md-icon-button"
        @click="$emit('copy-click', name)"
        :disabled="blocked"
      >
        <md-icon>content_copy</md-icon>
        <md-tooltip>Copy</md-tooltip>
      </md-button>
      <md-button
        class="md-icon-button"
        @click="$emit('delete-click', name)"
        :disabled="blocked"
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
    blocked: {
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
      this.$emit('release');
    },
    editMode() {
      if (this.blocked === true) return;
      this.editing = true;
      this.$emit('block');
    },
    submit() {
      this.editing = false;
      this.$emit('rename-click', this.localName);
      this.$emit('release');
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
  .md-field {
    margin: 0px 0px 0px 0px;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>

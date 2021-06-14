<template>
  <div>
    <md-list-item>
      <div class="md-list-item-text">
        <md-field :class="`renameField ${validationClass}`">
          <md-input
            @mousedown="(e) => blocked && !editing ? e.preventDefault() : null"
            @focus.native="editMode"
            :value="localName"
            v-model="localName"/>
        </md-field>
        <md-tooltip v-if="!editing">Click or tap to edit model name</md-tooltip>
      </div>
      <md-icon v-if="invalidName" class="md-accent">warning
        <md-tooltip :md-active="invalidName">Name is already in use</md-tooltip>
      </md-icon>

      <div v-if="editing">
        <md-button
          class="md-icon-button"
          @click="reset">
          <md-icon>close</md-icon>
          <md-tooltip>Cancel</md-tooltip>
        </md-button>
        <md-button
          class="md-icon-button"
          @click="localName === name ? reset() : submit()"
          :disabled="invalidName">
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
          @click="showBugReportDialog = true"
        >
          <md-icon>bug_report</md-icon>
          <md-tooltip>Report Bug</md-tooltip>
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
    <md-dialog
      id="bug-dialog"
      :md-active.sync="showBugReportDialog"
      :md-close-on-esc="false"
      :md-click-outside-to-close="false">
      <md-dialog-title>{{`Report a bug in model '${name}'`}}</md-dialog-title>
      <md-dialog-content>
        <form novalidate>
          <h3>Contact Information</h3>
          <md-field>
            <label>Name</label>
            <md-input v-model="bugDetails.bugContactName"/>
          </md-field>
          <md-field>
            <label>Email</label>
            <md-input v-model="bugDetails.bugContactEmail"/>
          </md-field>
          <md-divider/>
          <h3>Bug Details</h3>
          <md-field>
            <label>Bug Description</label>
            <md-textarea v-model="bugDetails.bugText"/>
          </md-field>
        </form>
      </md-dialog-content>
      <md-dialog-actions>
          <md-button @click="
            $emit('bug-click', bugDetails);
            showBugReportDialog = false">
            Submit
          </md-button>
          <md-button @click="showBugReportDialog = false">Cancel</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
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
      showBugReportDialog: false,
      bugDetails: {
        bugContactName: '',
        bugContactEmail: '',
        bugText: '',
      },
      editing: false,
    };
  },
  computed: {
    invalidName() {
      const invalid = this.$store.state.modelNames.includes(this.localName.trim())
                      && this.localName.trim() !== this.name;
      return invalid;
    },
    validationClass() { return { 'md-invalid': this.invalidName }; },
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
      this.localName = this.localName.trim();
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
  .md-list-item {
    display: flex;
  }
  .md-field {
    margin: 0px 0px 0px 0px;
    height: '100%';
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .md-dialog-container {
    min-width: '400px'
  }
  .md-textarea {
    width: 30vw;
    height: 40vh;
  }

  #model-buttons {
    padding-bottom: 15px;
  }
  #error {
    color: red;
    font-size: small;
  }
</style>

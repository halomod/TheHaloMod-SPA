<template>
    <div>
        <md-field>
            <label for="tracerProfileChoices">Tracer Profile</label>
            <md-select v-model="tracerProfile" id="tracerProfileChoices"  name="tracerProfile">
                <md-option
                    v-for="choice in tracerProfileChoices"
                    :key="choice"
                    :value="choice"
                >
                    {{choice}}
                </md-option>
            </md-select>
        </md-field>
    </div>
</template>

<script>

const tracerProfileChoices = [
  'NFW 1997',
  'Hernquist',
  'Moore',
  'Generalized NFW',
  'Einasto',
  'Cored NFW',
];

export default {
  name: 'TracerProfileForm',
  data: () => ({
    tracerProfileChoices,
    tracerProfile: tracerProfileChoices[0],
  }),
};
</script>

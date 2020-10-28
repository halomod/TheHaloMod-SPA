<template>
  <div>
    <md-field>
      <label for="biasChoice"></label>
      <md-select v-model="biasChoice" name="biasChoice">
        <md-option
          v-for="choice in biasChoises"
          :key="choice"
          :value="choice">
          {{choice}}
        </md-option>
      </md-select>
    </md-field>
  </div>
</template>

<script> 
  const biasChoices = [
    "Tinker (2010",
    "Unbiased",
    "Mo (1996)",
    "Jing (1998)",
    "Sheth-Tormen (1999)",
    "Sheth-Mo-Tormen (2001)",
    "Seljak (2004) Without Cosmo",
    "Seljack (2004) With Cosmo",
    "Mandelbaum (2005)",
    "Pillepich (2010)",
    "Manera (2010)",
    "Tinker (2010) Peak-Background Split"
  ]
  export default {
    name: 'BiasForm',
    data: () => ({
      biasChoices,
      biasChoice: biasChoices[0]
      
    })
}
</script>
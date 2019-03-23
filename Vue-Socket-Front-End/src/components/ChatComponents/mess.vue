<template>
  <v-container>
    <hr>
    <div>
      <h4>sender: {{sender}}</h4>
    </div>
    <div>
      <h4>receiver: {{receiver}}</h4>
    </div>
    <div>
      <h4>message: {{text}}</h4>
    </div>
    <div>
      <h4>timeStamp: {{timeStamp}}</h4>
    </div>
    <hr>
  </v-container>
</template>

<script>
export default {
  name: "Mess",
  props: {
    sender: String,
    receiver: String,
    text: String,
    timeStamp: String
  }
};
</script>

<style>
</style>

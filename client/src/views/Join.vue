<template>
  <form action>
    <input v-model="name" placeholder="Name" />
    <button v-on:click="onSubmit" type="submit">Join</button>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ChatApi from "../api/chat-api";

@Component({})
export default class Join extends Vue {
  private name: string = "";

  private onSubmit() {
    ChatApi.join({ name: this.name });
    this.$router.push("chat");
  }
}
</script>

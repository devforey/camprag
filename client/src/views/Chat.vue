<template>
  <div class="chats">
    <ul>
      <li v-for="chat in chats">
        <div v-if="isMessage(chat)">
          <div class="message">{{ chat.message }}</div>
          <div class="user">{{ chat.from }}</div>
          <div class="timestamp">{{ chat.date }}</div>
        </div>
        <div v-if="isNotification(chat)">
          <div class="notification">Notification: {{ chat.message }}</div>
        </div>
      </li>
    </ul>

    <form>
      <input v-model="message" placeholder="Message" />
      <button v-on:click="onSubmit" type="submit">Send</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ChatApi from "../api/chat-api";

@Component({})
export default class Chat extends Vue {
  private chats: ChatItem[] = [];
  private message: string = "";

  public mounted() {
    if (!ChatApi.isAuth()) {
      this.$router.push("join");
      return;
    }

    ChatApi.onMessageReceive().subscribe(
      function(message) {
        this.chats.push({
          type: ChatItemType.MESSAGE,
          message: message.message,
          from: message.sender,
          date: message.timestamp
        });
      }.bind(this)
    );

    ChatApi.onUserJoin().subscribe(
      function(user) {
        this.chats.push(user);
        this.chats.push({
          type: ChatItemType.NOTIFICATION,
          message: user.name + " just joined."
        });
      }.bind(this)
    );

    ChatApi.onUserDisconnect().subscribe(
      function(user) {
        this.chats.push(user);
        this.chats.push({
          type: ChatItemType.NOTIFICATION,
          message: user.name + " just left."
        });
      }.bind(this)
    );
  }

  public onSubmit() {
    ChatApi.sendMessage(this.message);
    this.message = "";
  }

  public isMessage(chat: ChatItem): boolean {
    return chat.type === ChatItemType.MESSAGE;
  }

  public isNotification(chat: ChatItem): boolean {
    return chat.type === ChatItemType.NOTIFICATION;
  }
}

interface ChatItem {
  type: ChatItemType;
  message?: string;
  from?: string;
  date?: string;
}

enum ChatItemType {
  NOTIFICATION,
  MESSAGE
}
</script>

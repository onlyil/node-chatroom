<template>
  <div class="container">
    <div class="msg-box">
      <div class="room-name">chatname</div>
      <div class="content"></div>
    </div>
    <div class="send-box">
      <el-input
        class="send-input"
        v-model="message"
        placeholder="..."></el-input>
      <el-button
        type="primary"
        @click="sendMessage">Send</el-button>
    </div>
    <div class="tip">
      <p>Chat commands:</p>
      <ul>
        <li>Change nickname: '/nick (username)'</li>
        <li>Join/create room: '/join (roomname)'</li>
      </ul>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import env from '../config/env'
import Chat from '../lib/chat'

export default {
  name: 'App',
  data() {
    return {
      socket: null,
      chat: null,
      message: '',
    }
  },
  created() {
    this.chat = new Chat()
    this.socket = io(env.socketUrl)
  },
  mounted() {
    
  },
  methods: {
    sendMessage() {

    },
  },
}
</script>

<style lang="stylus">
.container
  width 980px
  height 100%
  margin 0 auto
  padding 30px
  .msg-box
    display flex
    flex-direction column
    height 400px
    border 1px solid #DCDFE6
    border-radius 3px
    .room-name
      text-align center
      font-size 20px
      font-weight bold
      background-color #e9eef3
    .content
      flex 1
      overflow-y auto
  .send-box
    display flex
    margin-top 20px
    .send-input
      margin-right 10px
  .tip
    margin-top 20px
    padding 20px
    background-color #e9eef3
    border-radius 3px
</style>

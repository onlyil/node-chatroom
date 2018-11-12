<template>
  <div class="container">
    <div class="msg-box">
      <div class="room-name">{{ room }}</div>
      <div class="content" ref="content">
        <div
          class="message-item"
          v-for="(item, index) in messageList"
          :key="index">
          <div
            class="self"
            v-if="item.type === 0">
            <p class="nickname">{{ item.nickname }}</p>
            <div class="message right-angle">{{ item.message }}</div>
          </div>
          <div v-else-if="item.type === 1">
            <p class="nickname">{{ item.nickname }}</p>
            <p class="message left-angle">{{ item.message }}</p>
          </div>
          <div
            class="notify-box"
            v-else>
            <p class="notify">{{ item.message }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="send-box">
      <el-input
        class="send-input"
        v-model="message"
        @keyup.native.enter="sendMessage"
        placeholder="..."
        autofocus></el-input>
      <el-button
        type="primary"
        @click="sendMessage"
        plain>Send</el-button>
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
      room: '',
      nickname: '',
      message: '',
      messageList: [
        {
          type: 2,
          message: 'welcome!',
        },
        {
          type: 0,
          message: 'nihao',
          nickname: 'only',
        },
        {
          type: 1,
          message: 'sasdfsdf 爱死扽龙看 阿龙防老接龙啊负担来看蓝来 了',
          nickname: 'Guest',
        }
      ],
    }
  },
  created() {
    this.socket = io(env.socketUrl)
    this.chat = new Chat(this.socket)
    this.addListener()
  },
  mounted() {},
  methods: {
    sendMessage() {
      this.chat.sendMessage({
        room: this.room,
        text: this.message,
      })
      this.messageList.push({
        type: 0,
        message: this.message,
        nickname: this.nickname,
      })
      this.message = ''
      const content = this.$refs.content
      content.scrollTop = content.scrollHeight
    },
    addListener() {
      this.socket.on('connect', () => {
        console.log('连接了！！')
      })
      this.socket.on('nameResult', (msg) => {
        this.nickname = msg.name
        this.$notify({
          title: '提示',
          message: `初始名字为 ${msg.name} ，您可以使用命令修改`,
          duration: 3000,
        })
      })
      this.socket.on('joinResult', (msg) => {
        this.room = msg.room
      })
      this.socket.on('message', (msg) => {
        this.messageList.push({
          type: 1, // 0: self, 1: others, 2: notify
          message: msg.text,
          nickname: msg.nickname,
        })
        this.scrollToBottom()
      })
      this.socket.on('notify', (msg) =>{
        this.messageList.push({
          type: 2, // 0: self, 1: others, 2: notify
          message: msg.text,
        })
        this.scrollToBottom()
      })
    },
    scrollToBottom() {
      const content = this.$refs.content
      this.$nextTick(() => {
        if (content.scrollHeight - content.scrollTop < 458) {
          content.scrollTop = content.scrollHeight
        }
      })
    },
  },
  beforeDestroy() {
    this.socket.emit('disconnect')
  }
}
</script>

<style lang="stylus">
.container
  width 980px
  height 100%
  margin 0 auto
  padding 20px
  .msg-box
    display flex
    flex-direction column
    height 500px
    border 1px solid #DCDFE6
    border-radius 3px
    .room-name
      text-align center
      font-size 20px
      font-weight bold
      background-color #e9eef3
      line-height 40px
    .content
      flex 1
      padding 20px
      overflow-y auto
      .nickname
        line-height 36px
        color #999
      .message
        position relative
        display inline-block
        max-width 80%
        padding 0 10px
        line-height 36px
        background-color #e9eef3
        border-radius 5px
      .left-angle:before,
      .right-angle:before
        content: ''
        position absolute
        top -14px
        width 0
        height 0
        border 8px solid transparent
        border-bottom 8px solid #e9eef3
      .left-angle:before
        left 0
      .right-angle:before
        right 0
      .self
        text-align right
      .notify-box
        margin 10px 0
        text-align center
        .notify
          display inline-block
          padding 0 10px
          background-color #cdcdcd
          color #fff
          border-radius 3px
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
@media screen and (max-width: 980px)
  .container
    width 100%
  
</style>

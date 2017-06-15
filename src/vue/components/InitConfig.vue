<template>
  <div class="qcw-init-config">

    <div class="qcw-header">
      Chat
      <i class="fa fa-chevron-down" @click="toggleChatWindow"></i>
    </div>

    <div class="qcw-config-form">
      <label>email</label>
      <input type="email" v-model="email">

      <label>name</label>
      <input type="text" v-model="username">

      <!--<label>password</label>
      <input type="text" v-model="key">-->

      <label>description</label>
      <textarea v-model="description"></textarea>

      <label>target email</label>
      <input type="text" v-model="target_email">
      <small style="color: red">*) Only fill this field when you want to chat specific user after login</small>

      <button @click="activateChat">Start Chatting</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InitConfig',
    data() {
      return {
        email: 'guest@qiscus.com',
        key: 'password',
        username: 'Qiscus Demo',
        description: 'This account is used for demo purpose only',
        target_email: 'fikri@qiscus.com'
        // target_email: '6281212345678@kiwari-prod.com'
      }
    },
    methods: {
      toggleChatWindow() {
        this.$store.dispatch('toggleChatWindow');
      },
      activateChat() {
        const self = this;
        qiscus.init({
          AppId: 'dragongo',
          // AppId: 'kiwari-prod',
          plugins: ['emoji'],
          mode: 'widget',
          options: {
            email: this.email,
            username: this.username,
            description: this.description,
            newMessagesCallback: function(Data){
              self.$store.dispatch('updateSelected');
            },
            loginSuccessCallback: function() {
              // qiscus.UI.chatTarget('cs1@klikmami.com');
              if(self.target_email.length > 0) qiscus.UI.chatTarget(self.target_email);
            }
          }
        });
        qiscus.setUser(this.email, this.key, this.username);
        this.$store.dispatch('toggleInit');
        this.toggleChatWindow();
      }
    }
  }
</script>

<style lang="scss">
  .qcw-init-config {
    label {
      display: block;
      font-size: 14px;
    }
    input, button, textarea {
      display: inline-block;
      width: 100%;
      padding: 5px 7px;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin: 5px 0 15px 0;
    }
    small {
      display: block;
      margin-top: -7px;
      font-size: 10px;
      margin-bottom: 15px;
    }
    button {
      background: #8bc;
      cursor: pointer;
      color: #FFF; border: 0;
      padding: 15px;
      font-weight: bold;
      text-shadow: 0 -1px 0 rgba(0,0,0,.3);
    }
  }
  .qcw-config-form {
    padding: 20px;
  }
</style>
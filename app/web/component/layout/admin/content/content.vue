<template>
  <div class='main-content'>
      <div class='main-container'>
        <transition name="custom-classes-transition" enter-active-class="animated tada"
                    leave-active-class="animated bounceOutRight">
          <router-view></router-view>
        </transition>
      </div>
  </div>
</template>
<style>
  @import 'content.css';
</style>
<script type='babel'>
  export default {
    name:'v-content',
    data(){
      return {

      }
    },
    components: {},
    mounted() {

    }
  };
</script>

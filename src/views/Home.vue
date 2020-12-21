<template>
  <div class="home">
    <!--<img alt="Vue logo" src="../assets/logo.png">-->
    <SignUp message="Welcome to Firechat"/>
  </div>
</template>

<script>
// @ is an alias to /src
import SignUp from '@/components/SignUp.vue';

export default {
  name: 'Home',
  components: {
    SignUp
  }
};
</script>

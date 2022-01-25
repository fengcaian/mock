<template>
  <div>{{prop1}}
  </div>
</template>
<script>
export default{
    props: ['prop1', 'prop2'],
    data() {
        return {};
    },
    created() {
        conosle.log(this.prop2);
    },
}
</script>
export default {
  beforeCreate() {
    console.log(this);
    console.log(this.$options);
    console.log(this.$options.router);
    console.log('test mixin 11111111111111111');
    console.log(this._routerRoot);
    console.log(this._routerRoot === this);
  }
}
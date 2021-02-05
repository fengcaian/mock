export default {
  props: {
    level: {
      require: true,
      type: Number,
    }
  },
  data() {
    return {
      divWidth: 200,
      divHeight: 150
    };
  },
  render(createElement) {
    const a = createElement('div', {
      style: {
        width: `${this.$data.divWidth}px`,
        height: `${this.divHeight}px`,
        border: '1px solid green'
      },
    },[
      createElement('div', {
        style: {
          width: '100px',
          height: '100px',
          border: '1px solid grey'
        },
      })
    ]);
    console.log(a);
    return a;
  }
};
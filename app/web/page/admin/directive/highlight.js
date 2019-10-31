import hljs from 'highlight.js';

export default {
  componentUpdated(el) {
    hljs.highlightBlock(el);
  },
  inserted (el) {
    hljs.highlightBlock(el);
  }
};

<template>
  <div id="mountNode" :style="{width: width}">
    <div class="editor">
      <context-menu></context-menu>
      <toolbar @editorModeChange="editorModeChange"></toolbar>
      <div style="height: 42px;"></div>
      <div class="bottom-container">
        <item-panel v-if="initMode === 'edit'"></item-panel>
        <detail-panel v-if="initMode === 'edit'"></detail-panel>
        <mini-map></mini-map>
        <page :height="height" :width="width" :data="data"></page>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from './../../framework/utils/my-editor/Editor';
import Command from './../../framework/utils/my-editor/Command';
import contextMenu from './contextMenu';
import toolbar from './toolbar';
import itemPanel from './itemPanel';
import detailPanel from './detailPanel';
import miniMap from './miniMap';
import page from './page';
import customShape from './../../framework/utils/my-editor/customShape';

export default {
  components: {
    contextMenu,
    toolbar,
    itemPanel,
    detailPanel,
    miniMap,
    page,
  },
  props: {
    width: {
      type: Number,
      default: document.documentElement.clientWidth
    },
    height: {
      type: Number,
      default: document.documentElement.clientHeight
    },
    data: {
      type: Object,
      default: () => {}
    },
    model: {
      type: String,
      default: 'default'
    },
  },
  data() {
    return {
      editor: {},
      command: null,
      initMode: '',
    };
  },
  created() {
    this.initMode = this.mode;
    this.init();
    customShape();
    console.log(document.documentElement.clientWidth);
  },
  methods: {
    init() {
      this.editor = new Editor(this);
      this.command = new Command(this.editor);
    },
    editorModeChange(obj) {
      this.initMode = obj.mode;
    },
  },
};
</script>

<style scoped>
  .editor {
    position: relative;
    width: 100%;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
  .bottom-container {
    position: relative;
  }
</style>
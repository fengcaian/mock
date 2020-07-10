<template>
  <div id="g6Container"></div>
</template>

<script>
import G6 from '@antv/g6';

export default {
  data() {
    return {
      g6Data: {
        nodes: [
          {
            id: 'node1',
            x: 100,
            y: 200,
          },
          {
            id: 'node2',
            x: 300,
            y: 200,
          }
        ],
        edges: [
          {
            source: 'node1',
            target: 'node2',
          }
        ],
        combos: [
          {
            id: 'combo0',
            size: 10,
            type: 'circle',
            style: {}
          },
          {
            id: 'rect_combo',
            type: 'rect',
            label: 'Rect Combo',
            labelCfg: {
              position: 'bottom',
              refX: 5,
              refY: -12,
              style: {
                fill: '#fff'
              }
            },
            style: {
              fill: '#fa8c16',
              stroke: '#000',
              lineWidth: 2
            }
          },
        ],
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.registerBehavior();
      const graph = new G6.Graph({
        container: 'g6Container',
        width: 800,
        height: 600,
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'activate-node', {
            type: 'tooltip', // 提示框
            formatText(model) {
              // 提示框文本内容
              const text = 'label: ' + model.label + '<br/> class: ' + model.class;
              return text;
            },
          },], // 允许拖拽画布、放缩画布、拖拽节点
        },
        defaultNode: {
          position: 'left',
          style: {
            background: {
              fill: '#baafad',
              stroke: 'green',
              padding: [3, 2, 3, 2],
              radius: 2,
              lineWidth: 3,
            },
          },
          linkPoints: {
            top: true,
            bottom: true,
            left: true,
            right: true,
            fill: '#fff',
            size: 5,
          },
        },
        defaultEdge: {
          autoRotate: true,
          style: {
            background: {
              fill: '#ffffff',
              stroke: '#000000',
              padding: [2, 2, 2, 2],
              radius: 2,
            },
          },
        },
        defaultCombo: {
          // ... 其他属性
          style: {
            fill: '#steelblue',
            stroke: '#eaff8f',
            lineWidth: 5,
            // ... 其他属性
          },
          labelCfg: {
            position: 'top',
            offset: [10, 10, 10, 10],
            style: {
              fill: '#666',
            },
          },
        },
        // 节点不同状态下的样式集合
        nodeStateStyles: {
          // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
          hover: {
            fill: '#fa5555',
          },
          // 鼠标点击节点，即 click 状态为 true 时的样式
          click: {
            stroke: 'green',
            lineWidth: 3,
          },
        },
        // 边不同状态下的样式集合
        edgeStateStyles: {
          // 鼠标点击边，即 click 状态为 true 时的样式
          click: {
            stroke: 'steelblue',
          },
        },
      });
      // 鼠标进入节点
      graph.on('node:mouseenter', e => {
        const nodeItem = e.item; // 获取鼠标进入的节点元素对象
        graph.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
      });
      // 鼠标离开节点
      graph.on('node:mouseleave', e => {
        const nodeItem = e.item; // 获取鼠标离开的节点元素对象
        graph.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
      });
      // 点击节点
      graph.on('node:click', e => {
        // 先将所有当前是 click 状态的节点置为非 click 状态
        const clickNodes = graph.findAllByState('node', 'click');
        clickNodes.forEach(cn => {
          graph.setItemState(cn, 'click', false);
        });
        const nodeItem = e.item; // 获取被点击的节点元素对象
        graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true
      });
      // 点击边
      graph.on('edge:click', e => {
        // 先将所有当前是 click 状态的边置为非 click 状态
        const clickEdges = graph.findAllByState('edge', 'click');
        clickEdges.forEach(ce => {
          graph.setItemState(ce, 'click', false);
        });
        const edgeItem = e.item; // 获取被点击的边元素对象
        graph.setItemState(edgeItem, 'click', true); // 设置当前边的 click 状态为 true
      });
      graph.data(this.g6Data);
      graph.setMode('default');
      graph.render();
    },
    registerBehavior() {
      G6.registerBehavior('activate-node', {
        getDefaultCfg() {
          return {
            multiple: true
          };
        },
        getEvents() {
          return {
            'node:click': 'onNodeClick',
            'canvas:click': 'onCanvasClick'
          };
        },
        onNodeClick(e) {
          const graph = this.graph;
          const item = e.item;
          if (item.hasState('active')) {
            graph.setItemState(item, 'active', false);
            return;
          }
          // this 上即可取到配置，如果不允许多个 'active'，先取消其他节点的 'active' 状态
          if (!this.multiple) {
            this.removeNodesState();
          }
          // 置点击的节点状态 'active' 为 true
          graph.setItemState(item, 'active', true);
          console.log('onNodeClick');
          console.log(e.target);
        },
        onCanvasClick(e) {
          // shouldUpdate 可以由用户复写，返回 true 时取消所有节点的 'active' 状态，即将 'active' 状态置为 false
          if (this.shouldUpdate(e)) {
            this.removeNodesState();
          }
          console.log('onCanvasClick');
          console.log(e.target);
        },
        removeNodesState() {
          const graph = this.graph;
          graph.findAllByState('node', 'active').forEach(node => {
            graph.setItemState(node, 'active', false);
          });
        }
      });
    }
  },
}
</script>

<style scoped>
  /* 提示框的样式 */
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
</style>
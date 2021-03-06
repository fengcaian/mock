import G6 from '@antv/g6';
import hoverNode from './hover-node';
import addEdge from './add-edge';
import dragItem from './drag-item';
import dragEdge from './drag-edge';
import selectNode from './select-node';
import hoverEdge from './hover-edge';
import keyboard from './keyboard';
import multiSelect from './multi-select';
import addMenu from './add-menu';
import clickNode from './click-node';

const behaviors = {
  'hover-node': hoverNode,
  'add-edge': addEdge,
  'drag-item': dragItem,
  'drag-edge': dragEdge,
  'select-node': selectNode,
  'hover-edge': hoverEdge,
  'keyboard':keyboard,
  'multi-select': multiSelect,
  'add-menu': addMenu,
  'click-node': clickNode,
};

export function initBehaviors() {
  for (let key in behaviors) {
    G6.registerBehavior(key, behaviors[key])
  }
}
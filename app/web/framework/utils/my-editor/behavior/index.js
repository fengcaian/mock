import G6 from '@antv/g6';
import hoverNode from './hover-node';
import addEdge from './add-edge';
import dragItem from './drag-item';
import selectNode from './select-node';
import hoverEdge from './hover-edge';
import keyboard from './keyboard';
import multiSelect from './multi-select';
import addMenu from './add-menu';

const behaviors = {
  'hover-node': hoverNode,
  'add-edge': addEdge,
  'drag-item': dragItem,
  'select-node': selectNode,
  'hover-edge': hoverEdge,
  'keyboard':keyboard,
  'multi-select': multiSelect,
  // 'add-menu': addMenu,
};

export function initBehaviors() {
  for (let key in behaviors) {
    G6.registerBehavior(key, behaviors[key])
  }
}
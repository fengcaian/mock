import Subject from '../pub-sub-model/Subject';
export default function (O, key) {
  const sub = new Subject();
  Object.defineProperty(O, key, {
    enumerable: true,
    configurable: true,
    get: function () {

    }
  })
}
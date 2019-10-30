'use strict';

export function type(param) {
    return Object.prototype.toString.call(param).slice(8, -1);
}
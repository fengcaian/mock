const LETTER = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const DATA_TYPE = [
  {
    code: 'mock_data',
    name: 'mock数据',
  },
  {
    code: 'backend_data',
    name: '后端数据',
  }
];

const URL_RESPONSE_MONGODB_PROP = ['_id', 'url', 'urlId', 'dataType', '__v'];

module.exports = { LETTER, DATA_TYPE, URL_RESPONSE_MONGODB_PROP };

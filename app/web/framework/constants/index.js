const httpMethods = ['get', 'head', 'post', 'put', 'delete', 'connect', 'options', 'trace', 'patch'];

const swaggerDefineHttpColor = [
  {
    code: 'get',
    color: '#61AFFE',
    lightColor: '#EFF7FF',
  },
  {
    code: 'post',
    color: '#49CC90',
    lightColor: '#E8F6F0',
  },
];

module.exports = { httpMethods, swaggerDefineHttpColor };
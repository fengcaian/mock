'use strict';
module.exports = {
  get db() {
    return this.app.db;
  },
  async doCurl(url, options, callback) {

      const defaultOptions = {
          timeout: this.app.config.curlTimeout,
          dataType: 'json',
          method: options.method,
          strictSSL: false, // solve 'unable to verify the first certificate' problem
          rejectUnauthorized: false,
      };
      defaultOptions.headers = {
          'x-token': this.req.headers['x-token'],
          'x-cas-account-code': this.req.headers['x-cas-account-code'],
          'x-customer-code': this.req.headers['x-customer-code'],
          'user-agent': this.req.headers['user-agent'],
          'x-req-url': this.req.url,
          'Content-Type': options.contentType,
          origin: this.req.headers.origin,
          cookie: this.req.headers.cookie,
          referer: this.req.headers.referer,
      };
      if (options && options.headers) {
          options.headers = Object.assign(defaultOptions.headers, options.headers);
      }

      try {
        Object.assign(defaultOptions, options)
        const result = await this.curl(url, defaultOptions);
        return result || null;
      } catch (e) {
        this.logger.error(`接口：${url} catch到的错误信息：${e}`);
      }
    },
};
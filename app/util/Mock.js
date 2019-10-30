'use strict';

import type from 'common';

class Mock {
    constructor() {}
    mock() { // dataModel
        const dataModel = {
            "type": "object",
            "properties": {
                "code": {
                    "type": "integer",
                    "format": "int32",
                    "description": "状态码"
                },
                "msg": {
                    "type": "string",
                    "description": "返回消息"
                },
                "result": {
                    "description": "返回结果",
                    "$ref": {
                        "type": "object",
                        "properties": {
                            "dingUserId": {
                                "type": "string",
                                "description": "钉钉用户id"
                            },
                            "dingUserName": {
                                "type": "string",
                                "description": "钉钉用户姓名"
                            },
                            "erpUserId": {
                                "type": "integer",
                                "format": "int32",
                                "description": "erp用户id"
                            },
                            "userId": {
                                "type": "integer",
                                "format": "int32",
                                "description": "主键"
                            },
                            "workNumber": {
                                "type": "string",
                                "description": "工号"
                            }
                        },
                        "title": "UserModel"
                    }
                }
            },
            "title": "ResultVO«UserModel»",
            "description": "通用返回结果VO"
        };
        const { properties } = dataModel;
        let obj = {
            code: 200,
            msg: 'success',
        };
        if (type(dataModel) === 'Array') {
            obj = (dataModel && dataModel[0]) || {};
        } else if (type(properties.result) === 'Object') {
            Object.keys(properties.result || {}).forEach(key => {});
        }
        if (type(properties.result) === 'Object' && properties.result.$ref.) {}
    }
    getObjectData(obj) {
        const result = {};
        Object.keys(obj).forEach((key) => {
            const splitKeyArr = key.split('|');
            if () {}
            result[splitKeyArr[0]] = '';
        });
    }
}

function Response(code, msg, data, totalRow, pageSize, currentPage) {
    this.code = code;
    this.msg = msg;
    if (Object.prototype.toString.call(data).slice(8, -1) === 'Array') {
        if (typeof totalRow === 'number') {
            this.result = {
                dataList: data.length ? data : null,
                totalRow: Number(totalRow),
                pageSize: Number(pageSize),
                currentPage: Number(currentPage)
            }
        } else {
            this.result = data.length ? data : null;
        }
    } else {
        this.result = data || null;
    }
}
module.exports = Response;
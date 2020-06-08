function debug(obj) {
    obj = JSON.stringify(obj, null, 4);
    return obj;
}

module.exports = debug;
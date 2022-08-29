function isDataContainsEmpty(data) {
    for (var key in data) {
        if (data[key].trim() === null || data[key].trim() === "")
            return true;
    }
    return false;
}

module.exports = isDataContainsEmpty
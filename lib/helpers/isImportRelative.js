module.exports = function isImportPathRelative(importValue) {
    return importValue.startsWith('./') || importValue.startsWith('../') || importValue === '.'
}
const isEmpty = (obj: any) => {
    if (obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype || obj == null) {
        return true
    }
    else {
        return false
    }
}
export default isEmpty;
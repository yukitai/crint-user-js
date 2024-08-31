export const clone = <T>(obj: T): T => {
    if (obj instanceof Array) {
        return obj.map(clone) as T
    } else if (obj && typeof(obj) === "object") {
        return Object.fromEntries(Object.entries(obj)
            .map(([k, v]) => [clone(k), clone(v)])) as T
    } else {
        return obj
    }
}
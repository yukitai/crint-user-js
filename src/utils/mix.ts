import { clone } from './clone'

export const mix = <T>(new_value: Partial<T>, default_value: T) => {
    const obj = clone(default_value)
    for (const key in new_value) {
        obj[key] = new_value[key]!
    }
    return obj
}
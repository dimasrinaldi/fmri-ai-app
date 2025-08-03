import _ from "lodash";

export const utilPgSave = <T>(arg: T): T => {
    if (_.isArray(arg)) {
        return arg.map(i => pgSave(i)) as any
    } else {
        return pgSave(arg) as any
    }
}

const pgSave = (arg: any) => {
    let result: any = _.cloneDeep(arg);
    Object.keys(result).forEach(key => {
        const val = result[key];
        if (!isPrimitive(val)) {
            result[key] = JSON.stringify(val)
        }
    })
    return result
}

let isPrimitive = (val: any) => {
    if (val === null || typeof val == "undefined") {
        return true;
    }
    if (typeof val == "object" || typeof val == "function") {
        return false
    } else {
        return true;
    }
}

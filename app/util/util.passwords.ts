import { sha256 } from "js-sha256";

function repeatCall<T>(arg: {
    func: (arg: T) => T,
    value: T,
    n: number,
}): T {
    if (arg.n == 0) return arg.value;
    return repeatCall({
        func: arg.func,
        value: arg.func(arg.value),
        n: arg.n - 1,
    });
}

export function generateSalt() {
    return sha256(Math.random().toString());
}

export function hashPassword(password: string, salt: string) {
    return repeatCall<string>({
        func: sha256,
        value: `${password}:${salt}`,
        n: 3,
    });
}

export function parseStoredPassword(storedPassword: string): [hash: string, salt: string] {
    return [
        storedPassword.split(":")[1], // hash
        storedPassword.split(":")[0], // salt
    ];
}

export function generateStoredPassword(hash: string, salt: string) {
    return `${salt}:${hash}`;
}

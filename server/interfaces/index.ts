export interface Pass {
    id: number
    platform: Platform
}

export interface ApplePass extends Pass {
    // TODO
}

export interface GooglePass extends Pass {
    // TODO
}

export enum Platform {
    Apple,
    Google
}

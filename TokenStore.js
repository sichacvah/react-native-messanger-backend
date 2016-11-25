export default class TokenStore {
    constructor() {
        this.tokens = []
    }

    push(payload) {
        this.tokens = this.remove(payload).tokens().concat([payload])
        return this
    }

    tokens() {
        return this.tokens;
    }

    remove(payload) {
        this.tokens = this.tokens.filter(t => t.phonenumber === payload.phonenumber)
        return this
    }

    isValid(payload) {
        const record = this.tokens.find(t => t.phonenumber === payload.phonenumber)
        if (!record) return false
        return record.token === payload.token
    }
}
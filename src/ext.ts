import { LanguageManager } from "./i18n/manager"

export class ExtManager {

    static load_error (e: any) {
        alert(LanguageManager.format("ext.loaderror", e))
    }

    static register_from_text (text: string) {
        throw new Error("not implemented yet")
        try { eval(text) }
        catch (e) {
            this.load_error(e)
        }
    }

    static register_from_url (url: string) {
        throw new Error("not implemented yet")
        fetch(url)
            .then(x => x.text())
            .then(ExtManager.register_from_text)
            .catch(ExtManager.load_error)
    }
}
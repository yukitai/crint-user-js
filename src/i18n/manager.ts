import { mix } from '../utils/mix'
import en from './en.json'
import zh_cn from './zh-cn.json'
import axolotl from './axolotl.json'

export type I18n = Record<string, string>

export class LanguageManager {
    static i18n: Record<string, I18n> = {}
    static current: string
    static fallback_i18n: string

    static register_i18n(lang: string, i18n: I18n) {
        if (LanguageManager.i18n[lang]) {
            LanguageManager.i18n[lang] = mix(i18n, LanguageManager.i18n[lang])
        } else {
            LanguageManager.i18n[lang] = i18n
        }
    }

    static register_i18ns(i18ns: Record<string, I18n>) {
        for (const lang in i18ns) {
            LanguageManager.register_i18n(lang, i18ns[lang])
        }
    }

    static set_fallback (lang: string) {
        LanguageManager.fallback_i18n = lang
    }

    static set_current (lang: string) {
        LanguageManager.current = lang
    }

    static lookup(id: string): string | undefined {
        if (this.current
         && this.i18n[this.current]
         && this.i18n[this.current][id]) {
            return this.i18n[this.current][id]
        }
        if (this.fallback_i18n
         && this.i18n[this.fallback_i18n]
         && this.i18n[this.fallback_i18n][id]) {
           return this.i18n[this.fallback_i18n][id]
        }
        return undefined
    }

    static format_impl (fmt: string, args: any[]): string {
        let result = "", curr = 0
        for (; curr < fmt.length; ++curr) {
            if (fmt[curr] === "%") {
                ++curr
                if (fmt[curr] === "%") {
                    result += "%"
                } else if (fmt[curr] >= "0" && fmt[curr] <= "9") {
                    const idx = parseInt(fmt[curr])
                    result += String(args[idx])
                } else {
                    --curr
                    result += "%"
                }
            } else {
                result += fmt[curr]
            }
        }
        return result
    }

    static format(id: string, ...args: any[]): string {
        const format_string = LanguageManager.lookup(id) ?? LanguageManager.lookup("i18n.missing")
        return LanguageManager.format_impl(format_string, args)
    }
}

LanguageManager.register_i18ns({
    "en": en,
    "zh-cn": zh_cn,
    "axolotl": axolotl,
})
LanguageManager.set_fallback("en")
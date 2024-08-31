import { LintConfig, LintLevel } from "../config";

const rule_regex = /^@((allow)|(deny)|(warn)):(.*)$/mg

const parse_level = (level: string): LintLevel => {
    switch (level) {
        case "deny": return LintLevel.Deny
        case "warn": return LintLevel.Warn
        default: return LintLevel.Allow
    }
}

export const parse_config = (src: string): Partial<LintConfig> | null => {
    const config: Partial<LintConfig> = {}
    const rule_matched = src.matchAll(rule_regex)
    let has_item = false
    for (const rule of rule_matched) {
        has_item = true
        const level = rule.at(1)
        const lint_rule = rule.at(5)
        config[lint_rule] = parse_level(level)
    }
    return has_item ? config : null
}
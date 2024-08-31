export enum LintLevel {
    Allow = 0,
    Warn = 1,
    Deny = 2,
    Note = 3,
}

export enum LintRule {
    missing_doc_string = "missing_doc_string",
    dead_code = "dead_code",
    nouse_else = "nouse_else",
    convertable_tail_rec = "convertable_tail_rec",
    constexpr = "constexpr",
    magic_number = "magic_number",
    internal_crint_error = "internal_crint_error",
    unused_variable = "unused_variable",
}

export type LintConfig = {
    private_name_format: RegExp,
    public_name_format: RegExp,

    missing_doc_string: LintLevel,

    dead_code: LintLevel,

    nouse_else: LintLevel,
    convertable_tail_rec: LintLevel,

    constexpr: LintLevel,

    magic_number: LintLevel,
    ignore_magic_number_db: number[],
    
    internal_crint_error: LintLevel,
    
    unused_variable: LintLevel,
}

export const default_config: LintConfig = {
    private_name_format: /[a-z_].*/,
    public_name_format: /[A-Z].*/,

    missing_doc_string: LintLevel.Warn,

    dead_code: LintLevel.Warn,

    nouse_else: LintLevel.Warn,
    convertable_tail_rec: LintLevel.Warn,

    constexpr: LintLevel.Warn,

    magic_number: LintLevel.Allow,
    ignore_magic_number_db: [-1, -0.5, 0, 0.5, 1, 2, 10],

    internal_crint_error: LintLevel.Note,

    unused_variable: LintLevel.Warn,
}

export type Config = {
    show_level: LintLevel,
}

export const config: Config = {
    show_level: LintLevel.Warn,
}
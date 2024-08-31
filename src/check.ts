import { AST } from "./ast";
import { LintConfig, LintLevel, LintRule } from "./config"
import { mark_constant } from "./lints/mark_constant";
import { mix } from "./utils/mix";
import { ASTWalker } from "./utils/walker";

export type Message = string

export enum ReportType {
    Allow = 0,
    Warn = 1,
    Deny = 2,
    Note = 3,
    Help = 4,
}

export type Report = {
    ast: AST | null,
    type: ReportType,
    message: Message,
    extra: Report[]
}

export type ReportId = number

export type Linter = {
    
}

export class Checker {
    static linters: (typeof ASTWalker)[] = []

    static register (linter: typeof ASTWalker) {
        this.linters.push(linter)
    }

    config_db: Partial<LintConfig>[]
    config: LintConfig
    reports: Report[]
    ast: AST[]

    constructor (config: LintConfig) {
        this.config_db = [config]
        this.config = config
        this.reports = []
        this.ast = []
    }

    new_config (config: Partial<LintConfig>) {
        this.config_db.push(config)
        this.update_config()
    }

    restore_config () {
        this.config_db.pop()
        this.update_config()
    }

    update_config () {
        this.config = this.config_db[0] as LintConfig
        this.config_db.slice(1)
            .forEach(config => {
                this.config = mix(config, this.config)
            })
    }

    check (ast: AST) {
        mark_constant(ast)
        this.ast.push(ast)
        for (const linter_ of Checker.linters) {
            const linter = new linter_(this)
            linter.walk(ast, true)
            linter.end_walk()
        }
    }

    report (ast: AST | null, rule: LintRule, message: Message): ReportId {
        const id = this.reports.length
        const level = this.config[rule] as LintLevel
        this.reports.push({
            ast,
            type: level as unknown as ReportType,
            message,
            extra: [],
        })
        return id
    }

    help (target: ReportId, message: Message) {
        this.report_extra(target, ReportType.Help, message)
    }

    note (target: ReportId, message: Message) {
        this.report_extra(target, ReportType.Note, message)
    }

    report_extra (target: ReportId, type: ReportType, message: Message) {
        const report = this.reports[target]
        report.extra.push({
            ast: report.ast,
            type,
            message,
            extra: [],
        })
    }
}
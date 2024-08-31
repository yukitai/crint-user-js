import { AST, Val } from '../ast'
import { ReportType } from '../check'
import { LintRule } from '../config'
import { LanguageManager } from '../i18n/manager'
import { ASTWalker } from '../utils/walker'
import { get_constant } from './mark_constant'


export class LintDeadCode extends ASTWalker {
    walk_impl (ast: AST, top_level: boolean) {
        if ((ast.is_hat && ast.next !== null) || !top_level) {
            super.walk_impl(ast, top_level)
        } else {
            const report = this.checker.report(ast, LintRule.dead_code, LanguageManager.format("lint.dead_code.top"))
            this.checker.report_extra(report, ReportType.Help, LanguageManager.format("lint.dead_code.remove"))
        }
    }

    walk_control_if_else (ast: AST) {
        const cond = get_constant(ast.arguments.CONDITION, false)
        if (cond === null) {
            return
        }
        const report = this.checker.report(ast, LintRule.dead_code, LanguageManager.format("lint.dead_code.unused_if-else"))
        if (cond) {
            this.checker.report_extra(report, ReportType.Help, LanguageManager.format("lint.dead_code.remove_else"))
        } else {
            this.checker.report_extra(report, ReportType.Help, LanguageManager.format("lint.dead_code.remove_if"))
        }
    }

    walk_control_if (ast: AST) {
        const cond = get_constant(ast.arguments.CONDITION, false)
        if (cond === null) {
            return
        }
        let report: number
        if (cond) {
            report = this.checker.report(ast, LintRule.dead_code, LanguageManager.format("lint.dead_code.unused_if_true"))
        } else {
            report = this.checker.report(ast, LintRule.dead_code, LanguageManager.format("lint.dead_code.unused_if_false"))
        }
        this.checker.report_extra(report, ReportType.Help, LanguageManager.format("lint.dead_code.remove"))
    }

    walk_control_repeat (ast: AST) {
        const iter = get_constant(ast.arguments.TIMES, 0)
        if (iter === null) {
            return
        }
        const itern = Number(iter)
        let report: number
        if (itern === 1) {
            report = this.checker.report(ast, LintRule.dead_code, LanguageManager.format("lint.dead_code.unused_repeat_1"))
            this.checker.report_extra(report, ReportType.Help, LanguageManager.format("lint.dead_code.remove_repeat"))
        } else if (itern <= 0) {
            report = this.checker.report(ast, LintRule.dead_code, LanguageManager.format("lint.dead_code.unused_repeat_0"))
            this.checker.report_extra(report, ReportType.Help, LanguageManager.format("lint.dead_code.remove"))
        }
    }

    __repeat_cond_impl(cond: boolean, ast: AST) {
        let report: number
        if (cond) {
            report = this.checker.report(ast, LintRule.dead_code, LanguageManager.format("lint.dead_code.unused_repeat_true"))
            this.checker.report_extra(report, ReportType.Help, LanguageManager.format("lint.dead_code.replace_forever"))
        } else {
            report = this.checker.report(ast, LintRule.dead_code, LanguageManager.format("lint.dead_code.unused_repeat_false"))
            this.checker.report_extra(report, ReportType.Help, LanguageManager.format("lint.dead_code.remove"))
        }
    }

    walk_control_repeat_until (ast: AST) {
        const cond = get_constant(ast.arguments.CONDITION, false)
        if (cond === null) {
            return
        }
        this.__repeat_cond_impl(!Boolean(cond), ast)
    }

    walk_control_while (ast: AST) {
        const cond = get_constant(ast.arguments.CONDITION, false)
        if (cond === null) {
            return
        }
        this.__repeat_cond_impl(Boolean(cond), ast)
    }

    walk_control_wait_until (ast: AST) {
        const cond = get_constant(ast.arguments.CONDITION, false)
        if (cond === null) {
            return
        }
        let report: number
        if (!cond) {
            report = this.checker.report(ast, LintRule.dead_code, LanguageManager.format("lint.dead_code.no_wait"))
            this.checker.report_extra(report, ReportType.Help, LanguageManager.format("lint.dead_code.remove"))
        }
    }
}
import { AST } from "../ast";
import { ReportType } from "../check";
import { LintRule } from "../config";
import { Crint } from "../crint";
import { LanguageManager } from "../i18n/manager";
import { ASTWalker } from "../utils/walker";
import { get_constant } from "./mark_constant";

export class LintUnused extends ASTWalker {
    used_vars: Record<string, number>
    used_lists: Record<string, number>

    increase (obj: Record<string, number>, key: string) {
        if (!(key in obj)) {
            obj[key] = 0
        }
        obj[key]++
    }

    get (obj: Record<string, number>, key: string): number {
        return obj[key] ?? 0
    }

    walk_data_variable (ast: AST) {
        const name = get_constant(ast.arguments.VARIABLE, null)
        if (name === null) {
            this.checker.report(null, LintRule.internal_crint_error, LanguageManager.format("ice.non_const_variable_name"))
            return
        }
        this.increase(this.used_vars, String(name))
    }

    walk_data_listcontents (ast: AST) {
        const name = get_constant(ast.arguments.LIST, null)
        if (name === null) {
            this.checker.report(null, LintRule.internal_crint_error, LanguageManager.format("ice.non_const_variable_name"))
            return
        }
        this.increase(this.used_lists, String(name))
    }

    end_walk () {
        const var_and_lists = (Crint.ScratchBlocks() as any).Variables
            .allVariables((Crint.ScratchBlocks() as any).getMainWorkspace()) as {
                type: string,
                name: string,
                id: string,
            }[]
        const vars = var_and_lists.filter(it => it.type !== "list")
        const lists = var_and_lists.filter(it => it.type === "list")

        vars.forEach(it => {
            if (this.get(this.used_vars, it.name) === 0) {
                const report = this.checker.report(null, LintRule.unused_variable, LanguageManager.format("lint.unused.variable", it.name))
                this.checker.report_extra(report, ReportType.Help, LanguageManager.format("lint.unused.remove_variable"))
            }
        })
        lists.forEach(it => {
            if (this.get(this.used_lists, it.name) === 0) {
                const report = this.checker.report(null, LintRule.unused_variable, LanguageManager.format("lint.unused.list", it.name))
                this.checker.report_extra(report, ReportType.Help, LanguageManager.format("lint.unused.remove_list"))
            }
        })
    }
}
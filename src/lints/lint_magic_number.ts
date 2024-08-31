import { AST, Val } from '../ast'
import { LintRule } from '../config'
import { LanguageManager } from '../i18n/manager'
import { ASTWalker } from '../utils/walker'

export class LintMagicNumberWalker extends ASTWalker {

    __impl (ast: AST) {
        const value = ast.arguments.NUM as Val
        const num = Number(value.text)
        if (isNaN(num)
         || (ast !== null && ast.comment !== "")
         || num in this.checker.config.ignore_magic_number_db) {
            return
        }
        const message1 = LanguageManager.format("lint.magic_number.use", value.text)
        const message2 = LanguageManager.format("lint.magic_number.help")
        const report = this.checker.report(ast, LintRule.magic_number, message1)
        this.checker.help(report, message2)
    }

    walk_math_number (ast: AST) {
        this.__impl(ast)
    }

    walk_math_whole_number (ast: AST) {
        this.__impl(ast)
    }
}
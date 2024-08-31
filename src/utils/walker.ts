import { AST } from "../ast";
import { Checker } from "../check";
import { parse_config } from "../parse/config";

export class ASTWalker {
    checker: Checker
    walked: string[]
    
    constructor (checker: Checker) {
        this.checker = checker
        this.walked = []
    }

    walk(ast: AST, top_level: boolean) {
        if (this.walked.includes(ast.id)) {
            return
        }
        
        this.walked.push(ast.id)
        
        let has_config = false
        if (ast.comment) {
            const config = parse_config(ast.comment)
            if (config !== null) {
                this.checker.new_config(config)
                has_config = true
            }
        }
        this.walk_impl(ast, top_level)
    
        if (has_config) {
            this.checker.restore_config()
        }
    }

    walk_impl (ast: AST, _top_level: boolean) {
        const walk_fn = `walk_${ast.opcode}`
        if (this[walk_fn]) {
            this[walk_fn](ast)
        }
        this.generic_walker(ast)
    }

    generic_walker (ast: AST) {
        Object.values(ast.arguments)
            .forEach(it => {
                if (it.type === "ast") {
                    this.walk(it, false)
                }
            })
        if (ast.next) {
            this.walk(ast.next, false)
        }
    }

    end_walk () {}
}
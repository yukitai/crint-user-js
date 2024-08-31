import { AST, Val } from "../ast";
import { opcode_constant, opcode_func_map } from "../opcodes/constant";

export const get_constant = (arg?: AST | Val, default_value: string | number | boolean | null = null): string | number | boolean | null => {
    if (arg === undefined) {
        return default_value
    }
    if (arg.type === "value") {
        return arg.text
    } else {
        return arg.constant
    }
}

export const mark_constant = (ast: AST) => {
    Object.values(ast.arguments)
        .forEach(it => {
            if (it.type === "ast") {
                mark_constant(it)
            }
        })

    if (ast.next) {
        mark_constant(ast.next)
    }

    if (opcode_constant.includes(ast.opcode)) {
        const params: Record<string, string | number | boolean> = {}
        for (const k in ast.arguments) {
            if (ast.arguments[k].type === "value") {
                params[k] = (ast.arguments[k] as Val).text
            } else {
                if ((ast.arguments[k] as AST).constant === null) {
                    return
                }
                params[k] = (ast.arguments[k] as AST).constant
            }
        }
        ast.constant = opcode_func_map[ast.opcode](params)
    }
}
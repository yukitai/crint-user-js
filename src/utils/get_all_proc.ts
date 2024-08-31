import { AST } from "../ast";
import { Checker } from "../check";
import { default_config } from "../config";
import { ASTWalker } from "./walker";

export type Proc = [string, string[]]
export type Procs = Record<string, string[]>

export class WalkAST extends ASTWalker {
    opcodes: Procs = {}

    walk_impl (ast: AST, _top_level: boolean): void {
        if (!(ast.opcode in this.opcodes)) {
            this.opcodes[ast.opcode] = Object.keys(ast.arguments)
        }
    }
}

export const get_all_proc = (ast: AST[]): Proc[] => {
    const walker = new WalkAST(new Checker(default_config))
    ast.forEach(it => walker.walk(it, true))
    return Object.entries(walker.opcodes)
}
import { Block, Workspace } from "scratch-blocks"
import { BlockSvg } from "blockly"

export type Val = {
    type: "value",
    text: string,
    value?: string,
}

export type Opcode = string

export type Comment = string

export type AST = {
    type: "ast",
    id: string,
    svg: BlockSvg,
    opcode: Opcode,
    comment: Comment | null,
    arguments: Record<string, AST | Val>,
    next: AST | null,
    is_hat: boolean,
    constant: string | number | boolean | null,
}

export const build_ast = (blocks: Record<string, Block>, id: string): AST => {
    let block = blocks[id] as BlockSvg
    const inputs = block.inputList

    const ast_arguments: Record<string, AST | Val> = {}

    for (const input of inputs) {
        if (input.connection !== null && input.connection.targetConnection !== null) {
            const name = input.name
            const connection_block = (input.connection.targetConnection as any).sourceBlock_ as BlockSvg
            const connection_id = connection_block.id
            ast_arguments[name] = build_ast(blocks, connection_id)
        }
        for (const field of input.fieldRow) {
            const name = field.name
            if (name) {
                const field_text = (field as any).text_ as string
                const field_value = (field as any).value_ as string
                ast_arguments[name] = {
                    type: "value",
                    text: field_text,
                    value: field_value,
                }
            }
        }
    }

    let next: AST | null = null

    if (block.nextConnection?.targetConnection) {
        const next_block = (block.nextConnection.targetConnection as any).sourceBlock_ as BlockSvg
        next = build_ast(blocks, next_block.id)
    }

    const is_hat = (block as any).startHat_ as boolean

    const comment = block.getCommentText()

    return {
        type: "ast",
        id, 
        svg: block,
        opcode: block.type,
        comment,
        arguments: ast_arguments,
        next,
        is_hat,
        constant: null,
    }
}

export const build_ws = (ws: Workspace): AST[] => {
    const ast = []
    const blockDB = ws.blockDB_
    const topBlockDB = ws.topBlocks_
    for (const block of topBlockDB) {
        ast.push(build_ast(blockDB, (block as BlockSvg).id))
    }
    return ast
}
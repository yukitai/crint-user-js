import { Workspace } from "scratch-blocks";
import { Checker, Report, ReportType } from "./check";
import { LintMagicNumberWalker } from "./lints/lint_magic_number";
import { ASTWalker } from "./utils/walker";
import { build_ws } from "./ast";
import { config, default_config } from "./config";
import { BlockSvg } from "blockly";
import { scroll_block_into_view } from "./blockly/flash";
import { LintDeadCode } from "./lints/lint_dead_code";
import { parse_config } from "./parse/config";
import { mix } from "./utils/mix";
import { LanguageManager } from "./i18n/manager";
import { Proc, get_all_proc } from "./utils/get_all_proc";
import { ExtManager } from "./ext";

Checker.linters.push(LintMagicNumberWalker)
Checker.linters.push(LintDeadCode)

const move = (e: MouseEvent) => {
    Crint.info_el.style.top = `${15 + e.clientY}px`
    Crint.info_el.style.left = `${15 + e.clientX}px`
}

const get_leader_cls = (type: ReportType): [string, string] => {
    switch (type) {
        case ReportType.Allow: return [LanguageManager.format("crint.allow"), "crint-text crint-msg"]
        case ReportType.Warn: return [LanguageManager.format("crint.warn"), "crint-text crint-msg crint-warn"]
        case ReportType.Deny: return [LanguageManager.format("crint.deny"), "crint-text crint-msg crint-error"]
        case ReportType.Note: return [LanguageManager.format("crint.note"), "crint-text crint-msg"]
        case ReportType.Help: return [LanguageManager.format("crint.help"), "crint-text crint-msg crint-fine"]
    }
}

type MEHandler = (e: MouseEvent) => void

export class Crint {
    static ScratchBlocks: () => typeof ScratchBlocks

    static warnings_db: BlockSvg[] = []
    static highlight_db: [BlockSvg, MEHandler, MEHandler][] = []

    static info_el: HTMLDivElement
    static result_info_el: HTMLDivElement
    static result_list_el: HTMLUListElement
    static result_info_content_el: HTMLDivElement

    static get_top_config () {
        let config = default_config
        const top_comments = (this.ScratchBlocks() as any)
            .getMainWorkspace().topComments_ as any[]
        for (const comment of top_comments) {
            if (comment.blockId || !comment.content_) {
                continue
            }
            const new_config = parse_config(comment.content_)
            if (new_config !== null) {
                config = mix(new_config, config)
            }
        }
        return config
    }

    static check_ws(ws: Workspace): Checker {
        const config = this.get_top_config()
        const checker = new Checker(config)
        
        const ws_ast = build_ws(ws)
        ws_ast.forEach(ast => checker.check(ast))

        return checker
    }

    static check(): Checker {
        const config = this.get_top_config()
        const checker = new Checker(config)

        const workspaces = (Crint.ScratchBlocks().Workspace as any).WorkspaceDB_ as Record<string, Workspace>
        Object.values(workspaces).forEach(ws => {
            if ((ws as any).isFlyout) {
                return
            }
            const ws_ast = build_ws(ws)
            ws_ast.forEach(ast => checker.check(ast))
        })

        return checker
    }

    static get_all_proc (checker: Checker): Proc[] {
        return get_all_proc(checker.ast)
    }

    static render_report_html(report: Report): string {
        const [leader, cls] = get_leader_cls(report.type)
        const html = `\
<span class="${cls}">${leader}</span>: \
<span>${report.message}</span>`
        const nest = report.extra.length > 0 ? `\
<div class="crint-nest-block">${
            report.extra.map(Crint.render_report_html).join("")
}</div>` : ""
        return `<div class="crint-item"><div>${html}</div>${nest}</div>`
    }

    static render_report(report: Report) {
        if (report.type < config.show_level) {
            return
        }

        const html = Crint.render_report_html(report)

        const result_li = document.createElement("li")
        result_li.classList.add("crint-list-item")
        result_li.innerHTML = html

        if (report.ast) {
            result_li.onclick = (e: Event) => {
                scroll_block_into_view(report.ast.svg)
                e.preventDefault()
                e.stopImmediatePropagation()
                e.stopPropagation()
            }
            result_li.onmouseenter = (e: MouseEvent) => {
                Crint.info_el.classList.remove("crint-hidden")
                Crint.info_el.style.top = `${15 + e.clientY}px`
                Crint.info_el.style.left = `${15 + e.clientX}px`
                result_li.onmousemove = move

                const block = report.ast.svg

                Crint.info_el.innerHTML = `\
<svg xmlns="http://www.w3.org/2000/svg"\
\ width="${block.width}px"\
\ height="${block.height}px"\
\ style="scale: 0.8;overflow:visible;">\
${(block as any).svgGroup_.innerHTML}\
</svg>`
            }
            result_li.onmouseleave = () => {
                result_li.onmousemove = null
                Crint.info_el.classList.add("crint-hidden")
            }
        }

        Crint.result_list_el.appendChild(result_li)

        if (report.ast === null) {
            return
        }
        
        ;(report.ast.svg as any).highlightForReplacement(report.ast.id)
        
        const enter = (e: MouseEvent) => {
            Crint.info_el.classList.remove("crint-hidden")
            Crint.info_el.style.top = `${15 + e.clientY}px`
            Crint.info_el.style.left = `${15 + e.clientX}px`

            Crint.info_el.innerHTML = html

            ;((report.ast.svg as any).svgGroup_ as SVGGElement).addEventListener("mousemove", move)
        }
        const leave = (_e: MouseEvent) => {
            Crint.info_el.classList.add("crint-hidden")
            ;((report.ast.svg as any).svgGroup_ as SVGGElement).removeEventListener("mousemove", move)
        }
        ;((report.ast.svg as any).svgGroup_ as SVGGElement).addEventListener("mouseenter", enter)
        ;((report.ast.svg as any).svgGroup_ as SVGGElement).addEventListener("mouseleave", leave)
        Crint.highlight_db.push([report.ast.svg, enter, leave])
    }

    static render_result(checker: Checker) {
        Crint.warnings_db.forEach(it => {
            try { it.setWarningText(null) } catch {}
        })

        Crint.highlight_db.forEach(it => {
            try {
                ;(it[0] as any).highlightForReplacement(null)
            } catch {}
            try {
                ;((it[0] as any).svgGroup_ as SVGGElement).removeEventListener("mouseenter", it[1])
                ;((it[0] as any).svgGroup_ as SVGGElement).removeEventListener("mouseleave", it[2])
            } catch {}
        })

        if (this.result_list_el) {
            this.result_list_el.innerHTML = ""
        }

        for (const report of checker.reports) {
            Crint.render_report(report)
        }
    }
}

export const crint_exports = {
    config,
    Checker,
    ASTWalker,
    Crint,
    LanguageManager,
    ExtManager,
}
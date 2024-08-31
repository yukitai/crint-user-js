import { ReportType } from "../check"
import { Crint } from "../crint"
import { LanguageManager } from "../i18n/manager"

const container_cls = "menu-bar_main-menu_3wjWH"

const icon = `<svg style="color: var(--menu-bar-foreground);width: 1rem; height: 100%; vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5997"><path d="M197.376 378.794667a338.645333 338.645333 0 0 1 72.96-108.416 337.92 337.92 0 0 1 108.458667-72.96 346.453333 346.453333 0 0 1 261.546666-1.749334A106.24 106.24 0 0 0 746.666667 298.666667C805.802667 298.666667 853.333333 251.136 853.333333 192S805.802667 85.333333 746.666667 85.333333c-29.397333 0-55.978667 11.776-75.221334 30.933334-103.722667-41.514667-222.848-40.874667-325.76 2.517333-50.773333 21.333333-96.426667 52.053333-135.68 91.264A425.813333 425.813333 0 0 0 85.333333 512h85.333334c0-46.336 9.002667-91.136 26.709333-133.205333z m629.205333 266.410666c-17.109333 40.618667-41.685333 77.141333-72.96 108.416s-67.797333 55.850667-108.458666 72.96a346.453333 346.453333 0 0 1-261.546667 1.749334A106.154667 106.154667 0 0 0 277.333333 725.333333C218.197333 725.333333 170.666667 772.864 170.666667 832S218.197333 938.666667 277.333333 938.666667c29.397333 0 55.978667-11.776 75.221334-30.933334A425.514667 425.514667 0 0 0 512 938.666667a425.941333 425.941333 0 0 0 393.258667-260.352A426.325333 426.325333 0 0 0 938.666667 512h-85.333334a341.034667 341.034667 0 0 1-26.752 133.205333zM512 318.378667c-106.752 0-193.621333 86.869333-193.621333 193.621333S405.248 705.621333 512 705.621333c106.752 0 193.621333-86.869333 193.621333-193.621333S618.752 318.378667 512 318.378667z" p-id="5998"></path></svg>`

const count = (count: number, item: string): string => {
    if (count === 1) {
        return `${count} ${LanguageManager.format(item)}`
    } else {
        return `${count} ${LanguageManager.format(item + "s")}`
    }
}

let icon_el: HTMLDivElement | null = null

export const set_loading = () => {
    icon_el?.classList.add("crint-loading")
}

export const set_finished = () => {
    icon_el?.classList.remove("crint-loading")
}

export const open_result = () => {
    Crint.result_info_el?.classList.remove("crint-hidden")
}

export const close_result = () => {
    Crint.result_info_el?.classList.add("crint-hidden")
}

export const toggle_result = () => {
    Crint.result_info_el?.classList.toggle("crint-hidden")
}

export const inject = () => {
    const container = document.getElementsByClassName(container_cls)[0] as HTMLDivElement
    const icon_btn = document.createElement("div")
    icon_btn.classList.add("crint-btn", "crint-relative")
    icon_btn.innerHTML = `\
<div class="crint-icon" style="display: inline-block;">${icon}</div> \
<span>crint: <span class="crint-msg crint-head-text">${LanguageManager.format("crint.ui.notchecked")}</span></span>`

    inject_result_info_el(icon_btn)

    const crint_msg = icon_btn.getElementsByClassName("crint-msg")[0] as HTMLSpanElement
    icon_el = icon_btn.getElementsByClassName("crint-icon")[0] as HTMLDivElement

    const check = () => {
        set_loading()

        const checker = Crint.check()
        Crint.render_result(checker)

        const info = {
            warn: 0,
            error: 0,
            note: 0,
            allow: 0,
        }
        checker.reports.forEach(report => {
            if (report.type === ReportType.Warn) {
                info.warn++
            } else if (report.type === ReportType.Deny) {
                info.error++
            } else if (report.type === ReportType.Allow) {
                info.allow++
            } else if (report.type === ReportType.Note) {
                info.note++
            }
        })

        Crint.result_info_content_el.innerHTML = `\
<span class="crint-msg crint-error">${count(info.error, "crint.ui.error")}</span>, \
<span class="crint-msg crint-warn">${count(info.warn, "crint.ui.warn")}</span>, \
<span class="crint-msg crint-note">${count(info.note, "crint.ui.note")}</span>, \
<span class="crint-msg">${count(info.allow, "crint.ui.allow")}</span>`

        if (info.warn === 0 && info.error === 0) {
            crint_msg.innerText = `fine`
            crint_msg.classList.remove("crint-error", "crint-warn")
            crint_msg.classList.add("crint-fine")
        } else if (info.error === 0) {
            crint_msg.innerText = count(info.warn, "crint.ui.warn")
            crint_msg.classList.remove("crint-error", "crint-fine")
            crint_msg.classList.add("crint-warn")
        } else {
            crint_msg.innerText = count(info.error, "crint.ui.error")
            crint_msg.classList.remove("crint-warn", "crint-fine")
            crint_msg.classList.add("crint-error")
        }

        set_finished()
    }
    icon_btn.onclick = () => {
        check()
        toggle_result()
    }

    setInterval(check, 60 * 1000)

    container.appendChild(icon_btn)
}

export const inject_style = () => {
    const style_container = document.createElement("div")
    style_container.innerHTML = `<style>\
.crint-loading {animation: 1s ease-in-out 1s infinite running rotate;}\
@keyframes rotate {\
\ from {rotate: 0;}\
\ to {rotate: 360deg;}\
}\
.crint-info-el {\
\ box-shadow: 0 0 14px -7px var(--ui-black-transparent);\
\ border-radius: 0.25rem;\
\ font-family: monospace;\
\ border: 1px solid var(--ui-black-transparent);\
\ background-color: hsl(from var(--ui-white) h s l / 90%);\
\ backdrop-filter: blur(10px);\
\ padding: 0.5rem;\
\ position: fixed;\
\ z-index: 100114514;\
\ color: var(--paint-text-primary);\
\ font-weight: normal;\
}\
.crint-hidden {display: none;}\
.crint-btn {color:var(--menu-bar-foreground);}\
.crint-btn:hover {cursor: pointer;}\
.crint-msg {font-weight: bold;}\
.crint-text {font-family: monospace;}\
.crint-fine {color: rgb(89, 192, 89);}\
.crint-error {color: #ff4c4c;}\
.crint-warn {color: rgb(255, 211, 0);}\
.crint-nest-block {/*margin: 0.1rem 0 0 0.5rem;*/}\
.crint-item {}\
.crint-hr {\
\ margin: 0.2rem 0;\
\ height: 1px;\
\ background-color: var(--ui-black-transparent);\
}\
.crint-list-item {margin: 0.2rem 0;}\
.crint-list {\
\ list-style: none;\
\ padding-left: 0;\
\ margin: 0.4rem 0 -0.2rem 0;\
}\
.crint-head-text.crint-error {filter: brightness(2.5);}\
.crint-head-text.crint-warn {filter: brightness(10);}\
.crint-head-text.crint-fine {filter: brightness(1.5);}\
.crint-relative {position: relative;}\
.crint-result-info-el {\
\ position: absolute;\
\ top: 3rem;\
\ right: 0;\
\ width: max-content;\
\ max-width: 40rem;\
\ max-height: 80vh;\
\ overflow: auto;\
\ box-shadow: 0 0 14px -7px var(--ui-black-transparent);\
\ border-radius: 0.25rem;\
\ font-family: monospace;\
\ border: 1px solid var(--ui-black-transparent);\
\ background-color: hsl(from var(--ui-white) h s l / 90%);\
\ backdrop-filter: blur(10px);\
\ padding: 0.5rem;\
\ z-index: 100114514;\
\ color: var(--paint-text-primary);\
\ font-weight: normal;\
\ font-size: 0.815rem;\
}\
</style>`

    document.documentElement.appendChild(style_container)
}

export const inject_info_el = () => {
    const info_el = document.createElement("div")
    info_el.classList.add("crint-info-el", "crint-hidden")

    Crint.info_el = info_el

    document.documentElement.appendChild(info_el)
}

export const inject_result_info_el = (e: HTMLElement) => {
    const info_el = document.createElement("div")
    info_el.classList.add("crint-result-info-el")
    info_el.classList.add("crint-hidden")

    info_el.innerHTML = `<div class="crint-result-info"></div><div class="crint-hr"></div>`

    Crint.result_info_content_el = info_el.getElementsByClassName("crint-result-info")[0] as HTMLDivElement

    const result_el = document.createElement("ul")
    result_el.classList.add("crint-list")

    Crint.result_info_el = info_el
    Crint.result_list_el = result_el

    info_el.appendChild(result_el)

    e.appendChild(info_el)
}
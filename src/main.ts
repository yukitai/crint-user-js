import { get_scratchblocks } from "./blockly/utils";
import { Crint, crint_exports } from "./crint";
import { inject, inject_info_el, inject_result_info_el, inject_style } from "./inject/inject";

import "./i18n/manager"
import { LanguageManager } from "./i18n/manager";

export const main = () => {

    setTimeout(() => {
        Crint.ScratchBlocks = get_scratchblocks

        inject_style()
        inject_info_el()

        inject()

        setInterval(() => {
            const lang = (get_scratchblocks() as any).ScratchMsgs.currentLocale_
            if (LanguageManager.current !== lang) {
                if (LanguageManager.current) {
                    setTimeout(inject, 1000)
                }
                LanguageManager.set_current(lang)
            }
        }, 1000)

        unsafeWindow.crint = crint_exports
    }, 1000)

}
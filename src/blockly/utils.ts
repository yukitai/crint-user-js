export const get_scratchblocks = (): typeof ScratchBlocks => {
    if (unsafeWindow.ScratchBlocks) {
        return unsafeWindow.ScratchBlocks
    }
    throw new ReferenceError(`crint: cannot find the ScratchBlocks context`)
}
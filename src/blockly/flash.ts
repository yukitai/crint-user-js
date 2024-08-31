import { BlockSvg } from "blockly";

const get_topstack_of_block = block => {
    let base = block;
    while (base.getOutputShape() && base.getSurroundParent()) {
        base = base.getSurroundParent();
    }
    return base;
}

const myFlash = { block: null, timerID: null };

export class BlockFlasher {
    
    static flash(block: BlockSvg) {
        if (myFlash.timerID > 0) {
            clearTimeout(myFlash.timerID);
            if (myFlash.block.svgPath_) {
                myFlash.block.svgPath_.style.fill = "";
            }
        }

        let count = 4;
        let flashOn = true;
        myFlash.block = block;

        function _flash() {
            if (myFlash.block.svgPath_) {
                myFlash.block.svgPath_.style.fill = flashOn ? "#ffff80" : "";
            }
            flashOn = !flashOn;
            count--;
            if (count > 0) {
                myFlash.timerID = setTimeout(_flash, 200);
            } else {
                myFlash.timerID = 0;
                myFlash.block = null;
            }
        }

        _flash();
    }
}

export const scroll_block_into_view = (block: BlockSvg) => {
    if (!block) {
        return;
    }

    const offsetX = 32,
          offsetY = 32;

    const workspace = unsafeWindow.Blockly.getMainWorkspace();

    let root = block.getRootBlock();
    let base = get_topstack_of_block(block);
    let ePos = base.getRelativeToSurfaceXY(), // Align with the top of the block
        rPos = root.getRelativeToSurfaceXY(), // Align with the left of the block 'stack'
        scale = workspace.scale,
        x = rPos.x * scale,
        y = ePos.y * scale,
        xx = block.width + x, // Turns out they have their x & y stored locally, and they are the actual size rather than scaled or including children...
        yy = block.height + y,
        s = workspace.getMetrics();
    if (
        x < s.viewLeft + offsetX - 4 ||
        xx > s.viewLeft + s.viewWidth ||
        y < s.viewTop + offsetY - 4 ||
        yy > s.viewTop + s.viewHeight
    ) {
        // sx = s.contentLeft + s.viewWidth / 2 - x,
        let sx = x - s.contentLeft - offsetX,
            // sy = s.contentTop - y + Math.max(Math.min(32, 32 * scale), (s.viewHeight - yh) / 2);
            sy = y - s.contentTop - offsetY;

        // workspace.hideChaff(),
        workspace.scrollbar.set(sx, sy);
    }
    BlockFlasher.flash(block);
};
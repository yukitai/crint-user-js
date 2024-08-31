// ==UserScript==
// @name         crint
// @version      1.3.1
// @description  A powerful linter for Scratch.
// @author       Yukitai
// @match        https://turbowarp.org/editor
// @match        https://turbowarp.org/editor?*
// @icon         https://turbowarp.org/favicon.ico
// @grant        unsafeWindow
// ==/UserScript==

(function () {
"use strict";var C=()=>{if(unsafeWindow.ScratchBlocks)return unsafeWindow.ScratchBlocks;throw new ReferenceError("crint: cannot find the ScratchBlocks context")};var R=["text","note","matrix","math_number","math_whole_number","operator_add","operator_subtract","operator_multiply","operator_divide","operator_gt","operator_lt","operator_equals","operator_and","operator_or","operator_not","operator_join","operator_letter_of","operator_length","operator_contains","operator_mod","operator_round"],O={text:({TEXT:t})=>String(t),note:({NOTE:t})=>t,matrix:({MATRIX:t})=>t,math_number:({NUM:t})=>Number(t),math_whole_number:({NUM:t})=>Number(t),operator_add:({NUM1:t,NUM2:e})=>Number(t)+Number(e),operator_subtract:({NUM1:t,NUM2:e})=>Number(t)-Number(e),operator_multiply:({NUM1:t,NUM2:e})=>Number(t)*Number(e),operator_divide:({NUM1:t,NUM2:e})=>Number(t)/Number(e),operator_gt:({OPERAND1:t,OPERAND2:e})=>t>e,operator_lt:({OPERAND1:t,OPERAND2:e})=>t<e,operator_equals:({OPERAND1:t,OPERAND2:e})=>t===e,operator_and:({OPERAND1:t,OPERAND2:e})=>!!t&&!!e,operator_or:({OPERAND1:t,OPERAND2:e})=>!!t||!!e,operator_not:({OPERAND:t})=>!t,operator_join:({STRING1:t,STRING2:e})=>String(t)+String(e),operator_letter_of:({LETTER:t,STRING:e})=>String(e)[Math.floor(Number(t))],operator_length:({STRING:t})=>String(t).length,operator_contains:({STRING1:t,STRING2:e})=>String(t).indexOf(String(e))!==-1,operator_mod:({NUM1:t,NUM2:e})=>Number(t)%Number(e),operator_round:({NUM:t})=>Math.round(Number(t))};var h=(t,e=null)=>t===void 0?e:t.type==="value"?t.text:t.constant,w=t=>{if(Object.values(t.arguments).forEach(e=>{e.type==="ast"&&w(e)}),t.next&&w(t.next),R.includes(t.opcode)){let e={};for(let r in t.arguments)if(t.arguments[r].type==="value")e[r]=t.arguments[r].text;else{if(t.arguments[r].constant===null)return;e[r]=t.arguments[r].constant}t.constant=O[t.opcode](e)}};var x=t=>t instanceof Array?t.map(x):t&&typeof t=="object"?Object.fromEntries(Object.entries(t).map(([e,r])=>[x(e),x(r)])):t;var v=(t,e)=>{let r=x(e);for(let n in t)r[n]=t[n];return r};var d=class t{static linters=[];static register(e){this.linters.push(e)}config_db;config;reports;ast;constructor(e){this.config_db=[e],this.config=e,this.reports=[],this.ast=[]}new_config(e){this.config_db.push(e),this.update_config()}restore_config(){this.config_db.pop(),this.update_config()}update_config(){this.config=this.config_db[0],this.config_db.slice(1).forEach(e=>{this.config=v(e,this.config)})}check(e){w(e),this.ast.push(e);for(let r of t.linters){let n=new r(this);n.walk(e,!0),n.end_walk()}}report(e,r,n){let o=this.reports.length,s=this.config[r];return this.reports.push({ast:e,type:s,message:n,extra:[]}),o}help(e,r){this.report_extra(e,4,r)}note(e,r){this.report_extra(e,3,r)}report_extra(e,r,n){let o=this.reports[e];o.extra.push({ast:o.ast,type:r,message:n,extra:[]})}};var y={private_name_format:/[a-z_].*/,public_name_format:/[A-Z].*/,missing_doc_string:1,dead_code:1,nouse_else:1,convertable_tail_rec:1,constexpr:1,magic_number:0,ignore_magic_number_db:[-1,-.5,0,.5,1,2,10],internal_crint_error:3,unused_variable:1},M={show_level:1};var P={"crint.deny":"error","crint.warn":"warn","crint.allow":"suggest","crint.note":"note","crint.help":"help","crint.ui.fine":"fine","crint.ui.error":"error","crint.ui.warn":"warning","crint.ui.note":"note","crint.ui.allow":"suggestion","crint.ui.notes":"notes","crint.ui.allows":"suggestions","crint.ui.errors":"errors","crint.ui.warns":"warnings","crint.ui.notchecked":"not checked","lint.dead_code.remove":"remove this block","lint.dead_code.unused_if_false":"the if block has an unreachable body","lint.dead_code.unused_if_true":"the if block is unnecessary","lint.dead_code.unused_if-else":"the if-else block is unnecessary","lint.dead_code.remove_if":"reverse the condition and remove the if branch","lint.dead_code.remove_else":"remove the else branch","lint.dead_code.top":"unreachable top-level code","lint.dead_code.no_wait":"the wait block has no effect","lint.dead_code.unused_repeat_true":"this a infinite loop","lint.dead_code.unused_repeat_false":"the repeat block has an unreachable body","lint.dead_code.replace_forever":"replace it with the forever block","lint.dead_code.remove_repeat":"remove the repeat block","lint.dead_code.unused_repeat_1":"the repeat block is unnecessary for it will lopp for just 1 iteration","lint.dead_code.unused_repeat_0":"the repeat block has an unreachable body","lint.magic_number.use":"use of magic number: %0","lint.magic_number.help":"give the number a name (store it in a variable)","ice.non_const_variable_name":'<span class="crint-msg crint-error">internal crint error</span>: variable name invalid',"ext.loaderror":"error loading extension: %0","lint.unused.variable":"unused variable: %0","lint.unused.list":"unused list: %0","lint.unused.remove_variable":"delete the variable","lint.unused.remove_list":"delete the list","i18n.missing":"missing i18n"};var G={"crint.deny":"\u9519\u8BEF","crint.warn":"\u8B66\u544A","crint.allow":"\u5EFA\u8BAE","crint.note":"\u6CE8\u610F","crint.help":"\u5E2E\u52A9","crint.ui.fine":"\u4E00\u5207\u6B63\u5E38","crint.ui.error":"\u4E2A\u9519\u8BEF","crint.ui.warn":"\u4E2A\u8B66\u544A","crint.ui.note":"\u4E2A\u8BB0\u53F7","crint.ui.allow":"\u4E2A\u5EFA\u8BAE","crint.ui.notes":"\u4E2A\u8BB0\u53F7","crint.ui.allows":"\u4E2A\u5EFA\u8BAE","crint.ui.errors":"\u4E2A\u9519\u8BEF","crint.ui.warns":"\u4E2A\u8B66\u544A","crint.ui.notchecked":"\u672A\u68C0\u67E5","lint.dead_code.remove":"\u5220\u9664\u8FD9\u4E2A\u79EF\u6728","lint.dead_code.unused_if_false":"\u6C38\u8FDC\u65E0\u6CD5\u89E6\u53D1\u7684\u5982\u679C\u79EF\u6728","lint.dead_code.unused_if_true":"\u6C38\u8FDC\u89E6\u53D1\u7684\u5982\u679C\u79EF\u6728","lint.dead_code.unused_if-else":"\u4E0D\u5FC5\u8981\u7684\u5982\u679C\u5426\u5219\u79EF\u6728","lint.dead_code.remove_if":"\u53D6\u53CD\u6761\u4EF6\u5E76\u5220\u9664\u5982\u679C\u5206\u652F","lint.dead_code.remove_else":"\u5220\u9664\u6389\u5426\u5219\u5206\u652F","lint.dead_code.top":"\u65E0\u6CD5\u5230\u8FBE\u7684\u9876\u5C42\u79EF\u6728","lint.dead_code.no_wait":"\u6CA1\u6709\u4EFB\u4F55\u6548\u679C\u7684\u7B49\u5F85","lint.dead_code.unused_repeat_true":"\u8FD9\u662F\u4E00\u4E2A\u65E0\u9650\u5FAA\u73AF","lint.dead_code.unused_repeat_false":"\u6C38\u8FDC\u4E0D\u4F1A\u5FAA\u73AF\u7684\u5FAA\u73AF\u79EF\u6728","lint.dead_code.replace_forever":"\u5C06\u5B83\u6362\u6210\u65E0\u9650\u5FAA\u73AF\u79EF\u6728","lint.dead_code.remove_repeat":"\u5220\u9664\u6389\u6B64\u5FAA\u73AF\u79EF\u6728","lint.dead_code.unused_repeat_1":"\u6CA1\u6709\u5FC5\u8981\u7684\u5FAA\u73AF\uFF0C\u5B83\u53EA\u4F1A\u5FAA\u73AF\u4E00\u6B21","lint.dead_code.unused_repeat_0":"\u6C38\u8FDC\u4E0D\u4F1A\u5FAA\u73AF\u7684\u5FAA\u73AF\u79EF\u6728","lint.magic_number.use":"\u4F7F\u7528\u4E86\u9B54\u6CD5\u6570: %0","lint.magic_number.help":"\u5C06\u8FD9\u4E2A\u6570\u5B57\u6539\u4E3A\u5176\u4ED6\u6709\u610F\u4E49\u8868\u793A\u65B9\u5F0F (\u6BD4\u5982\u5C06\u5176\u5B58\u5165\u53D8\u91CF\u4E2D)","ice.non_const_variable_name":'<span class="crint-msg crint-error">\u5185\u90E8\u9519\u8BEF</span>: \u975E\u6CD5\u7684\u53D8\u91CF\u540D',"ext.loaderror":"\u52A0\u8F7D\u62D3\u5C55\u65F6\u53D1\u751F\u9519\u8BEF: %0","lint.unused.variable":"\u672A\u4F7F\u7528\u7684\u53D8\u91CF: %0","lint.unused.list":"\u672A\u4F7F\u7528\u7684\u5217\u8868: %0","lint.unused.remove_variable":"\u5220\u9664\u8FD9\u4E2A\u53D8\u91CF","lint.unused.remove_list":"\u5220\u9664\u8FD9\u4E2A\u5217\u8868","i18n.missing":"\u672C\u5730\u5316\u7F3A\u5931"};var j={"crint.deny":"\u4F60999\u9519\u8BEF","crint.warn":"\u4F60999\u574F","crint.allow":"\u6C42\u7CBE\u5316","crint.note":"\u5514\u5514\u5514","crint.help":"\u4E0A\u4E0B\u505A\u6709\u79FB\u52A8\u6211","crint.ui.fine":"\u54E6\u54E6\u54E6","crint.ui.error":"\u9519\u8BEF","crint.ui.warn":"\u574F","crint.ui.note":"\u4E2A\u5514\u5514\u5514","crint.ui.allow":"\u4E2A\u6C42\u7CBE\u5316","crint.ui.notes":"\u4E2A\u5514\u5514\u5514","crint.ui.allows":"\u4E2A\u6C42\u7CBE\u5316","crint.ui.errors":"\u9519\u8BEF","crint.ui.warns":"\u574F","crint.ui.notchecked":"\u8BA9\u6211\u770B\u770B","lint.dead_code.remove":"\u5514\u5514\u5514\u8BA9\u5B83\u78B0\u5230\u6F14\u8BB2","lint.dead_code.unused_if_false":"\u5514\u5514\u5514\u65E0\u6CD5\u5F00\u59CB\u6E38\u620F","lint.dead_code.unused_if_true":"\u54E6\u54E6\u54E6\u4F60\u4E00\u76F4\u90FD\u5F00\u59CB\u6E38\u620F","lint.dead_code.unused_if-else":"\u5514\u5514\u5514\u4F60999\u4E0D\u9700\u8981\u6761\u4EF6","lint.dead_code.remove_if":"\u54C7\u54C7\u54C7\u6253\u7FFB\u6761\u4EF6\u7136\u540E\u628A\u5982\u679C\u5206\u652F\u6254\u8FDB\u6F14\u8BB2","lint.dead_code.remove_else":"\u54E6\u54E6\u54E6\u628A\u5426\u5219\u5206\u652F\u6254\u8FDB\u6F14\u8BB2","lint.dead_code.top":"\u6211999\u65E0\u6CD5\u5F00\u59CB\u6E38\u620F","lint.dead_code.no_wait":"\u6211999\u6CA1\u6709\u51C0\u5316","lint.dead_code.unused_repeat_true":"\u54C7\u54C7\u54C7\u4F60999\u505C\u4E0D\u4E0B\u6765","lint.dead_code.unused_repeat_false":"\u5514\u5514\u5514\u65E0\u6CD5\u5F00\u59CB\u6E38\u620F","lint.dead_code.replace_forever":"\u6362\u62109999999999\u65E0\u9650\u5FAA\u73AF","lint.dead_code.remove_repeat":"\u628A\u5FAA\u73AF\u6254\u8FDB\u6F14\u8BB2","lint.dead_code.unused_repeat_1":"\u5514\u5514\u5514\u6050\u6016\u5FAA\u73AF\u53EA\u80FD\u83B7\u5F97\u4E00\u6B21\u51C0\u5316","lint.dead_code.unused_repeat_0":"\u5514\u5514\u5514\u65E0\u6CD5\u5F00\u59CB\u6E38\u620F","lint.magic_number.use":"\u4F60\u521A\u521A\u4F7F\u7528\u4E86999\u90AA\u6076fenshu\uFF1A%0","lint.magic_number.help":"\u7ED9\u90AA\u6076fenshu 999\u51C0\u5316 (\u628A\u5B83\u653E\u8FDBtfgs\u53D8\u91CF\u4E2D)","ice.non_const_variable_name":'<span class="crint-msg crint-error">\u54C7\u54C7\u54C7\u6211999\u5931\u8D25</span>: \u90AA\u6076\u7684tfgs\u53D8\u91CF\u540D',"ext.loaderror":"\u90AA\u6076\u62D3\u5C55\u65E0\u6CD5\u83B7\u5F97\u51C0\u5316: %0","lint.unused.variable":"\u6CA1\u6709\u51C0\u5316\u7684tfgs\u53D8\u91CF: %0","lint.unused.list":"\u6CA1\u6709\u51C0\u5316\u7684tfgs\u5217\u8868: %0","lint.unused.remove_variable":"\u5C06tfgs\u53D8\u91CF\u6254\u8FDB\u6F14\u8BB2","lint.unused.remove_list":"\u5C06tfgs\u5217\u8868\u6254\u8FDB\u6F14\u8BB2","i18n.missing":"999\u90AA\u6076i18n"};var i=class t{static i18n={};static current;static fallback_i18n;static register_i18n(e,r){t.i18n[e]?t.i18n[e]=v(r,t.i18n[e]):t.i18n[e]=r}static register_i18ns(e){for(let r in e)t.register_i18n(r,e[r])}static set_fallback(e){t.fallback_i18n=e}static set_current(e){t.current=e}static lookup(e){if(this.current&&this.i18n[this.current]&&this.i18n[this.current][e])return this.i18n[this.current][e];if(this.fallback_i18n&&this.i18n[this.fallback_i18n]&&this.i18n[this.fallback_i18n][e])return this.i18n[this.fallback_i18n][e]}static format_impl(e,r){let n="",o=0;for(;o<e.length;++o)if(e[o]==="%")if(++o,e[o]==="%")n+="%";else if(e[o]>="0"&&e[o]<="9"){let s=parseInt(e[o]);n+=String(r[s])}else--o,n+="%";else n+=e[o];return n}static format(e,...r){let n=t.lookup(e)??t.lookup("i18n.missing");return t.format_impl(n,r)}};i.register_i18ns({en:P,"zh-cn":G,axolotl:j});i.set_fallback("en");var te=/^@((allow)|(deny)|(warn)):(.*)$/mg,re=t=>{switch(t){case"deny":return 2;case"warn":return 1;default:return 0}},L=t=>{let e={},r=t.matchAll(te),n=!1;for(let o of r){n=!0;let s=o.at(1),a=o.at(5);e[a]=re(s)}return n?e:null};var _=class{checker;walked;constructor(e){this.checker=e,this.walked=[]}walk(e,r){if(this.walked.includes(e.id))return;this.walked.push(e.id);let n=!1;if(e.comment){let o=L(e.comment);o!==null&&(this.checker.new_config(o),n=!0)}this.walk_impl(e,r),n&&this.checker.restore_config()}walk_impl(e,r){let n=`walk_${e.opcode}`;this[n]&&this[n](e),this.generic_walker(e)}generic_walker(e){Object.values(e.arguments).forEach(r=>{r.type==="ast"&&this.walk(r,!1)}),e.next&&this.walk(e.next,!1)}end_walk(){}};var S=class extends _{__impl(e){let r=e.arguments.NUM,n=Number(r.text);if(isNaN(n)||e!==null&&e.comment!==""||n in this.checker.config.ignore_magic_number_db)return;let o=i.format("lint.magic_number.use",r.text),s=i.format("lint.magic_number.help"),a=this.checker.report(e,"magic_number",o);this.checker.help(a,s)}walk_math_number(e){this.__impl(e)}walk_math_whole_number(e){this.__impl(e)}};var B=(t,e)=>{let r=t[e],n=r.inputList,o={};for(let l of n){if(l.connection!==null&&l.connection.targetConnection!==null){let u=l.name,k=l.connection.targetConnection.sourceBlock_.id;o[u]=B(t,k)}for(let u of l.fieldRow){let g=u.name;if(g){let k=u.text_,A=u.value_;o[g]={type:"value",text:k,value:A}}}}let s=null;if(r.nextConnection?.targetConnection){let l=r.nextConnection.targetConnection.sourceBlock_;s=B(t,l.id)}let a=r.startHat_,f=r.getCommentText();return{type:"ast",id:e,svg:r,opcode:r.type,comment:f,arguments:o,next:s,is_hat:a,constant:null}},N=t=>{let e=[],r=t.blockDB_,n=t.topBlocks_;for(let o of n)e.push(B(r,o.id));return e};var oe=t=>{let e=t;for(;e.getOutputShape()&&e.getSurroundParent();)e=e.getSurroundParent();return e},m={block:null,timerID:null},H=class{static flash(e){m.timerID>0&&(clearTimeout(m.timerID),m.block.svgPath_&&(m.block.svgPath_.style.fill=""));let r=4,n=!0;m.block=e;function o(){m.block.svgPath_&&(m.block.svgPath_.style.fill=n?"#ffff80":""),n=!n,r--,r>0?m.timerID=setTimeout(o,200):(m.timerID=0,m.block=null)}o()}},V=t=>{if(!t)return;let e=32,r=32,n=unsafeWindow.Blockly.getMainWorkspace(),o=t.getRootBlock(),a=oe(t).getRelativeToSurfaceXY(),f=o.getRelativeToSurfaceXY(),l=n.scale,u=f.x*l,g=a.y*l,k=t.width+u,A=t.height+g,p=n.getMetrics();if(u<p.viewLeft+e-4||k>p.viewLeft+p.viewWidth||g<p.viewTop+r-4||A>p.viewTop+p.viewHeight){let Z=u-p.contentLeft-e,J=g-p.contentTop-r;n.scrollbar.set(Z,J)}H.flash(t)};var T=class extends _{walk_impl(e,r){if(e.is_hat&&e.next!==null||!r)super.walk_impl(e,r);else{let n=this.checker.report(e,"dead_code",i.format("lint.dead_code.top"));this.checker.report_extra(n,4,i.format("lint.dead_code.remove"))}}walk_control_if_else(e){let r=h(e.arguments.CONDITION,!1);if(r===null)return;let n=this.checker.report(e,"dead_code",i.format("lint.dead_code.unused_if-else"));r?this.checker.report_extra(n,4,i.format("lint.dead_code.remove_else")):this.checker.report_extra(n,4,i.format("lint.dead_code.remove_if"))}walk_control_if(e){let r=h(e.arguments.CONDITION,!1);if(r===null)return;let n;r?n=this.checker.report(e,"dead_code",i.format("lint.dead_code.unused_if_true")):n=this.checker.report(e,"dead_code",i.format("lint.dead_code.unused_if_false")),this.checker.report_extra(n,4,i.format("lint.dead_code.remove"))}walk_control_repeat(e){let r=h(e.arguments.TIMES,0);if(r===null)return;let n=Number(r),o;n===1?(o=this.checker.report(e,"dead_code",i.format("lint.dead_code.unused_repeat_1")),this.checker.report_extra(o,4,i.format("lint.dead_code.remove_repeat"))):n<=0&&(o=this.checker.report(e,"dead_code",i.format("lint.dead_code.unused_repeat_0")),this.checker.report_extra(o,4,i.format("lint.dead_code.remove")))}__repeat_cond_impl(e,r){let n;e?(n=this.checker.report(r,"dead_code",i.format("lint.dead_code.unused_repeat_true")),this.checker.report_extra(n,4,i.format("lint.dead_code.replace_forever"))):(n=this.checker.report(r,"dead_code",i.format("lint.dead_code.unused_repeat_false")),this.checker.report_extra(n,4,i.format("lint.dead_code.remove")))}walk_control_repeat_until(e){let r=h(e.arguments.CONDITION,!1);r!==null&&this.__repeat_cond_impl(!r,e)}walk_control_while(e){let r=h(e.arguments.CONDITION,!1);r!==null&&this.__repeat_cond_impl(!!r,e)}walk_control_wait_until(e){let r=h(e.arguments.CONDITION,!1);if(r===null)return;let n;r||(n=this.checker.report(e,"dead_code",i.format("lint.dead_code.no_wait")),this.checker.report_extra(n,4,i.format("lint.dead_code.remove")))}};var W=class extends _{opcodes={};walk_impl(e,r){e.opcode in this.opcodes||(this.opcodes[e.opcode]=Object.keys(e.arguments))}},X=t=>{let e=new W(new d(y));return t.forEach(r=>e.walk(r,!0)),Object.entries(e.opcodes)};var E=class _ExtManager{static load_error(t){alert(i.format("ext.loaderror",t))}static register_from_text(text){throw new Error("not implemented yet");try{eval(text)}catch(t){this.load_error(t)}}static register_from_url(t){throw new Error("not implemented yet")}};d.linters.push(S);d.linters.push(T);var I=t=>{c.info_el.style.top=`${15+t.clientY}px`,c.info_el.style.left=`${15+t.clientX}px`},ie=t=>{switch(t){case 0:return[i.format("crint.allow"),"crint-text crint-msg"];case 1:return[i.format("crint.warn"),"crint-text crint-msg crint-warn"];case 2:return[i.format("crint.deny"),"crint-text crint-msg crint-error"];case 3:return[i.format("crint.note"),"crint-text crint-msg"];case 4:return[i.format("crint.help"),"crint-text crint-msg crint-fine"]}},c=class t{static ScratchBlocks;static warnings_db=[];static highlight_db=[];static info_el;static result_info_el;static result_list_el;static result_info_content_el;static get_top_config(){let e=y,r=this.ScratchBlocks().getMainWorkspace().topComments_;for(let n of r){if(n.blockId||!n.content_)continue;let o=L(n.content_);o!==null&&(e=v(o,e))}return e}static check_ws(e){let r=this.get_top_config(),n=new d(r);return N(e).forEach(s=>n.check(s)),n}static check(){let e=this.get_top_config(),r=new d(e),n=t.ScratchBlocks().Workspace.WorkspaceDB_;return Object.values(n).forEach(o=>{if(o.isFlyout)return;N(o).forEach(a=>r.check(a))}),r}static get_all_proc(e){return X(e.ast)}static render_report_html(e){let[r,n]=ie(e.type),o=`<span class="${n}">${r}</span>: <span>${e.message}</span>`,s=e.extra.length>0?`<div class="crint-nest-block">${e.extra.map(t.render_report_html).join("")}</div>`:"";return`<div class="crint-item"><div>${o}</div>${s}</div>`}static render_report(e){if(e.type<M.show_level)return;let r=t.render_report_html(e),n=document.createElement("li");if(n.classList.add("crint-list-item"),n.innerHTML=r,e.ast&&(n.onclick=a=>{V(e.ast.svg),a.preventDefault(),a.stopImmediatePropagation(),a.stopPropagation()},n.onmouseenter=a=>{t.info_el.classList.remove("crint-hidden"),t.info_el.style.top=`${15+a.clientY}px`,t.info_el.style.left=`${15+a.clientX}px`,n.onmousemove=I;let f=e.ast.svg;t.info_el.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="${f.width}px" height="${f.height}px" style="scale: 0.8;overflow:visible;">${f.svgGroup_.innerHTML}</svg>`},n.onmouseleave=()=>{n.onmousemove=null,t.info_el.classList.add("crint-hidden")}),t.result_list_el.appendChild(n),e.ast===null)return;e.ast.svg.highlightForReplacement(e.ast.id);let o=a=>{t.info_el.classList.remove("crint-hidden"),t.info_el.style.top=`${15+a.clientY}px`,t.info_el.style.left=`${15+a.clientX}px`,t.info_el.innerHTML=r,e.ast.svg.svgGroup_.addEventListener("mousemove",I)},s=a=>{t.info_el.classList.add("crint-hidden"),e.ast.svg.svgGroup_.removeEventListener("mousemove",I)};e.ast.svg.svgGroup_.addEventListener("mouseenter",o),e.ast.svg.svgGroup_.addEventListener("mouseleave",s),t.highlight_db.push([e.ast.svg,o,s])}static render_result(e){t.warnings_db.forEach(r=>{try{r.setWarningText(null)}catch{}}),t.highlight_db.forEach(r=>{try{r[0].highlightForReplacement(null)}catch{}try{r[0].svgGroup_.removeEventListener("mouseenter",r[1]),r[0].svgGroup_.removeEventListener("mouseleave",r[2])}catch{}}),this.result_list_el&&(this.result_list_el.innerHTML="");for(let r of e.reports)t.render_report(r)}},Y={config:M,Checker:d,ASTWalker:_,Crint:c,LanguageManager:i,ExtManager:E};var se="menu-bar_main-menu_3wjWH",ae='<svg style="color: var(--menu-bar-foreground);width: 1rem; height: 100%; vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5997"><path d="M197.376 378.794667a338.645333 338.645333 0 0 1 72.96-108.416 337.92 337.92 0 0 1 108.458667-72.96 346.453333 346.453333 0 0 1 261.546666-1.749334A106.24 106.24 0 0 0 746.666667 298.666667C805.802667 298.666667 853.333333 251.136 853.333333 192S805.802667 85.333333 746.666667 85.333333c-29.397333 0-55.978667 11.776-75.221334 30.933334-103.722667-41.514667-222.848-40.874667-325.76 2.517333-50.773333 21.333333-96.426667 52.053333-135.68 91.264A425.813333 425.813333 0 0 0 85.333333 512h85.333334c0-46.336 9.002667-91.136 26.709333-133.205333z m629.205333 266.410666c-17.109333 40.618667-41.685333 77.141333-72.96 108.416s-67.797333 55.850667-108.458666 72.96a346.453333 346.453333 0 0 1-261.546667 1.749334A106.154667 106.154667 0 0 0 277.333333 725.333333C218.197333 725.333333 170.666667 772.864 170.666667 832S218.197333 938.666667 277.333333 938.666667c29.397333 0 55.978667-11.776 75.221334-30.933334A425.514667 425.514667 0 0 0 512 938.666667a425.941333 425.941333 0 0 0 393.258667-260.352A426.325333 426.325333 0 0 0 938.666667 512h-85.333334a341.034667 341.034667 0 0 1-26.752 133.205333zM512 318.378667c-106.752 0-193.621333 86.869333-193.621333 193.621333S405.248 705.621333 512 705.621333c106.752 0 193.621333-86.869333 193.621333-193.621333S618.752 318.378667 512 318.378667z" p-id="5998"></path></svg>',b=(t,e)=>t===1?`${t} ${i.format(e)}`:`${t} ${i.format(e+"s")}`,D=null,ce=()=>{D?.classList.add("crint-loading")},le=()=>{D?.classList.remove("crint-loading")};var de=()=>{c.result_info_el?.classList.toggle("crint-hidden")},$=()=>{let t=document.getElementsByClassName(se)[0],e=document.createElement("div");e.classList.add("crint-btn","crint-relative"),e.innerHTML=`<div class="crint-icon" style="display: inline-block;">${ae}</div> <span>crint: <span class="crint-msg crint-head-text">${i.format("crint.ui.notchecked")}</span></span>`,_e(e);let r=e.getElementsByClassName("crint-msg")[0];D=e.getElementsByClassName("crint-icon")[0];let n=()=>{ce();let o=c.check();c.render_result(o);let s={warn:0,error:0,note:0,allow:0};o.reports.forEach(a=>{a.type===1?s.warn++:a.type===2?s.error++:a.type===0?s.allow++:a.type===3&&s.note++}),c.result_info_content_el.innerHTML=`<span class="crint-msg crint-error">${b(s.error,"crint.ui.error")}</span>, <span class="crint-msg crint-warn">${b(s.warn,"crint.ui.warn")}</span>, <span class="crint-msg crint-note">${b(s.note,"crint.ui.note")}</span>, <span class="crint-msg">${b(s.allow,"crint.ui.allow")}</span>`,s.warn===0&&s.error===0?(r.innerText="fine",r.classList.remove("crint-error","crint-warn"),r.classList.add("crint-fine")):s.error===0?(r.innerText=b(s.warn,"crint.ui.warn"),r.classList.remove("crint-error","crint-fine"),r.classList.add("crint-warn")):(r.innerText=b(s.error,"crint.ui.error"),r.classList.remove("crint-warn","crint-fine"),r.classList.add("crint-error")),le()};e.onclick=()=>{n(),de()},setInterval(n,60*1e3),t.appendChild(e)},F=()=>{let t=document.createElement("div");t.innerHTML="<style>.crint-loading {animation: 1s ease-in-out 1s infinite running rotate;}@keyframes rotate { from {rotate: 0;} to {rotate: 360deg;}}.crint-info-el { box-shadow: 0 0 14px -7px var(--ui-black-transparent); border-radius: 0.25rem; font-family: monospace; border: 1px solid var(--ui-black-transparent); background-color: hsl(from var(--ui-white) h s l / 90%); backdrop-filter: blur(10px); padding: 0.5rem; position: fixed; z-index: 100114514; color: var(--paint-text-primary); font-weight: normal;}.crint-hidden {display: none;}.crint-btn {color:var(--menu-bar-foreground);}.crint-btn:hover {cursor: pointer;}.crint-msg {font-weight: bold;}.crint-text {font-family: monospace;}.crint-fine {color: rgb(89, 192, 89);}.crint-error {color: #ff4c4c;}.crint-warn {color: rgb(255, 211, 0);}.crint-nest-block {/*margin: 0.1rem 0 0 0.5rem;*/}.crint-item {}.crint-hr { margin: 0.2rem 0; height: 1px; background-color: var(--ui-black-transparent);}.crint-list-item {margin: 0.2rem 0;}.crint-list { list-style: none; padding-left: 0; margin: 0.4rem 0 -0.2rem 0;}.crint-head-text.crint-error {filter: brightness(2.5);}.crint-head-text.crint-warn {filter: brightness(10);}.crint-head-text.crint-fine {filter: brightness(1.5);}.crint-relative {position: relative;}.crint-result-info-el { position: absolute; top: 3rem; right: 0; width: max-content; max-width: 40rem; max-height: 80vh; overflow: auto; box-shadow: 0 0 14px -7px var(--ui-black-transparent); border-radius: 0.25rem; font-family: monospace; border: 1px solid var(--ui-black-transparent); background-color: hsl(from var(--ui-white) h s l / 90%); backdrop-filter: blur(10px); padding: 0.5rem; z-index: 100114514; color: var(--paint-text-primary); font-weight: normal; font-size: 0.815rem;}</style>",document.documentElement.appendChild(t)},q=()=>{let t=document.createElement("div");t.classList.add("crint-info-el","crint-hidden"),c.info_el=t,document.documentElement.appendChild(t)},_e=t=>{let e=document.createElement("div");e.classList.add("crint-result-info-el"),e.classList.add("crint-hidden"),e.innerHTML='<div class="crint-result-info"></div><div class="crint-hr"></div>',c.result_info_content_el=e.getElementsByClassName("crint-result-info")[0];let r=document.createElement("ul");r.classList.add("crint-list"),c.result_info_el=e,c.result_list_el=r,e.appendChild(r),t.appendChild(e)};var U=()=>{setTimeout(()=>{c.ScratchBlocks=C,F(),q(),$(),setInterval(()=>{let t=C().ScratchMsgs.currentLocale_;i.current!==t&&(i.current&&setTimeout($,1e3),i.set_current(t))},1e3),unsafeWindow.crint=Y},1e3)};U();
})()

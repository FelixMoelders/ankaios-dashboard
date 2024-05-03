import{a as h,c as ce,h as k,b as G,q as _e,r as O,o as re,w as P,i as Ae,k as ue,af as Ve,g as J,a5 as Be,J as Ce,al as Ee,S as $e,s as W,M as Oe,a6 as Te,E as ee,aa as ve,am as Ie,R as Pe,an as ze,O as De,$ as ge}from"./index.98ae7f60.js";let Y=[],te=[];function Me(e){te=te.filter(t=>t!==e)}function ct(e){Me(e),te.push(e)}function vt(e){Me(e),te.length===0&&Y.length!==0&&(Y[Y.length-1](),Y=[])}function Se(e){te.length===0?e():Y.push(e)}function je(e){Y=Y.filter(t=>t!==e)}const qe={dark:{type:Boolean,default:null}};function Re(e,t){return h(()=>e.dark===null?t.dark.isActive:e.dark)}var gt=ce({name:"QCardSection",props:{tag:{type:String,default:"div"},horizontal:Boolean},setup(e,{slots:t}){const u=h(()=>`q-card__section q-card__section--${e.horizontal===!0?"horiz row no-wrap":"vert"}`);return()=>k(e.tag,{class:u.value},G(t.default))}});let ie,ne=0;const $=new Array(256);for(let e=0;e<256;e++)$[e]=(e+256).toString(16).substring(1);const Le=(()=>{const e=typeof crypto!="undefined"?crypto:typeof window!="undefined"?window.crypto||window.msCrypto:void 0;if(e!==void 0){if(e.randomBytes!==void 0)return e.randomBytes;if(e.getRandomValues!==void 0)return t=>{const u=new Uint8Array(t);return e.getRandomValues(u),u}}return t=>{const u=[];for(let i=t;i>0;i--)u.push(Math.floor(Math.random()*256));return u}})(),me=4096;function de(){(ie===void 0||ne+16>me)&&(ne=0,ie=Le(me));const e=Array.prototype.slice.call(ie,ne,ne+=16);return e[6]=e[6]&15|64,e[8]=e[8]&63|128,$[e[0]]+$[e[1]]+$[e[2]]+$[e[3]]+"-"+$[e[4]]+$[e[5]]+"-"+$[e[6]]+$[e[7]]+"-"+$[e[8]]+$[e[9]]+"-"+$[e[10]]+$[e[11]]+$[e[12]]+$[e[13]]+$[e[14]]+$[e[15]]}function Ne(e){return e==null?null:e}function he(e,t){return e==null?t===!0?`f_${de()}`:null:e}function Ze({getValue:e,required:t=!0}={}){if(_e.value===!0){const u=e!==void 0?O(Ne(e())):O(null);return t===!0&&u.value===null&&re(()=>{u.value=`f_${de()}`}),e!==void 0&&P(e,i=>{u.value=he(i,t)}),u}return e!==void 0?h(()=>he(e(),t)):O(`f_${de()}`)}function Ke({validate:e,resetValidation:t,requiresQForm:u}){const i=Ae(Ve,!1);if(i!==!1){const{props:d,proxy:f}=J();Object.assign(f,{validate:e,resetValidation:t}),P(()=>d.disable,b=>{b===!0?(typeof t=="function"&&t(),i.unbindComponent(f)):i.bindComponent(f)}),re(()=>{d.disable!==!0&&i.bindComponent(f)}),ue(()=>{d.disable!==!0&&i.unbindComponent(f)})}else u===!0&&console.error("Parent QForm not found on useFormChild()!")}const be=/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/,pe=/^#[0-9a-fA-F]{4}([0-9a-fA-F]{4})?$/,ye=/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,le=/^rgb\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5])\)$/,ae=/^rgba\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),(0|0\.[0-9]+[1-9]|0\.[1-9]+|1)\)$/,se={date:e=>/^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(e),time:e=>/^([0-1]?\d|2[0-3]):[0-5]\d$/.test(e),fulltime:e=>/^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(e),timeOrFulltime:e=>/^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(e),email:e=>/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e),hexColor:e=>be.test(e),hexaColor:e=>pe.test(e),hexOrHexaColor:e=>ye.test(e),rgbColor:e=>le.test(e),rgbaColor:e=>ae.test(e),rgbOrRgbaColor:e=>le.test(e)||ae.test(e),hexOrRgbColor:e=>be.test(e)||le.test(e),hexaOrRgbaColor:e=>pe.test(e)||ae.test(e),anyColor:e=>ye.test(e)||le.test(e)||ae.test(e)},Ue=[!0,!1,"ondemand"],He={modelValue:{},error:{type:Boolean,default:null},errorMessage:String,noErrorIcon:Boolean,rules:Array,reactiveRules:Boolean,lazyRules:{type:[Boolean,String],default:!1,validator:e=>Ue.includes(e)}};function Qe(e,t){const{props:u,proxy:i}=J(),d=O(!1),f=O(null),b=O(!1);Ke({validate:D,resetValidation:z});let x=0,V;const q=h(()=>u.rules!==void 0&&u.rules!==null&&u.rules.length!==0),w=h(()=>u.disable!==!0&&q.value===!0&&t.value===!1),p=h(()=>u.error===!0||d.value===!0),H=h(()=>typeof u.errorMessage=="string"&&u.errorMessage.length!==0?u.errorMessage:f.value);P(()=>u.modelValue,()=>{b.value=!0,w.value===!0&&u.lazyRules===!1&&T()});function E(){u.lazyRules!=="ondemand"&&w.value===!0&&b.value===!0&&T()}P(()=>u.reactiveRules,L=>{L===!0?V===void 0&&(V=P(()=>u.rules,E,{immediate:!0,deep:!0})):V!==void 0&&(V(),V=void 0)},{immediate:!0}),P(()=>u.lazyRules,E),P(e,L=>{L===!0?b.value=!0:w.value===!0&&u.lazyRules!=="ondemand"&&T()});function z(){x++,t.value=!1,b.value=!1,d.value=!1,f.value=null,T.cancel()}function D(L=u.modelValue){if(u.disable===!0||q.value===!1)return!0;const F=++x,Q=t.value!==!0?()=>{b.value=!0}:()=>{},N=(S,C)=>{S===!0&&Q(),d.value=S,f.value=C||null,t.value=!1},j=[];for(let S=0;S<u.rules.length;S++){const C=u.rules[S];let B;if(typeof C=="function"?B=C(L,se):typeof C=="string"&&se[C]!==void 0&&(B=se[C](L)),B===!1||typeof B=="string")return N(!0,B),!1;B!==!0&&B!==void 0&&j.push(B)}return j.length===0?(N(!1),!0):(t.value=!0,Promise.all(j).then(S=>{if(S===void 0||Array.isArray(S)===!1||S.length===0)return F===x&&N(!1),!0;const C=S.find(B=>B===!1||typeof B=="string");return F===x&&N(C!==void 0,C),C===void 0},S=>(F===x&&(console.error(S),N(!0)),!1)))}const T=Be(D,0);return ue(()=>{V!==void 0&&V(),T.cancel()}),Object.assign(i,{resetValidation:z,validate:D}),Ce(i,"hasError",()=>p.value),{isDirtyModel:b,hasRules:q,hasError:p,errorMessage:H,validate:D,resetValidation:z}}const ke=/^on[A-Z]/;function We(){const{attrs:e,vnode:t}=J(),u={listeners:O({}),attributes:O({})};function i(){const d={},f={};for(const b in e)b!=="class"&&b!=="style"&&ke.test(b)===!1&&(d[b]=e[b]);for(const b in t.props)ke.test(b)===!0&&(f[b]=t.props[b]);u.attributes.value=d,u.listeners.value=f}return Ee(i),i(),u}function fe(e){return e!=null&&(""+e).length!==0}const Ye={...qe,...He,label:String,stackLabel:Boolean,hint:String,hideHint:Boolean,prefix:String,suffix:String,labelColor:String,color:String,bgColor:String,filled:Boolean,outlined:Boolean,borderless:Boolean,standout:[Boolean,String],square:Boolean,loading:Boolean,labelSlot:Boolean,bottomSlots:Boolean,hideBottomSpace:Boolean,rounded:Boolean,dense:Boolean,itemAligned:Boolean,counter:Boolean,clearable:Boolean,clearIcon:String,disable:Boolean,readonly:Boolean,autofocus:Boolean,for:String,maxlength:[Number,String]},Je=["update:modelValue","clear","focus","blur","popupShow","popupHide"];function Xe({requiredForAttr:e=!0,tagProp:t}={}){const{props:u,proxy:i}=J(),d=Re(u,i.$q),f=Ze({required:e,getValue:()=>u.for});return{requiredForAttr:e,tag:t===!0?h(()=>u.tag):{value:"label"},isDark:d,editable:h(()=>u.disable!==!0&&u.readonly!==!0),innerLoading:O(!1),focused:O(!1),hasPopupOpen:!1,splitAttrs:We(),targetUid:f,rootRef:O(null),targetRef:O(null),controlRef:O(null)}}function Ge(e){const{props:t,emit:u,slots:i,attrs:d,proxy:f}=J(),{$q:b}=f;let x=null;e.hasValue===void 0&&(e.hasValue=h(()=>fe(t.modelValue))),e.emitValue===void 0&&(e.emitValue=l=>{u("update:modelValue",l)}),e.controlEvents===void 0&&(e.controlEvents={onFocusin:o,onFocusout:a}),Object.assign(e,{clearValue:s,onControlFocusin:o,onControlFocusout:a,focus:C}),e.computedCounter===void 0&&(e.computedCounter=h(()=>{if(t.counter!==!1){const l=typeof t.modelValue=="string"||typeof t.modelValue=="number"?(""+t.modelValue).length:Array.isArray(t.modelValue)===!0?t.modelValue.length:0,v=t.maxlength!==void 0?t.maxlength:t.maxValues;return l+(v!==void 0?" / "+v:"")}}));const{isDirtyModel:V,hasRules:q,hasError:w,errorMessage:p,resetValidation:H}=Qe(e.focused,e.innerLoading),E=e.floatingLabel!==void 0?h(()=>t.stackLabel===!0||e.focused.value===!0||e.floatingLabel.value===!0):h(()=>t.stackLabel===!0||e.focused.value===!0||e.hasValue.value===!0),z=h(()=>t.bottomSlots===!0||t.hint!==void 0||q.value===!0||t.counter===!0||t.error!==null),D=h(()=>t.filled===!0?"filled":t.outlined===!0?"outlined":t.borderless===!0?"borderless":t.standout?"standout":"standard"),T=h(()=>`q-field row no-wrap items-start q-field--${D.value}`+(e.fieldClass!==void 0?` ${e.fieldClass.value}`:"")+(t.rounded===!0?" q-field--rounded":"")+(t.square===!0?" q-field--square":"")+(E.value===!0?" q-field--float":"")+(F.value===!0?" q-field--labeled":"")+(t.dense===!0?" q-field--dense":"")+(t.itemAligned===!0?" q-field--item-aligned q-item-type":"")+(e.isDark.value===!0?" q-field--dark":"")+(e.getControl===void 0?" q-field--auto-height":"")+(e.focused.value===!0?" q-field--focused":"")+(w.value===!0?" q-field--error":"")+(w.value===!0||e.focused.value===!0?" q-field--highlighted":"")+(t.hideBottomSpace!==!0&&z.value===!0?" q-field--with-bottom":"")+(t.disable===!0?" q-field--disabled":t.readonly===!0?" q-field--readonly":"")),L=h(()=>"q-field__control relative-position row no-wrap"+(t.bgColor!==void 0?` bg-${t.bgColor}`:"")+(w.value===!0?" text-negative":typeof t.standout=="string"&&t.standout.length!==0&&e.focused.value===!0?` ${t.standout}`:t.color!==void 0?` text-${t.color}`:"")),F=h(()=>t.labelSlot===!0||t.label!==void 0),Q=h(()=>"q-field__label no-pointer-events absolute ellipsis"+(t.labelColor!==void 0&&w.value!==!0?` text-${t.labelColor}`:"")),N=h(()=>({id:e.targetUid.value,editable:e.editable.value,focused:e.focused.value,floatingLabel:E.value,modelValue:t.modelValue,emitValue:e.emitValue})),j=h(()=>{const l={};return e.targetUid.value&&(l.for=e.targetUid.value),t.disable===!0&&(l["aria-disabled"]="true"),l});function S(){const l=document.activeElement;let v=e.targetRef!==void 0&&e.targetRef.value;v&&(l===null||l.id!==e.targetUid.value)&&(v.hasAttribute("tabindex")===!0||(v=v.querySelector("[tabindex]")),v&&v!==l&&v.focus({preventScroll:!0}))}function C(){Se(S)}function B(){je(S);const l=document.activeElement;l!==null&&e.rootRef.value.contains(l)&&l.blur()}function o(l){x!==null&&(clearTimeout(x),x=null),e.editable.value===!0&&e.focused.value===!1&&(e.focused.value=!0,u("focus",l))}function a(l,v){x!==null&&clearTimeout(x),x=setTimeout(()=>{x=null,!(document.hasFocus()===!0&&(e.hasPopupOpen===!0||e.controlRef===void 0||e.controlRef.value===null||e.controlRef.value.contains(document.activeElement)!==!1))&&(e.focused.value===!0&&(e.focused.value=!1,u("blur",l)),v!==void 0&&v())})}function s(l){$e(l),b.platform.is.mobile!==!0?(e.targetRef!==void 0&&e.targetRef.value||e.rootRef.value).focus():e.rootRef.value.contains(document.activeElement)===!0&&document.activeElement.blur(),t.type==="file"&&(e.inputRef.value.value=null),u("update:modelValue",null),u("clear",t.modelValue),W(()=>{const v=V.value;H(),V.value=v})}function r(){const l=[];return i.prepend!==void 0&&l.push(k("div",{class:"q-field__prepend q-field__marginal row no-wrap items-center",key:"prepend",onClick:ee},i.prepend())),l.push(k("div",{class:"q-field__control-container col relative-position row no-wrap q-anchor--skip"},g())),w.value===!0&&t.noErrorIcon===!1&&l.push(M("error",[k(ve,{name:b.iconSet.field.error,color:"negative"})])),t.loading===!0||e.innerLoading.value===!0?l.push(M("inner-loading-append",i.loading!==void 0?i.loading():[k(Ie,{color:t.color})])):t.clearable===!0&&e.hasValue.value===!0&&e.editable.value===!0&&l.push(M("inner-clearable-append",[k(ve,{class:"q-field__focusable-action",tag:"button",name:t.clearIcon||b.iconSet.field.clear,tabindex:0,type:"button","aria-hidden":null,role:null,onClick:s})])),i.append!==void 0&&l.push(k("div",{class:"q-field__append q-field__marginal row no-wrap items-center",key:"append",onClick:ee},i.append())),e.getInnerAppend!==void 0&&l.push(M("inner-append",e.getInnerAppend())),e.getControlChild!==void 0&&l.push(e.getControlChild()),l}function g(){const l=[];return t.prefix!==void 0&&t.prefix!==null&&l.push(k("div",{class:"q-field__prefix no-pointer-events row items-center"},t.prefix)),e.getShadowControl!==void 0&&e.hasShadow.value===!0&&l.push(e.getShadowControl()),e.getControl!==void 0?l.push(e.getControl()):i.rawControl!==void 0?l.push(i.rawControl()):i.control!==void 0&&l.push(k("div",{ref:e.targetRef,class:"q-field__native row",tabindex:-1,...e.splitAttrs.attributes.value,"data-autofocus":t.autofocus===!0||void 0},i.control(N.value))),F.value===!0&&l.push(k("div",{class:Q.value},G(i.label,t.label))),t.suffix!==void 0&&t.suffix!==null&&l.push(k("div",{class:"q-field__suffix no-pointer-events row items-center"},t.suffix)),l.concat(G(i.default))}function c(){let l,v;w.value===!0?p.value!==null?(l=[k("div",{role:"alert"},p.value)],v=`q--slot-error-${p.value}`):(l=G(i.error),v="q--slot-error"):(t.hideHint!==!0||e.focused.value===!0)&&(t.hint!==void 0?(l=[k("div",t.hint)],v=`q--slot-hint-${t.hint}`):(l=G(i.hint),v="q--slot-hint"));const Z=t.counter===!0||i.counter!==void 0;if(t.hideBottomSpace===!0&&Z===!1&&l===void 0)return;const y=k("div",{key:v,class:"q-field__messages col"},l);return k("div",{class:"q-field__bottom row items-start q-field__bottom--"+(t.hideBottomSpace!==!0?"animated":"stale"),onClick:ee},[t.hideBottomSpace===!0?y:k(Pe,{name:"q-transition--field-message"},()=>y),Z===!0?k("div",{class:"q-field__counter"},i.counter!==void 0?i.counter():e.computedCounter.value):null])}function M(l,v){return v===null?null:k("div",{key:l,class:"q-field__append q-field__marginal row no-wrap items-center q-anchor--skip"},v)}let m=!1;return Oe(()=>{m=!0}),Te(()=>{m===!0&&t.autofocus===!0&&f.focus()}),t.autofocus===!0&&re(()=>{f.focus()}),ue(()=>{x!==null&&clearTimeout(x)}),Object.assign(f,{focus:C,blur:B}),function(){const v=e.getControl===void 0&&i.control===void 0?{...e.splitAttrs.attributes.value,"data-autofocus":t.autofocus===!0||void 0,...j.value}:j.value;return k(e.tag.value,{ref:e.rootRef,class:[T.value,d.class],style:d.style,...v},[i.before!==void 0?k("div",{class:"q-field__before q-field__marginal row no-wrap items-center",onClick:ee},i.before()):null,k("div",{class:"q-field__inner relative-position col self-stretch"},[k("div",{ref:e.controlRef,class:L.value,tabindex:-1,...e.controlEvents},r()),z.value===!0?c():null]),i.after!==void 0?k("div",{class:"q-field__after q-field__marginal row no-wrap items-center",onClick:ee},i.after()):null])}}const xe={date:"####/##/##",datetime:"####/##/## ##:##",time:"##:##",fulltime:"##:##:##",phone:"(###) ### - ####",card:"#### #### #### ####"},oe={"#":{pattern:"[\\d]",negate:"[^\\d]"},S:{pattern:"[a-zA-Z]",negate:"[^a-zA-Z]"},N:{pattern:"[0-9a-zA-Z]",negate:"[^0-9a-zA-Z]"},A:{pattern:"[a-zA-Z]",negate:"[^a-zA-Z]",transform:e=>e.toLocaleUpperCase()},a:{pattern:"[a-zA-Z]",negate:"[^a-zA-Z]",transform:e=>e.toLocaleLowerCase()},X:{pattern:"[0-9a-zA-Z]",negate:"[^0-9a-zA-Z]",transform:e=>e.toLocaleUpperCase()},x:{pattern:"[0-9a-zA-Z]",negate:"[^0-9a-zA-Z]",transform:e=>e.toLocaleLowerCase()}},Fe=Object.keys(oe);Fe.forEach(e=>{oe[e].regex=new RegExp(oe[e].pattern)});const et=new RegExp("\\\\([^.*+?^${}()|([\\]])|([.*+?^${}()|[\\]])|(["+Fe.join("")+"])|(.)","g"),we=/[.*+?^${}()|[\]\\]/g,_=String.fromCharCode(1),tt={mask:String,reverseFillMask:Boolean,fillMask:[Boolean,String],unmaskedValue:Boolean};function nt(e,t,u,i){let d,f,b,x,V,q;const w=O(null),p=O(E());function H(){return e.autogrow===!0||["textarea","text","search","url","tel","password"].includes(e.type)}P(()=>e.type+e.autogrow,D),P(()=>e.mask,o=>{if(o!==void 0)T(p.value,!0);else{const a=C(p.value);D(),e.modelValue!==a&&t("update:modelValue",a)}}),P(()=>e.fillMask+e.reverseFillMask,()=>{w.value===!0&&T(p.value,!0)}),P(()=>e.unmaskedValue,()=>{w.value===!0&&T(p.value)});function E(){if(D(),w.value===!0){const o=j(C(e.modelValue));return e.fillMask!==!1?B(o):o}return e.modelValue}function z(o){if(o<d.length)return d.slice(-o);let a="",s=d;const r=s.indexOf(_);if(r!==-1){for(let g=o-s.length;g>0;g--)a+=_;s=s.slice(0,r)+a+s.slice(r)}return s}function D(){if(w.value=e.mask!==void 0&&e.mask.length!==0&&H(),w.value===!1){x=void 0,d="",f="";return}const o=xe[e.mask]===void 0?e.mask:xe[e.mask],a=typeof e.fillMask=="string"&&e.fillMask.length!==0?e.fillMask.slice(0,1):"_",s=a.replace(we,"\\$&"),r=[],g=[],c=[];let M=e.reverseFillMask===!0,m="",l="";o.replace(et,(A,n,R,U,K)=>{if(U!==void 0){const I=oe[U];c.push(I),l=I.negate,M===!0&&(g.push("(?:"+l+"+)?("+I.pattern+"+)?(?:"+l+"+)?("+I.pattern+"+)?"),M=!1),g.push("(?:"+l+"+)?("+I.pattern+")?")}else if(R!==void 0)m="\\"+(R==="\\"?"":R),c.push(R),r.push("([^"+m+"]+)?"+m+"?");else{const I=n!==void 0?n:K;m=I==="\\"?"\\\\\\\\":I.replace(we,"\\\\$&"),c.push(I),r.push("([^"+m+"]+)?"+m+"?")}});const v=new RegExp("^"+r.join("")+"("+(m===""?".":"[^"+m+"]")+"+)?"+(m===""?"":"["+m+"]*")+"$"),Z=g.length-1,y=g.map((A,n)=>n===0&&e.reverseFillMask===!0?new RegExp("^"+s+"*"+A):n===Z?new RegExp("^"+A+"("+(l===""?".":l)+"+)?"+(e.reverseFillMask===!0?"$":s+"*")):new RegExp("^"+A));b=c,x=A=>{const n=v.exec(e.reverseFillMask===!0?A:A.slice(0,c.length+1));n!==null&&(A=n.slice(1).join(""));const R=[],U=y.length;for(let K=0,I=A;K<U;K++){const X=y[K].exec(I);if(X===null)break;I=I.slice(X.shift().length),R.push(...X)}return R.length!==0?R.join(""):A},d=c.map(A=>typeof A=="string"?A:_).join(""),f=d.split(_).join(a)}function T(o,a,s){const r=i.value,g=r.selectionEnd,c=r.value.length-g,M=C(o);a===!0&&D();const m=j(M),l=e.fillMask!==!1?B(m):m,v=p.value!==l;r.value!==l&&(r.value=l),v===!0&&(p.value=l),document.activeElement===r&&W(()=>{if(l===f){const y=e.reverseFillMask===!0?f.length:0;r.setSelectionRange(y,y,"forward");return}if(s==="insertFromPaste"&&e.reverseFillMask!==!0){const y=r.selectionEnd;let A=g-1;for(let n=V;n<=A&&n<y;n++)d[n]!==_&&A++;F.right(r,A);return}if(["deleteContentBackward","deleteContentForward"].indexOf(s)!==-1){const y=e.reverseFillMask===!0?g===0?l.length>m.length?1:0:Math.max(0,l.length-(l===f?0:Math.min(m.length,c)+1))+1:g;r.setSelectionRange(y,y,"forward");return}if(e.reverseFillMask===!0)if(v===!0){const y=Math.max(0,l.length-(l===f?0:Math.min(m.length,c+1)));y===1&&g===1?r.setSelectionRange(y,y,"forward"):F.rightReverse(r,y)}else{const y=l.length-c;r.setSelectionRange(y,y,"backward")}else if(v===!0){const y=Math.max(0,d.indexOf(_),Math.min(m.length,g)-1);F.right(r,y)}else{const y=g-1;F.right(r,y)}});const Z=e.unmaskedValue===!0?C(l):l;String(e.modelValue)!==Z&&(e.modelValue!==null||Z!=="")&&u(Z,!0)}function L(o,a,s){const r=j(C(o.value));a=Math.max(0,d.indexOf(_),Math.min(r.length,a)),V=a,o.setSelectionRange(a,s,"forward")}const F={left(o,a){const s=d.slice(a-1).indexOf(_)===-1;let r=Math.max(0,a-1);for(;r>=0;r--)if(d[r]===_){a=r,s===!0&&a++;break}if(r<0&&d[a]!==void 0&&d[a]!==_)return F.right(o,0);a>=0&&o.setSelectionRange(a,a,"backward")},right(o,a){const s=o.value.length;let r=Math.min(s,a+1);for(;r<=s;r++)if(d[r]===_){a=r;break}else d[r-1]===_&&(a=r);if(r>s&&d[a-1]!==void 0&&d[a-1]!==_)return F.left(o,s);o.setSelectionRange(a,a,"forward")},leftReverse(o,a){const s=z(o.value.length);let r=Math.max(0,a-1);for(;r>=0;r--)if(s[r-1]===_){a=r;break}else if(s[r]===_&&(a=r,r===0))break;if(r<0&&s[a]!==void 0&&s[a]!==_)return F.rightReverse(o,0);a>=0&&o.setSelectionRange(a,a,"backward")},rightReverse(o,a){const s=o.value.length,r=z(s),g=r.slice(0,a+1).indexOf(_)===-1;let c=Math.min(s,a+1);for(;c<=s;c++)if(r[c-1]===_){a=c,a>0&&g===!0&&a--;break}if(c>s&&r[a-1]!==void 0&&r[a-1]!==_)return F.leftReverse(o,s);o.setSelectionRange(a,a,"forward")}};function Q(o){t("click",o),q=void 0}function N(o){if(t("keydown",o),ze(o)===!0||o.altKey===!0)return;const a=i.value,s=a.selectionStart,r=a.selectionEnd;if(o.shiftKey||(q=void 0),o.keyCode===37||o.keyCode===39){o.shiftKey&&q===void 0&&(q=a.selectionDirection==="forward"?s:r);const g=F[(o.keyCode===39?"right":"left")+(e.reverseFillMask===!0?"Reverse":"")];if(o.preventDefault(),g(a,q===s?r:s),o.shiftKey){const c=a.selectionStart;a.setSelectionRange(Math.min(q,c),Math.max(q,c),"forward")}}else o.keyCode===8&&e.reverseFillMask!==!0&&s===r?(F.left(a,s),a.setSelectionRange(a.selectionStart,r,"backward")):o.keyCode===46&&e.reverseFillMask===!0&&s===r&&(F.rightReverse(a,r),a.setSelectionRange(s,a.selectionEnd,"forward"))}function j(o){if(o==null||o==="")return"";if(e.reverseFillMask===!0)return S(o);const a=b;let s=0,r="";for(let g=0;g<a.length;g++){const c=o[s],M=a[g];if(typeof M=="string")r+=M,c===M&&s++;else if(c!==void 0&&M.regex.test(c))r+=M.transform!==void 0?M.transform(c):c,s++;else return r}return r}function S(o){const a=b,s=d.indexOf(_);let r=o.length-1,g="";for(let c=a.length-1;c>=0&&r!==-1;c--){const M=a[c];let m=o[r];if(typeof M=="string")g=M+g,m===M&&r--;else if(m!==void 0&&M.regex.test(m))do g=(M.transform!==void 0?M.transform(m):m)+g,r--,m=o[r];while(s===c&&m!==void 0&&M.regex.test(m));else return g}return g}function C(o){return typeof o!="string"||x===void 0?typeof o=="number"?x(""+o):o:x(o)}function B(o){return f.length-o.length<=0?o:e.reverseFillMask===!0&&o.length!==0?f.slice(0,-o.length)+o:o+f.slice(o.length)}return{innerValue:p,hasMask:w,moveCursorForPaste:L,updateMaskValue:T,onMaskedKeydown:N,onMaskedClick:Q}}const lt={name:String};function at(e){return h(()=>e.name||e.for)}function ot(e,t){function u(){const i=e.modelValue;try{const d="DataTransfer"in window?new DataTransfer:"ClipboardEvent"in window?new ClipboardEvent("").clipboardData:void 0;return Object(i)===i&&("length"in i?Array.from(i):[i]).forEach(f=>{d.items.add(f)}),{files:d.files}}catch{return{files:void 0}}}return t===!0?h(()=>{if(e.type==="file")return u()}):h(u)}const rt=/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/,ut=/[\u4e00-\u9fff\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\uf900-\ufaff\u3300-\u33ff\ufe30-\ufe4f\uf900-\ufaff\u{2f800}-\u{2fa1f}]/u,it=/[\u3131-\u314e\u314f-\u3163\uac00-\ud7a3]/,st=/[a-z0-9_ -]$/i;function dt(e){return function(u){if(u.type==="compositionend"||u.type==="change"){if(u.target.qComposing!==!0)return;u.target.qComposing=!1,e(u)}else u.type==="compositionupdate"&&u.target.qComposing!==!0&&typeof u.data=="string"&&(De.is.firefox===!0?st.test(u.data)===!1:rt.test(u.data)===!0||ut.test(u.data)===!0||it.test(u.data)===!0)===!0&&(u.target.qComposing=!0)}}var mt=ce({name:"QInput",inheritAttrs:!1,props:{...Ye,...tt,...lt,modelValue:{required:!1},shadowText:String,type:{type:String,default:"text"},debounce:[String,Number],autogrow:Boolean,inputClass:[Array,String,Object],inputStyle:[Array,String,Object]},emits:[...Je,"paste","change","keydown","click","animationend"],setup(e,{emit:t,attrs:u}){const{proxy:i}=J(),{$q:d}=i,f={};let b=NaN,x,V,q=null,w;const p=O(null),H=at(e),{innerValue:E,hasMask:z,moveCursorForPaste:D,updateMaskValue:T,onMaskedKeydown:L,onMaskedClick:F}=nt(e,t,m,p),Q=ot(e,!0),N=h(()=>fe(E.value)),j=dt(c),S=Xe(),C=h(()=>e.type==="textarea"||e.autogrow===!0),B=h(()=>C.value===!0||["text","search","url","tel","password"].includes(e.type)),o=h(()=>{const n={...S.splitAttrs.listeners.value,onInput:c,onPaste:g,onChange:v,onBlur:Z,onFocus:ge};return n.onCompositionstart=n.onCompositionupdate=n.onCompositionend=j,z.value===!0&&(n.onKeydown=L,n.onClick=F),e.autogrow===!0&&(n.onAnimationend=M),n}),a=h(()=>{const n={tabindex:0,"data-autofocus":e.autofocus===!0||void 0,rows:e.type==="textarea"?6:void 0,"aria-label":e.label,name:H.value,...S.splitAttrs.attributes.value,id:S.targetUid.value,maxlength:e.maxlength,disabled:e.disable===!0,readonly:e.readonly===!0};return C.value===!1&&(n.type=e.type),e.autogrow===!0&&(n.rows=1),n});P(()=>e.type,()=>{p.value&&(p.value.value=e.modelValue)}),P(()=>e.modelValue,n=>{if(z.value===!0){if(V===!0&&(V=!1,String(n)===b))return;T(n)}else E.value!==n&&(E.value=n,e.type==="number"&&f.hasOwnProperty("value")===!0&&(x===!0?x=!1:delete f.value));e.autogrow===!0&&W(l)}),P(()=>e.autogrow,n=>{n===!0?W(l):p.value!==null&&u.rows>0&&(p.value.style.height="auto")}),P(()=>e.dense,()=>{e.autogrow===!0&&W(l)});function s(){Se(()=>{const n=document.activeElement;p.value!==null&&p.value!==n&&(n===null||n.id!==S.targetUid.value)&&p.value.focus({preventScroll:!0})})}function r(){p.value!==null&&p.value.select()}function g(n){if(z.value===!0&&e.reverseFillMask!==!0){const R=n.target;D(R,R.selectionStart,R.selectionEnd)}t("paste",n)}function c(n){if(!n||!n.target)return;if(e.type==="file"){t("update:modelValue",n.target.files);return}const R=n.target.value;if(n.target.qComposing===!0){f.value=R;return}if(z.value===!0)T(R,!1,n.inputType);else if(m(R),B.value===!0&&n.target===document.activeElement){const{selectionStart:U,selectionEnd:K}=n.target;U!==void 0&&K!==void 0&&W(()=>{n.target===document.activeElement&&R.indexOf(n.target.value)===0&&n.target.setSelectionRange(U,K)})}e.autogrow===!0&&l()}function M(n){t("animationend",n),l()}function m(n,R){w=()=>{q=null,e.type!=="number"&&f.hasOwnProperty("value")===!0&&delete f.value,e.modelValue!==n&&b!==n&&(b=n,R===!0&&(V=!0),t("update:modelValue",n),W(()=>{b===n&&(b=NaN)})),w=void 0},e.type==="number"&&(x=!0,f.value=n),e.debounce!==void 0?(q!==null&&clearTimeout(q),f.value=n,q=setTimeout(w,e.debounce)):w()}function l(){requestAnimationFrame(()=>{const n=p.value;if(n!==null){const R=n.parentNode.style,{scrollTop:U}=n,{overflowY:K,maxHeight:I}=d.platform.is.firefox===!0?{}:window.getComputedStyle(n),X=K!==void 0&&K!=="scroll";X===!0&&(n.style.overflowY="hidden"),R.marginBottom=n.scrollHeight-1+"px",n.style.height="1px",n.style.height=n.scrollHeight+"px",X===!0&&(n.style.overflowY=parseInt(I,10)<n.scrollHeight?"auto":"hidden"),R.marginBottom="",n.scrollTop=U}})}function v(n){j(n),q!==null&&(clearTimeout(q),q=null),w!==void 0&&w(),t("change",n.target.value)}function Z(n){n!==void 0&&ge(n),q!==null&&(clearTimeout(q),q=null),w!==void 0&&w(),x=!1,V=!1,delete f.value,e.type!=="file"&&setTimeout(()=>{p.value!==null&&(p.value.value=E.value!==void 0?E.value:"")})}function y(){return f.hasOwnProperty("value")===!0?f.value:E.value!==void 0?E.value:""}ue(()=>{Z()}),re(()=>{e.autogrow===!0&&l()}),Object.assign(S,{innerValue:E,fieldClass:h(()=>`q-${C.value===!0?"textarea":"input"}`+(e.autogrow===!0?" q-textarea--autogrow":"")),hasShadow:h(()=>e.type!=="file"&&typeof e.shadowText=="string"&&e.shadowText.length!==0),inputRef:p,emitValue:m,hasValue:N,floatingLabel:h(()=>N.value===!0&&(e.type!=="number"||isNaN(E.value)===!1)||fe(e.displayValue)),getControl:()=>k(C.value===!0?"textarea":"input",{ref:p,class:["q-field__native q-placeholder",e.inputClass],style:e.inputStyle,...a.value,...o.value,...e.type!=="file"?{value:y()}:Q.value}),getShadowControl:()=>k("div",{class:"q-field__native q-field__shadow absolute-bottom no-pointer-events"+(C.value===!0?"":" text-no-wrap")},[k("span",{class:"invisible"},y()),k("span",e.shadowText)])});const A=Ge(S);return Object.assign(i,{focus:s,select:r,getNativeElement:()=>p.value}),Ce(i,"nativeEl",()=>p.value),A}}),ht=ce({name:"QCard",props:{...qe,tag:{type:String,default:"div"},square:Boolean,flat:Boolean,bordered:Boolean},setup(e,{slots:t}){const{proxy:{$q:u}}=J(),i=Re(e,u),d=h(()=>"q-card"+(i.value===!0?" q-card--dark q-dark":"")+(e.bordered===!0?" q-card--bordered":"")+(e.square===!0?" q-card--square no-border-radius":"")+(e.flat===!0?" q-card--flat no-shadow":""));return()=>k(e.tag,{class:d.value},G(t.default))}});export{ht as Q,ct as a,Re as b,Se as c,gt as d,mt as e,vt as r,qe as u};

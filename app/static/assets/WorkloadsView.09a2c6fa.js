import{c as J,aC as me,a as m,r as ne,w as fe,h as V,g as ge,Q as N,aD as Z,aE as he,a8 as le,f as ve,T as pe,J as ye,$ as ke,v as p,H as S,A as g,E as o,y as h,Z as j,F as A,I,_ as F,x as Q,z as ee,aF as be,R}from"./index.94c7a7c2.js";import{F as x,y as Se,X as Ne,Y as we,D as M,G as oe,E as T}from"./QDialog.df6206d0.js";import{b as Ce,c as Ve,d as Oe,g as U,f as te,Q as G}from"./use-checkbox.46729352.js";import{u as Pe,a as Ee}from"./use-dark.3d61816d.js";import{Q as xe}from"./QPage.77cd4678.js";import{a as z,Q as De}from"./QCardActions.81ae513d.js";import{E as $e}from"./EventBus.62ac39c0.js";function W(e,t){return[!0,!1].includes(e)?e:t}var Ie=J({name:"QPagination",props:{...Pe,modelValue:{type:Number,required:!0},min:{type:[Number,String],default:1},max:{type:[Number,String],required:!0},maxPages:{type:[Number,String],default:0,validator:e=>(typeof e=="string"?parseInt(e,10):e)>=0},inputStyle:[Array,String,Object],inputClass:[Array,String,Object],size:String,disable:Boolean,input:Boolean,iconPrev:String,iconNext:String,iconFirst:String,iconLast:String,toFn:Function,boundaryLinks:{type:Boolean,default:null},boundaryNumbers:{type:Boolean,default:null},directionLinks:{type:Boolean,default:null},ellipses:{type:Boolean,default:null},ripple:{type:[Boolean,Object],default:null},round:Boolean,rounded:Boolean,flat:Boolean,outline:Boolean,unelevated:Boolean,push:Boolean,glossy:Boolean,color:{type:String,default:"primary"},textColor:String,activeDesign:{type:String,default:"",values:e=>e===""||me.includes(e)},activeColor:String,activeTextColor:String,gutter:String,padding:{type:String,default:"3px 2px"}},emits:["update:modelValue"],setup(e,{emit:t}){const{proxy:n}=ge(),{$q:a}=n,s=Ee(e,a),i=m(()=>parseInt(e.min,10)),l=m(()=>parseInt(e.max,10)),c=m(()=>parseInt(e.maxPages,10)),f=m(()=>P.value+" / "+l.value),O=m(()=>W(e.boundaryLinks,e.input)),v=m(()=>W(e.boundaryNumbers,!e.input)),_=m(()=>W(e.directionLinks,e.input)),D=m(()=>W(e.ellipses,!e.input)),$=ne(null),P=m({get:()=>e.modelValue,set:r=>{if(r=parseInt(r,10),e.disable||isNaN(r))return;const d=Se(r,i.value,l.value);e.modelValue!==d&&t("update:modelValue",d)}});fe(()=>`${i.value}|${l.value}`,()=>{P.value=e.modelValue});const u=m(()=>"q-pagination row no-wrap items-center"+(e.disable===!0?" disabled":"")),y=m(()=>e.gutter in Z?`${Z[e.gutter]}px`:e.gutter||null),w=m(()=>y.value!==null?`--q-pagination-gutter-parent:-${y.value};--q-pagination-gutter-child:${y.value}`:null),k=m(()=>{const r=[e.iconFirst||a.iconSet.pagination.first,e.iconPrev||a.iconSet.pagination.prev,e.iconNext||a.iconSet.pagination.next,e.iconLast||a.iconSet.pagination.last];return a.lang.rtl===!0?r.reverse():r}),ie=m(()=>({"aria-disabled":e.disable===!0?"true":"false",role:"navigation"})),Y=m(()=>he(e,"flat")),se=m(()=>({[Y.value]:!0,round:e.round,rounded:e.rounded,padding:e.padding,color:e.color,textColor:e.textColor,size:e.size,ripple:e.ripple!==null?e.ripple:!0})),re=m(()=>{const r={[Y.value]:!1};return e.activeDesign!==""&&(r[e.activeDesign]=!0),r}),de=m(()=>({...re.value,color:e.activeColor||e.color,textColor:e.activeTextColor||e.textColor})),q=m(()=>{let r=Math.max(c.value,1+(D.value?2:0)+(v.value?2:0));const d={pgFrom:i.value,pgTo:l.value,ellipsesStart:!1,ellipsesEnd:!1,boundaryStart:!1,boundaryEnd:!1,marginalStyle:{minWidth:`${Math.max(2,String(l.value).length)}em`}};return c.value&&r<l.value-i.value+1&&(r=1+Math.floor(r/2)*2,d.pgFrom=Math.max(i.value,Math.min(l.value-r+1,e.modelValue-Math.floor(r/2))),d.pgTo=Math.min(l.value,d.pgFrom+r-1),v.value&&(d.boundaryStart=!0,d.pgFrom++),D.value&&d.pgFrom>i.value+(v.value?1:0)&&(d.ellipsesStart=!0,d.pgFrom++),v.value&&(d.boundaryEnd=!0,d.pgTo--),D.value&&d.pgTo<l.value-(v.value?1:0)&&(d.ellipsesEnd=!0,d.pgTo--)),d});function H(r){P.value=r}function ue(r){P.value=P.value+r}const ce=m(()=>{function r(){P.value=$.value,$.value=null}return{"onUpdate:modelValue":d=>{$.value=d},onKeyup:d=>{le(d,13)===!0&&r()},onBlur:r}});function C(r,d,B){const E={"aria-label":d,"aria-current":"false",...se.value,...r};return B===!0&&Object.assign(E,{"aria-current":"true",...de.value}),d!==void 0&&(e.toFn!==void 0?E.to=e.toFn(d):E.onClick=()=>{H(d)}),V(N,E)}return Object.assign(n,{set:H,setByOffset:ue}),()=>{const r=[],d=[];let B;if(O.value===!0&&(r.push(C({key:"bls",disable:e.disable||e.modelValue<=i.value,icon:k.value[0]},i.value)),d.unshift(C({key:"ble",disable:e.disable||e.modelValue>=l.value,icon:k.value[3]},l.value))),_.value===!0&&(r.push(C({key:"bdp",disable:e.disable||e.modelValue<=i.value,icon:k.value[1]},e.modelValue-1)),d.unshift(C({key:"bdn",disable:e.disable||e.modelValue>=l.value,icon:k.value[2]},e.modelValue+1))),e.input!==!0){B=[];const{pgFrom:E,pgTo:X,marginalStyle:L}=q.value;if(q.value.boundaryStart===!0){const b=i.value===e.modelValue;r.push(C({key:"bns",style:L,disable:e.disable,label:i.value},i.value,b))}if(q.value.boundaryEnd===!0){const b=l.value===e.modelValue;d.unshift(C({key:"bne",style:L,disable:e.disable,label:l.value},l.value,b))}q.value.ellipsesStart===!0&&r.push(C({key:"bes",style:L,disable:e.disable,label:"\u2026",ripple:!1},E-1)),q.value.ellipsesEnd===!0&&d.unshift(C({key:"bee",style:L,disable:e.disable,label:"\u2026",ripple:!1},X+1));for(let b=E;b<=X;b++)B.push(C({key:`bpg${b}`,style:L,disable:e.disable,label:b},b,b===e.modelValue))}return V("div",{class:u.value,...ie.value},[V("div",{class:"q-pagination__content row no-wrap items-center",style:w.value},[...r,e.input===!0?V(x,{class:"inline",style:{width:`${f.value.length/1.5}em`},type:"number",dense:!0,value:$.value,disable:e.disable,dark:s.value,borderless:!0,inputClass:e.inputClass,inputStyle:e.inputStyle,placeholder:f.value,min:i.value,max:l.value,...ce.value}):V("div",{class:"q-pagination__middle row justify-center"},B),...d])])}}}),Te=J({name:"QSlideTransition",props:{appear:Boolean,duration:{type:Number,default:300}},emits:["show","hide"],setup(e,{slots:t,emit:n}){let a=!1,s,i,l=null,c=null,f,O;function v(){s&&s(),s=null,a=!1,l!==null&&(clearTimeout(l),l=null),c!==null&&(clearTimeout(c),c=null),i!==void 0&&i.removeEventListener("transitionend",f),f=null}function _(u,y,w){y!==void 0&&(u.style.height=`${y}px`),u.style.transition=`height ${e.duration}ms cubic-bezier(.25, .8, .50, 1)`,a=!0,s=w}function D(u,y){u.style.overflowY=null,u.style.height=null,u.style.transition=null,v(),y!==O&&n(y)}function $(u,y){let w=0;i=u,a===!0?(v(),w=u.offsetHeight===u.scrollHeight?0:void 0):(O="hide",u.style.overflowY="hidden"),_(u,w,y),l=setTimeout(()=>{l=null,u.style.height=`${u.scrollHeight}px`,f=k=>{c=null,(Object(k)!==k||k.target===u)&&D(u,"show")},u.addEventListener("transitionend",f),c=setTimeout(f,e.duration*1.1)},100)}function P(u,y){let w;i=u,a===!0?v():(O="show",u.style.overflowY="hidden",w=u.scrollHeight),_(u,w,y),l=setTimeout(()=>{l=null,u.style.height=0,f=k=>{c=null,(Object(k)!==k||k.target===u)&&D(u,"hide")},u.addEventListener("transitionend",f),c=setTimeout(f,e.duration*1.1)},100)}return ve(()=>{a===!0&&v()}),()=>V(pe,{css:!1,appear:e.appear,onEnter:$,onLeave:P},t.default)}});function ae(e){if(e===!1)return 0;if(e===!0||e===void 0)return 1;const t=parseInt(e,10);return isNaN(t)?0:t}var K=ye({name:"close-popup",beforeMount(e,{value:t}){const n={depth:ae(t),handler(a){n.depth!==0&&setTimeout(()=>{const s=Ne(e);s!==void 0&&we(s,a,n.depth)})},handlerKey(a){le(a,13)===!0&&n.handler(a)}};e.__qclosepopup=n,e.addEventListener("click",n.handler),e.addEventListener("keyup",n.handlerKey)},updated(e,{value:t,oldValue:n}){t!==n&&(e.__qclosepopup.depth=ae(t))},beforeUnmount(e){const t=e.__qclosepopup;e.removeEventListener("click",t.handler),e.removeEventListener("keyup",t.handlerKey),delete e.__qclosepopup}}),qe=J({name:"QToggle",props:{...Ce,icon:String,iconColor:String},emits:Ve,setup(e){function t(n,a){const s=m(()=>(n.value===!0?e.checkedIcon:a.value===!0?e.indeterminateIcon:e.uncheckedIcon)||e.icon),i=m(()=>n.value===!0?e.iconColor:null);return()=>[V("div",{class:"q-toggle__track"}),V("div",{class:"q-toggle__thumb absolute flex flex-center no-wrap"},s.value!==void 0?[V(ke,{name:s.value,color:i.value})]:void 0)]}return Oe("toggle",t)}});const Be={class:"row full-width"},Le={class:"row justify-end"},je={props:["state"],data(){return{readonly:ne(!1),runtimeConfig:""}},methods:{applyConfig(){const e={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({workloadName:this.state.name,agent:this.state.agent,runtimeConfig:this.runtimeConfig,restartPolicy:this.state.restartPolicy,runtime:this.state.runtime,tags:this.state.tags})};fetch("/updateConfig",e).then(t=>console.log(t.status)),this.editConfig=!1}},mounted(){this.state.runtimeConfig?this.runtimeConfig=this.state.runtimeConfig:this.runtimeConfig=""}},_e=Object.assign(je,{name:"ConfigSection"},{__name:"ConfigSection",setup(e){return(t,n)=>(p(),S("div",null,[g("div",Be,[o(x,{modelValue:t.runtimeConfig,"onUpdate:modelValue":n[0]||(n[0]=a=>t.runtimeConfig=a),class:"full-width-item",filled:"",autogrow:"",label:"Runtime Config",readonly:!t.readonly},null,8,["modelValue","readonly"]),o(qe,{modelValue:t.readonly,"onUpdate:modelValue":n[1]||(n[1]=a=>t.readonly=a),class:"full-width-item",label:"Edit"},null,8,["modelValue"])]),g("div",Le,[o(N,{icon:"save",color:"secondary",onClick:t.applyConfig},null,8,["onClick"])])]))}}),Ue={class:"row justify-between items-center"},We={class:"row justify-between items-center"},Ae={class:"text-h6"},Fe={class:"q-ml-sm"},Qe={props:["workload","desiredState","dependencies","workloadStates"],data(){return{confirm:!1,currentSection:"",currentWorkloadName:"",workloadState:[],state:{runtimeConfig:"test"}}},methods:{getExecutionStateColor(e){return e==="RUNNING_OK"?"positive":e==="PENDING_WAITING_TO_START"?"yellow":"negative"},deleteWorkload(){const e={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify([this.workload.instanceName.workloadName])};fetch("/deleteWorkloads",e).then(t=>{console.log(t.status),EventBus.emit("workload-deleted")})},chooseExecutionColor(e){switch(e){case"running":return"green";case"failed":return"red";case"pending":return"yellow";case"removed":return"black";case"succeeded":case"unknown":default:return"gray"}},getDependencyText(e){const t={ADD_COND_RUNNING:"RUNNING_OK",RUNNING_OK:"ADD_COND_RUNNING"};let n=[];if(e&&this.desiredState&&this.desiredState.workloads&&e.instanceName&&e.instanceName.workloadName in this.desiredState.workloads){let a=this.desiredState.workloads[e.instanceName.workloadName].dependencies;if(a&&Object.keys(a).length>0)for(let s in a){let i=this.workloadStates.find(l=>l.instanceName.workloadName===s);if(i&&i.executionState){let l=a[s],c=i.executionState[Object.keys(i.executionState)[0]],f=t[c]||c;f===l?n.push({text:`${s} -> ${l} is a match`,status:"match"}):n.push({text:`${s} -> ${l} does not match current state ${f}`,status:"no-match"})}else{let l=a[s];n.push({text:`${s} -> ${l} is missing`,status:"missing"})}}}return n=n.sort((a,s)=>a.text.localeCompare(s.text)),n.length>0?n:[{text:"No dependencies",status:"match"}]},handleDependencyButtonClick(){this.currentSection=this.currentSection==="dependencies"?"":"dependencies"},checkDependency(){return e=>{const t={ADD_COND_RUNNING:"RUNNING_OK",RUNNING_OK:"ADD_COND_RUNNING"};if(e&&this.desiredState&&this.desiredState.workloads&&e.instanceName&&"workloadName"in e.instanceName&&e.instanceName.workloadName in this.desiredState.workloads){let n=this.desiredState.workloads[e.instanceName.workloadName].dependencies;if(n&&Object.keys(n).length>0){let a=!0;for(let s in n){let i=this.workloadStates.find(l=>l.instanceName&&"workloadName"in l.instanceName&&l.instanceName.workloadName===s);if(i&&i.executionState&&Object.keys(i.executionState).length>0){let l=n[s],c=i.executionState[Object.keys(i.executionState)[0]];if(t[c]&&(c=t[c]),c!==l){a=!1;break}}else{a=!1;break}}return a?"found":"missing"}}return!1}}},computed:{lastItemOfExecState(){const e=Object.keys(this.workload.executionState);return e[e.length-1]}},mounted(){this.currentWorkloadName=this.workload.instanceName.workloadName;for(let[e,t]of Object.entries(this.desiredState.workloads))if(t={...t},e===this.currentWorkloadName){this.state=JSON.parse(JSON.stringify(t)),this.state.name=e;break}}},Re=Object.assign(Qe,{name:"WorkloadCard"},{__name:"WorkloadCard",setup(e){return(t,n)=>(p(),S(j,null,[o(M,{class:"bg-gray-4"},{default:h(()=>[o(T,null,{default:h(()=>[g("div",Ue,[g("div",null,[o(U,{rounded:"",color:t.chooseExecutionColor(t.lastItemOfExecState),class:"q-mr-sm"},null,8,["color"]),A(I(t.lastItemOfExecState),1)]),o(N,{flat:"",round:"",icon:"close",size:"xs",color:"negative",onClick:n[0]||(n[0]=a=>t.confirm=!0)})]),g("div",We,[g("div",Ae,I(e.workload.instanceName.workloadName),1),g("div",null,I(e.workload.instanceName.agentName),1)]),o(te),(p(!0),S(j,null,F(e.desiredState.workloads[e.workload.instanceName.workloadName].tags,a=>(p(),S("div",{key:a.key},[o(U,{color:"secondary",label:a.key+": "+a.value},null,8,["label"])]))),128)),o(z,{class:"row justify-end"},{default:h(()=>[o(N,{rounded:"",icon:"mediation",color:"primary small",onClick:n[1]||(n[1]=a=>t.currentSection=t.currentSection==="dependencies"?"":"dependencies")}),o(N,{rounded:"",icon:"settings",color:"secondary small",onClick:n[2]||(n[2]=a=>t.currentSection=t.currentSection==="config"?"":"config")})]),_:1})]),_:1}),o(te),o(Te,null,{default:h(()=>[t.currentSection==="dependencies"?(p(),Q(T,{key:0},{default:h(()=>[(p(!0),S(j,null,F(e.workloadStates.filter(a=>a.instanceName.workloadName===t.currentWorkloadName),a=>(p(),S("div",{key:a.instanceName.workloadName},[g("div",null,[o(U,{rounded:"",color:t.getExecutionStateColor(a.executionState[Object.keys(a.executionState)[0]]),class:"q-mr-sm"},null,8,["color"]),A(" "+I(a.executionState[Object.keys(a.executionState)[0]]),1)]),(p(!0),S(j,null,F(t.getDependencyText(a),s=>(p(),S("div",{key:s.text},[o(U,{rounded:"",color:s.status==="match"?"positive":"negative",class:"q-mr-sm"},null,8,["color"]),A(" "+I(s.text),1)]))),128))]))),128))]),_:1})):ee("",!0),t.currentSection==="config"?(p(),Q(T,{key:1},{default:h(()=>[o(_e,{state:t.state},null,8,["state"])]),_:1})):ee("",!0)]),_:1})]),_:1}),o(oe,{modelValue:t.confirm,"onUpdate:modelValue":n[3]||(n[3]=a=>t.confirm=a),persistent:""},{default:h(()=>[o(M,null,{default:h(()=>[o(T,{class:"row items-center"},{default:h(()=>[o(be,{icon:"warning",size:"xs",color:"primary","text-color":"white"}),g("span",Fe,'You are about to delete "'+I(e.workload.instanceName.workloadName)+'"',1)]),_:1}),o(z,{align:"right"},{default:h(()=>[R(o(N,{flat:"",label:"Cancel",color:"primary"},null,512),[[K]]),R(o(N,{flat:"",label:"Delete",color:"negative",onClick:t.deleteWorkload},null,8,["onClick"]),[[K]])]),_:1})]),_:1})]),_:1},8,["modelValue"])],64))}}),Ke=g("div",{class:"text-h5 text-white q-my-xs"},"Add Workload",-1),Me={class:"q-gutter-md",style:{"max-width":"420px"}},Ge={props:{value:Boolean},data(){return{workloadName:"",agent:null,agentsList:["agent_A","agent_B","agent_C"],runtimeConfig:`image: IMAGE_NAME 
commandOptions: ["flag", "value"]`,tags:'{"key1": "value1", "key2": "value2"}',restartPolicy:"NEVER",runtime:"podman",options:["NEVER","ALWAYS","ON_FAILURE"]}},methods:{submit(){var e=[];if(this.tags!=""){var t=JSON.parse(this.tags);Object.keys(t).forEach(function(a){e.push({key:a,value:t[a]})})}const n={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({workloadName:this.workloadName,agent:this.agent,runtime:this.runtime,tags:e,restartPolicy:this.restartPolicy,runtimeConfig:this.runtimeConfig})};fetch("/addNewWorkload",n).then(a=>{console.log(a.status),this.$q.notify("Workload Added")})},close(){this.showDialog=!1}},computed:{showDialog:{get(){return this.value},set(e){this.$emit("input",e)}}}},ze=Object.assign(Ge,{name:"AddWorkloadDialog"},{__name:"AddWorkloadDialog",setup(e){return(t,n)=>(p(),Q(oe,{modelValue:t.showDialog,"onUpdate:modelValue":n[6]||(n[6]=a=>t.showDialog=a),class:"q-px-sm q-pb-md"},{default:h(()=>[o(M,{class:"bg-gray-4",style:{width:"450px"}},{default:h(()=>[o(T,{class:"row items-center bg-secondary"},{default:h(()=>[Ke,o(De),R(o(N,{icon:"close",color:"white",flat:"",round:"",dense:"",onClick:t.close},null,8,["onClick"]),[[K]])]),_:1}),o(T,{class:"q-pa-md"},{default:h(()=>[g("div",Me,[o(x,{filled:"",modelValue:t.workloadName,"onUpdate:modelValue":n[0]||(n[0]=a=>t.workloadName=a),label:"Workload Name"},null,8,["modelValue"]),o(G,{filled:"",modelValue:t.agent,"onUpdate:modelValue":n[1]||(n[1]=a=>t.agent=a),options:t.agentsList,label:"Agent",style:{width:"300px"}},null,8,["modelValue","options"]),o(x,{filled:"",modelValue:t.runtime,"onUpdate:modelValue":n[2]||(n[2]=a=>t.runtime=a),label:"Runtime"},null,8,["modelValue"]),o(G,{filled:"",modelValue:t.restartPolicy,"onUpdate:modelValue":n[3]||(n[3]=a=>t.restartPolicy=a),options:t.options,label:"restartPolicy"},null,8,["modelValue","options"]),o(x,{filled:"",modelValue:t.tags,"onUpdate:modelValue":n[4]||(n[4]=a=>t.tags=a),label:"tags"},null,8,["modelValue"]),o(x,{modelValue:t.runtimeConfig,"onUpdate:modelValue":n[5]||(n[5]=a=>t.runtimeConfig=a),label:"Runtime Config",filled:"",autogrow:""},null,8,["modelValue"])]),o(z,{class:"row justify-end"},{default:h(()=>[R(o(N,{icon:"add",color:"secondary",label:"Add",onClick:t.submit},null,8,["onClick"]),[[K]])]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]))}}),Je={class:"row justify-between items-center q-pa-md"},Ye={class:"text-h5"},He={class:"row justify-between"},Xe={class:"q-pa-md row q-gutter-md"},Ze={class:"q-pa-lg flex flex-center"},et={data(){return{search:"",workloads:[],dependencies:[],addworkload:!1,filterState:"all",options:["all","running","pending","failed","succeeded","stopping"],desiredState:{},currentPage:1,pageSize:9}},methods:{loadState(){fetch("/completeState").then(e=>e.ok?e.json():(e.status==405&&(console.log("User not logged in. Changing to Login Page."),this.changeView("login")),Promise.reject(e))).then(e=>{console.log("loadState"),console.log(e);let t=null,n=null;if(e&&e.response&&e.response.completeState&&e.response.completeState.workloadStates&&(t=e.response.completeState,this.workloads=t.workloadStates,t.desiredState&&(this.desiredState=t.desiredState,t.desiredState.workloads&&(n=t.desiredState.workloads))),n){const a=[];for(let[s,i]of Object.entries(n))if("dependencies"in i)for(let[l,c]of Object.entries(i.dependencies))a.push({source:s,target:l,type:c});$e.emit("update-dependencies",a)}}).catch(e=>{console.log("There has been a problem with your fetch operation: ",e.message)})},toggle(e){this.showConfig[e]=!this.showConfig[e]},updatePage(e){this.currentPage=e},getLastItemOfExecState(e){const t=Object.keys(e);return t[t.length-1]}},computed:{sortedWorkloads(){return this.workloads.sort((e,t)=>e.instanceName.workloadName.localeCompare(t.instanceName.workloadName))},filteredWorkloads(){return!this.search&&!this.filterState?this.sortedWorkloads:this.sortedWorkloads.filter(e=>{console.log(e);let t=this.search.toLowerCase(),n=e.instanceName.workloadName.toLowerCase(),a=e.instanceName.agentName.toLowerCase(),s=this.desiredState.workloads[e.instanceName.workloadName];if(!s)return!1;let i=s.runtimeConfig.toLowerCase(),l=!1,c=!1;if("tags"in s){let O=s.tags;l=O.some(v=>v.key.toLowerCase().includes(t)),c=O.some(v=>v.value.toLowerCase().includes(t))}let f=!1;return(this.filterState=="all"||this.filterState==this.getLastItemOfExecState(e.executionState))&&(f=!0),(n.includes(t)||a.includes(t)||i.includes(t)||l||c)&&f})},paginatedWorkloads(){const e=(this.currentPage-1)*this.pageSize,t=e+this.pageSize;return this.filteredWorkloads.slice(e,t)},maxPages(){return Math.ceil(this.filteredWorkloads.length/this.pageSize)}},mounted(){this.timer=setInterval(()=>{this.loadState()},2e3)},beforeUnmount(){clearInterval(this.timer)}},rt=Object.assign(et,{name:"WorkloadsView"},{__name:"WorkloadsView",setup(e){return(t,n)=>(p(),Q(xe,{padding:""},{default:h(()=>[g("div",Je,[g("div",null,[g("div",Ye,[A("Workloads "),o(N,{small:"",round:"",color:"secondary",icon:"add",onClick:n[0]||(n[0]=a=>t.addworkload=!0),style:{"margin-left":"20px"}})])]),g("div",He,[o(x,{modelValue:t.search,"onUpdate:modelValue":n[1]||(n[1]=a=>t.search=a),placeholder:"Search...",filled:"",dense:"",debounce:"300"},null,8,["modelValue"]),o(G,{style:{width:"125px","margin-left":"10px"},filled:"",modelValue:t.filterState,"onUpdate:modelValue":n[2]||(n[2]=a=>t.filterState=a),options:t.options,label:"State Filter"},null,8,["modelValue","options"])])]),o(ze,{modelValue:t.addworkload,"onUpdate:modelValue":n[3]||(n[3]=a=>t.addworkload=a)},null,8,["modelValue"]),g("div",Xe,[(p(!0),S(j,null,F(t.paginatedWorkloads,a=>(p(),S("div",{class:"col-md-3",key:a.instanceName.id},[o(Re,{workload:a,workloadStates:t.workloads,desiredState:t.desiredState,dependencies:t.dependencies},null,8,["workload","workloadStates","desiredState","dependencies"])]))),128))]),g("div",Ze,[o(Ie,{modelValue:t.currentPage,"onUpdate:modelValue":[n[4]||(n[4]=a=>t.currentPage=a),t.updatePage],max:t.maxPages},null,8,["modelValue","max","onUpdate:modelValue"])])]),_:1}))}});export{rt as default};

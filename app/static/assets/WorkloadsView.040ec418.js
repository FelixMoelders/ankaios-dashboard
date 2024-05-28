import { c as createComponent, aC as btnDesignOptions, a as computed, r as ref, w as watch, h, g as getCurrentInstance, Q as QBtn, aD as btnPadding, aE as getBtnDesign, a8 as isKeyCode, f as onBeforeUnmount, T as Transition, J as createDirective, $ as QIcon, v as openBlock, H as createElementBlock, A as createBaseVNode, E as createVNode, y as withCtx, Z as Fragment, F as createTextVNode, I as toDisplayString, _ as renderList, x as createBlock, z as createCommentVNode, aF as QAvatar, R as withDirectives } from "./index.3ce55368.js";
import { F as QInput, y as between, X as getPortalProxy, Y as closePortals, D as QCard, G as QDialog, E as QCardSection } from "./QDialog.ec1e5a72.js";
import { b as useCheckboxProps, c as useCheckboxEmits, d as useCheckbox, g as QBadge, f as QSeparator, Q as QSelect } from "./use-checkbox.12b2d847.js";
import { u as useDarkProps, a as useDark } from "./use-dark.22f7ae47.js";
import { Q as QPage } from "./QPage.71cdcbba.js";
import { a as QCardActions, Q as QSpace } from "./QCardActions.1b695372.js";
import { E as EventBus } from "./EventBus.62ac39c0.js";
function getBool(val, otherwise) {
  return [true, false].includes(val) ? val : otherwise;
}
var QPagination = createComponent({
  name: "QPagination",
  props: {
    ...useDarkProps,
    modelValue: {
      type: Number,
      required: true
    },
    min: {
      type: [Number, String],
      default: 1
    },
    max: {
      type: [Number, String],
      required: true
    },
    maxPages: {
      type: [Number, String],
      default: 0,
      validator: (v) => (typeof v === "string" ? parseInt(v, 10) : v) >= 0
    },
    inputStyle: [Array, String, Object],
    inputClass: [Array, String, Object],
    size: String,
    disable: Boolean,
    input: Boolean,
    iconPrev: String,
    iconNext: String,
    iconFirst: String,
    iconLast: String,
    toFn: Function,
    boundaryLinks: {
      type: Boolean,
      default: null
    },
    boundaryNumbers: {
      type: Boolean,
      default: null
    },
    directionLinks: {
      type: Boolean,
      default: null
    },
    ellipses: {
      type: Boolean,
      default: null
    },
    ripple: {
      type: [Boolean, Object],
      default: null
    },
    round: Boolean,
    rounded: Boolean,
    flat: Boolean,
    outline: Boolean,
    unelevated: Boolean,
    push: Boolean,
    glossy: Boolean,
    color: {
      type: String,
      default: "primary"
    },
    textColor: String,
    activeDesign: {
      type: String,
      default: "",
      values: (v) => v === "" || btnDesignOptions.includes(v)
    },
    activeColor: String,
    activeTextColor: String,
    gutter: String,
    padding: {
      type: String,
      default: "3px 2px"
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const { $q } = proxy;
    const isDark = useDark(props, $q);
    const minProp = computed(() => parseInt(props.min, 10));
    const maxProp = computed(() => parseInt(props.max, 10));
    const maxPagesProp = computed(() => parseInt(props.maxPages, 10));
    const inputPlaceholder = computed(() => model.value + " / " + maxProp.value);
    const boundaryLinksProp = computed(() => getBool(props.boundaryLinks, props.input));
    const boundaryNumbersProp = computed(() => getBool(props.boundaryNumbers, !props.input));
    const directionLinksProp = computed(() => getBool(props.directionLinks, props.input));
    const ellipsesProp = computed(() => getBool(props.ellipses, !props.input));
    const newPage = ref(null);
    const model = computed({
      get: () => props.modelValue,
      set: (val) => {
        val = parseInt(val, 10);
        if (props.disable || isNaN(val)) {
          return;
        }
        const value = between(val, minProp.value, maxProp.value);
        if (props.modelValue !== value) {
          emit("update:modelValue", value);
        }
      }
    });
    watch(() => `${minProp.value}|${maxProp.value}`, () => {
      model.value = props.modelValue;
    });
    const classes = computed(
      () => "q-pagination row no-wrap items-center" + (props.disable === true ? " disabled" : "")
    );
    const gutterProp = computed(() => props.gutter in btnPadding ? `${btnPadding[props.gutter]}px` : props.gutter || null);
    const gutterStyle = computed(() => gutterProp.value !== null ? `--q-pagination-gutter-parent:-${gutterProp.value};--q-pagination-gutter-child:${gutterProp.value}` : null);
    const icons = computed(() => {
      const ico = [
        props.iconFirst || $q.iconSet.pagination.first,
        props.iconPrev || $q.iconSet.pagination.prev,
        props.iconNext || $q.iconSet.pagination.next,
        props.iconLast || $q.iconSet.pagination.last
      ];
      return $q.lang.rtl === true ? ico.reverse() : ico;
    });
    const attrs = computed(() => ({
      "aria-disabled": props.disable === true ? "true" : "false",
      role: "navigation"
    }));
    const btnDesignProp = computed(() => getBtnDesign(props, "flat"));
    const btnProps = computed(() => ({
      [btnDesignProp.value]: true,
      round: props.round,
      rounded: props.rounded,
      padding: props.padding,
      color: props.color,
      textColor: props.textColor,
      size: props.size,
      ripple: props.ripple !== null ? props.ripple : true
    }));
    const btnActiveDesignProp = computed(() => {
      const acc = { [btnDesignProp.value]: false };
      if (props.activeDesign !== "") {
        acc[props.activeDesign] = true;
      }
      return acc;
    });
    const activeBtnProps = computed(() => ({
      ...btnActiveDesignProp.value,
      color: props.activeColor || props.color,
      textColor: props.activeTextColor || props.textColor
    }));
    const btnConfig = computed(() => {
      let maxPages = Math.max(
        maxPagesProp.value,
        1 + (ellipsesProp.value ? 2 : 0) + (boundaryNumbersProp.value ? 2 : 0)
      );
      const acc = {
        pgFrom: minProp.value,
        pgTo: maxProp.value,
        ellipsesStart: false,
        ellipsesEnd: false,
        boundaryStart: false,
        boundaryEnd: false,
        marginalStyle: {
          minWidth: `${Math.max(2, String(maxProp.value).length)}em`
        }
      };
      if (maxPagesProp.value && maxPages < maxProp.value - minProp.value + 1) {
        maxPages = 1 + Math.floor(maxPages / 2) * 2;
        acc.pgFrom = Math.max(minProp.value, Math.min(maxProp.value - maxPages + 1, props.modelValue - Math.floor(maxPages / 2)));
        acc.pgTo = Math.min(maxProp.value, acc.pgFrom + maxPages - 1);
        if (boundaryNumbersProp.value) {
          acc.boundaryStart = true;
          acc.pgFrom++;
        }
        if (ellipsesProp.value && acc.pgFrom > minProp.value + (boundaryNumbersProp.value ? 1 : 0)) {
          acc.ellipsesStart = true;
          acc.pgFrom++;
        }
        if (boundaryNumbersProp.value) {
          acc.boundaryEnd = true;
          acc.pgTo--;
        }
        if (ellipsesProp.value && acc.pgTo < maxProp.value - (boundaryNumbersProp.value ? 1 : 0)) {
          acc.ellipsesEnd = true;
          acc.pgTo--;
        }
      }
      return acc;
    });
    function set(value) {
      model.value = value;
    }
    function setByOffset(offset) {
      model.value = model.value + offset;
    }
    const inputEvents = computed(() => {
      function updateModel() {
        model.value = newPage.value;
        newPage.value = null;
      }
      return {
        "onUpdate:modelValue": (val) => {
          newPage.value = val;
        },
        onKeyup: (e) => {
          isKeyCode(e, 13) === true && updateModel();
        },
        onBlur: updateModel
      };
    });
    function getBtn(cfg, page, active) {
      const data = {
        "aria-label": page,
        "aria-current": "false",
        ...btnProps.value,
        ...cfg
      };
      if (active === true) {
        Object.assign(data, {
          "aria-current": "true",
          ...activeBtnProps.value
        });
      }
      if (page !== void 0) {
        if (props.toFn !== void 0) {
          data.to = props.toFn(page);
        } else {
          data.onClick = () => {
            set(page);
          };
        }
      }
      return h(QBtn, data);
    }
    Object.assign(proxy, { set, setByOffset });
    return () => {
      const contentStart = [];
      const contentEnd = [];
      let contentMiddle;
      if (boundaryLinksProp.value === true) {
        contentStart.push(
          getBtn({
            key: "bls",
            disable: props.disable || props.modelValue <= minProp.value,
            icon: icons.value[0]
          }, minProp.value)
        );
        contentEnd.unshift(
          getBtn({
            key: "ble",
            disable: props.disable || props.modelValue >= maxProp.value,
            icon: icons.value[3]
          }, maxProp.value)
        );
      }
      if (directionLinksProp.value === true) {
        contentStart.push(
          getBtn({
            key: "bdp",
            disable: props.disable || props.modelValue <= minProp.value,
            icon: icons.value[1]
          }, props.modelValue - 1)
        );
        contentEnd.unshift(
          getBtn({
            key: "bdn",
            disable: props.disable || props.modelValue >= maxProp.value,
            icon: icons.value[2]
          }, props.modelValue + 1)
        );
      }
      if (props.input !== true) {
        contentMiddle = [];
        const { pgFrom, pgTo, marginalStyle: style } = btnConfig.value;
        if (btnConfig.value.boundaryStart === true) {
          const active = minProp.value === props.modelValue;
          contentStart.push(
            getBtn({
              key: "bns",
              style,
              disable: props.disable,
              label: minProp.value
            }, minProp.value, active)
          );
        }
        if (btnConfig.value.boundaryEnd === true) {
          const active = maxProp.value === props.modelValue;
          contentEnd.unshift(
            getBtn({
              key: "bne",
              style,
              disable: props.disable,
              label: maxProp.value
            }, maxProp.value, active)
          );
        }
        if (btnConfig.value.ellipsesStart === true) {
          contentStart.push(
            getBtn({
              key: "bes",
              style,
              disable: props.disable,
              label: "\u2026",
              ripple: false
            }, pgFrom - 1)
          );
        }
        if (btnConfig.value.ellipsesEnd === true) {
          contentEnd.unshift(
            getBtn({
              key: "bee",
              style,
              disable: props.disable,
              label: "\u2026",
              ripple: false
            }, pgTo + 1)
          );
        }
        for (let i = pgFrom; i <= pgTo; i++) {
          contentMiddle.push(
            getBtn({
              key: `bpg${i}`,
              style,
              disable: props.disable,
              label: i
            }, i, i === props.modelValue)
          );
        }
      }
      return h("div", {
        class: classes.value,
        ...attrs.value
      }, [
        h("div", {
          class: "q-pagination__content row no-wrap items-center",
          style: gutterStyle.value
        }, [
          ...contentStart,
          props.input === true ? h(QInput, {
            class: "inline",
            style: { width: `${inputPlaceholder.value.length / 1.5}em` },
            type: "number",
            dense: true,
            value: newPage.value,
            disable: props.disable,
            dark: isDark.value,
            borderless: true,
            inputClass: props.inputClass,
            inputStyle: props.inputStyle,
            placeholder: inputPlaceholder.value,
            min: minProp.value,
            max: maxProp.value,
            ...inputEvents.value
          }) : h("div", {
            class: "q-pagination__middle row justify-center"
          }, contentMiddle),
          ...contentEnd
        ])
      ]);
    };
  }
});
var QSlideTransition = createComponent({
  name: "QSlideTransition",
  props: {
    appear: Boolean,
    duration: {
      type: Number,
      default: 300
    }
  },
  emits: ["show", "hide"],
  setup(props, { slots, emit }) {
    let animating = false, doneFn, element;
    let timer = null, timerFallback = null, animListener, lastEvent;
    function cleanup() {
      doneFn && doneFn();
      doneFn = null;
      animating = false;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      if (timerFallback !== null) {
        clearTimeout(timerFallback);
        timerFallback = null;
      }
      element !== void 0 && element.removeEventListener("transitionend", animListener);
      animListener = null;
    }
    function begin(el, height, done) {
      if (height !== void 0) {
        el.style.height = `${height}px`;
      }
      el.style.transition = `height ${props.duration}ms cubic-bezier(.25, .8, .50, 1)`;
      animating = true;
      doneFn = done;
    }
    function end(el, event) {
      el.style.overflowY = null;
      el.style.height = null;
      el.style.transition = null;
      cleanup();
      event !== lastEvent && emit(event);
    }
    function onEnter(el, done) {
      let pos = 0;
      element = el;
      if (animating === true) {
        cleanup();
        pos = el.offsetHeight === el.scrollHeight ? 0 : void 0;
      } else {
        lastEvent = "hide";
        el.style.overflowY = "hidden";
      }
      begin(el, pos, done);
      timer = setTimeout(() => {
        timer = null;
        el.style.height = `${el.scrollHeight}px`;
        animListener = (evt) => {
          timerFallback = null;
          if (Object(evt) !== evt || evt.target === el) {
            end(el, "show");
          }
        };
        el.addEventListener("transitionend", animListener);
        timerFallback = setTimeout(animListener, props.duration * 1.1);
      }, 100);
    }
    function onLeave(el, done) {
      let pos;
      element = el;
      if (animating === true) {
        cleanup();
      } else {
        lastEvent = "show";
        el.style.overflowY = "hidden";
        pos = el.scrollHeight;
      }
      begin(el, pos, done);
      timer = setTimeout(() => {
        timer = null;
        el.style.height = 0;
        animListener = (evt) => {
          timerFallback = null;
          if (Object(evt) !== evt || evt.target === el) {
            end(el, "hide");
          }
        };
        el.addEventListener("transitionend", animListener);
        timerFallback = setTimeout(animListener, props.duration * 1.1);
      }, 100);
    }
    onBeforeUnmount(() => {
      animating === true && cleanup();
    });
    return () => h(Transition, {
      css: false,
      appear: props.appear,
      onEnter,
      onLeave
    }, slots.default);
  }
});
function getDepth(value) {
  if (value === false) {
    return 0;
  }
  if (value === true || value === void 0) {
    return 1;
  }
  const depth = parseInt(value, 10);
  return isNaN(depth) ? 0 : depth;
}
var ClosePopup = createDirective(
  {
    name: "close-popup",
    beforeMount(el, { value }) {
      const ctx = {
        depth: getDepth(value),
        handler(evt) {
          ctx.depth !== 0 && setTimeout(() => {
            const proxy = getPortalProxy(el);
            if (proxy !== void 0) {
              closePortals(proxy, evt, ctx.depth);
            }
          });
        },
        handlerKey(evt) {
          isKeyCode(evt, 13) === true && ctx.handler(evt);
        }
      };
      el.__qclosepopup = ctx;
      el.addEventListener("click", ctx.handler);
      el.addEventListener("keyup", ctx.handlerKey);
    },
    updated(el, { value, oldValue }) {
      if (value !== oldValue) {
        el.__qclosepopup.depth = getDepth(value);
      }
    },
    beforeUnmount(el) {
      const ctx = el.__qclosepopup;
      el.removeEventListener("click", ctx.handler);
      el.removeEventListener("keyup", ctx.handlerKey);
      delete el.__qclosepopup;
    }
  }
);
var QToggle = createComponent({
  name: "QToggle",
  props: {
    ...useCheckboxProps,
    icon: String,
    iconColor: String
  },
  emits: useCheckboxEmits,
  setup(props) {
    function getInner(isTrue, isIndeterminate) {
      const icon = computed(
        () => (isTrue.value === true ? props.checkedIcon : isIndeterminate.value === true ? props.indeterminateIcon : props.uncheckedIcon) || props.icon
      );
      const color = computed(() => isTrue.value === true ? props.iconColor : null);
      return () => [
        h("div", { class: "q-toggle__track" }),
        h(
          "div",
          {
            class: "q-toggle__thumb absolute flex flex-center no-wrap"
          },
          icon.value !== void 0 ? [
            h(QIcon, {
              name: icon.value,
              color: color.value
            })
          ] : void 0
        )
      ];
    }
    return useCheckbox("toggle", getInner);
  }
});
var ConfigSection_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$3 = { class: "row full-width" };
const _hoisted_2$3 = { class: "row justify-end" };
const __default__$3 = {
  props: ["state"],
  data() {
    return {
      readonly: ref(false),
      runtimeConfig: ""
    };
  },
  methods: {
    applyConfig() {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workloadName: this.state.name,
          agent: this.state.agent,
          runtimeConfig: this.runtimeConfig,
          restartPolicy: this.state.restartPolicy,
          runtime: this.state.runtime,
          tags: this.state.tags
        })
      };
      fetch("/updateConfig", requestOptions).then((response) => console.log(response.status));
      this.editConfig = false;
    }
  },
  mounted() {
    if (this.state.runtimeConfig) {
      this.runtimeConfig = this.state.runtimeConfig;
    } else {
      this.runtimeConfig = "";
    }
  }
};
const _sfc_main$3 = Object.assign(__default__$3, {
  name: "ConfigSection"
}, {
  __name: "ConfigSection",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", null, [
        createBaseVNode("div", _hoisted_1$3, [
          createVNode(QInput, {
            modelValue: _ctx.runtimeConfig,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.runtimeConfig = $event),
            class: "full-width-item",
            filled: "",
            autogrow: "",
            label: "Runtime Config",
            readonly: !_ctx.readonly
          }, null, 8, ["modelValue", "readonly"]),
          createVNode(QToggle, {
            modelValue: _ctx.readonly,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.readonly = $event),
            class: "full-width-item",
            label: "Edit"
          }, null, 8, ["modelValue"])
        ]),
        createBaseVNode("div", _hoisted_2$3, [
          createVNode(QBtn, {
            icon: "save",
            color: "secondary",
            onClick: _ctx.applyConfig
          }, null, 8, ["onClick"])
        ])
      ]);
    };
  }
});
const _hoisted_1$2 = { class: "row justify-between items-center" };
const _hoisted_2$2 = { class: "row justify-between items-center" };
const _hoisted_3$1 = { class: "text-h6" };
const _hoisted_4$1 = { class: "q-ml-sm" };
const __default__$2 = {
  props: ["workload", "desiredState", "dependencies", "workloadStates"],
  data() {
    return {
      confirm: false,
      currentSection: "",
      currentWorkloadName: "",
      workloadState: [],
      state: { runtimeConfig: "test" }
    };
  },
  methods: {
    deleteWorkload() {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([this.workload.instanceName.workloadName])
      };
      fetch("/deleteWorkloads", requestOptions).then((response) => console.log(response.status));
    },
    chooseExecutionColor(execState) {
      switch (execState) {
        case "running":
          return "green";
        case "failed":
          return "red";
        case "pending":
          return "yellow";
        case "removed":
          return "black";
        case "succeeded":
        case "unknown":
        default:
          return "gray";
      }
    },
    getDependencyText(workloadState) {
      const equivalentStates = {
        "ADD_COND_RUNNING": "RUNNING_OK",
        "RUNNING_OK": "ADD_COND_RUNNING"
      };
      let dependenciesList = [];
      if (workloadState && this.desiredState && this.desiredState.workloads && workloadState.instanceName && workloadState.instanceName.workloadName in this.desiredState.workloads) {
        let dependencies = this.desiredState.workloads[workloadState.instanceName.workloadName].dependencies;
        if (dependencies && Object.keys(dependencies).length > 0) {
          for (let dependency in dependencies) {
            let workload = this.workloadStates.find((workload2) => workload2.instanceName.workloadName === dependency);
            if (workload && workload.executionState) {
              let desiredValue = dependencies[dependency];
              let actualValue = workload.executionState[Object.keys(workload.executionState)[0]];
              let actualMappedValue = equivalentStates[actualValue] || actualValue;
              if (actualMappedValue === desiredValue) {
                dependenciesList.push({ text: `${dependency} -> ${desiredValue} is a match`, status: "match" });
              } else {
                dependenciesList.push({ text: `${dependency} -> ${desiredValue} does not match current state ${actualMappedValue}`, status: "no-match" });
              }
            } else {
              let value = dependencies[dependency];
              dependenciesList.push({ text: `${dependency} -> ${value} is missing`, status: "missing" });
            }
          }
        }
      }
      dependenciesList = dependenciesList.sort((a, b) => a.text.localeCompare(b.text));
      return dependenciesList.length > 0 ? dependenciesList : [{ text: "No dependencies", status: "match" }];
    },
    handleDependencyButtonClick() {
      this.currentSection = this.currentSection === "dependencies" ? "" : "dependencies";
    },
    checkDependency() {
      return (workloadState) => {
        const equivalentStates = {
          "ADD_COND_RUNNING": "RUNNING_OK",
          "RUNNING_OK": "ADD_COND_RUNNING"
        };
        if (workloadState && this.desiredState && this.desiredState.workloads && workloadState.instanceName && "workloadName" in workloadState.instanceName && workloadState.instanceName.workloadName in this.desiredState.workloads) {
          let dependencies = this.desiredState.workloads[workloadState.instanceName.workloadName].dependencies;
          if (dependencies && Object.keys(dependencies).length > 0) {
            let allFound = true;
            for (let dependency in dependencies) {
              let workload = this.workloadStates.find((workload2) => workload2.instanceName && "workloadName" in workload2.instanceName && workload2.instanceName.workloadName === dependency);
              if (workload && workload.executionState && Object.keys(workload.executionState).length > 0) {
                let desiredValue = dependencies[dependency];
                let actualValue = workload.executionState[Object.keys(workload.executionState)[0]];
                if (equivalentStates[actualValue]) {
                  actualValue = equivalentStates[actualValue];
                }
                if (actualValue !== desiredValue) {
                  allFound = false;
                  break;
                }
              } else {
                allFound = false;
                break;
              }
            }
            return allFound ? "found" : "missing";
          }
        }
        return false;
      };
    }
  },
  computed: {
    lastItemOfExecState() {
      const keys = Object.keys(this.workload.executionState);
      const lastKey = keys[keys.length - 1];
      return lastKey;
    }
  },
  mounted() {
    this.currentWorkloadName = this.workload.instanceName.workloadName;
    for (let [name, definition] of Object.entries(this.desiredState.workloads)) {
      definition = { ...definition };
      if (name === this.currentWorkloadName) {
        this.state = JSON.parse(JSON.stringify(definition));
        this.state["name"] = name;
        break;
      }
    }
  }
};
const _sfc_main$2 = Object.assign(__default__$2, {
  name: "WorkloadCard"
}, {
  __name: "WorkloadCard",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(QCard, { class: "bg-gray-4" }, {
          default: withCtx(() => [
            createVNode(QCardSection, null, {
              default: withCtx(() => [
                createBaseVNode("div", _hoisted_1$2, [
                  createBaseVNode("div", null, [
                    createVNode(QBadge, {
                      rounded: "",
                      color: _ctx.chooseExecutionColor(_ctx.lastItemOfExecState),
                      class: "q-mr-sm"
                    }, null, 8, ["color"]),
                    createTextVNode(toDisplayString(_ctx.lastItemOfExecState), 1)
                  ]),
                  createVNode(QBtn, {
                    flat: "",
                    round: "",
                    icon: "close",
                    size: "xs",
                    color: "negative",
                    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.confirm = true)
                  })
                ]),
                createBaseVNode("div", _hoisted_2$2, [
                  createBaseVNode("div", _hoisted_3$1, toDisplayString(__props.workload.instanceName.workloadName), 1),
                  createBaseVNode("div", null, toDisplayString(__props.workload.instanceName.agentName), 1)
                ]),
                createVNode(QSeparator),
                (openBlock(true), createElementBlock(Fragment, null, renderList(__props.desiredState.workloads[__props.workload.instanceName.workloadName].tags, (tag) => {
                  return openBlock(), createElementBlock("div", {
                    key: tag.key
                  }, [
                    createVNode(QBadge, {
                      color: "secondary",
                      label: tag.key + ": " + tag.value
                    }, null, 8, ["label"])
                  ]);
                }), 128)),
                createVNode(QCardActions, { class: "row justify-end" }, {
                  default: withCtx(() => [
                    createVNode(QBtn, {
                      rounded: "",
                      icon: "mediation",
                      color: "primary small",
                      onClick: _cache[1] || (_cache[1] = ($event) => _ctx.currentSection = _ctx.currentSection === "dependencies" ? "" : "dependencies")
                    }),
                    createVNode(QBtn, {
                      rounded: "",
                      icon: "settings",
                      color: "secondary small",
                      onClick: _cache[2] || (_cache[2] = ($event) => _ctx.currentSection = _ctx.currentSection === "config" ? "" : "config")
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            createVNode(QSeparator),
            createVNode(QSlideTransition, null, {
              default: withCtx(() => [
                _ctx.currentSection === "dependencies" ? (openBlock(), createBlock(QCardSection, { key: 0 }, {
                  default: withCtx(() => [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(__props.workloadStates.filter((ws) => ws.instanceName.workloadName === _ctx.currentWorkloadName), (workloadState) => {
                      return openBlock(), createElementBlock("div", {
                        key: workloadState.instanceName.workloadName
                      }, [
                        createBaseVNode("div", null, [
                          createVNode(QBadge, {
                            rounded: "",
                            color: workloadState.executionState[Object.keys(workloadState.executionState)[0]] === "RUNNING_OK" ? "positive" : "negative",
                            class: "q-mr-sm"
                          }, null, 8, ["color"]),
                          createTextVNode(" " + toDisplayString(workloadState.executionState[Object.keys(workloadState.executionState)[0]]), 1)
                        ]),
                        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.getDependencyText(workloadState), (dependency) => {
                          return openBlock(), createElementBlock("div", {
                            key: dependency.text
                          }, [
                            createVNode(QBadge, {
                              rounded: "",
                              color: dependency.status === "match" ? "positive" : "negative",
                              class: "q-mr-sm"
                            }, null, 8, ["color"]),
                            createTextVNode(" " + toDisplayString(dependency.text), 1)
                          ]);
                        }), 128))
                      ]);
                    }), 128))
                  ]),
                  _: 1
                })) : createCommentVNode("", true),
                _ctx.currentSection === "config" ? (openBlock(), createBlock(QCardSection, { key: 1 }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$3, { state: _ctx.state }, null, 8, ["state"])
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        createVNode(QDialog, {
          modelValue: _ctx.confirm,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.confirm = $event),
          persistent: ""
        }, {
          default: withCtx(() => [
            createVNode(QCard, null, {
              default: withCtx(() => [
                createVNode(QCardSection, { class: "row items-center" }, {
                  default: withCtx(() => [
                    createVNode(QAvatar, {
                      icon: "warning",
                      size: "xs",
                      color: "primary",
                      "text-color": "white"
                    }),
                    createBaseVNode("span", _hoisted_4$1, 'You are about to delete "' + toDisplayString(__props.workload.instanceName.workloadName) + '"', 1)
                  ]),
                  _: 1
                }),
                createVNode(QCardActions, { align: "right" }, {
                  default: withCtx(() => [
                    withDirectives(createVNode(QBtn, {
                      flat: "",
                      label: "Cancel",
                      color: "primary"
                    }, null, 512), [
                      [ClosePopup]
                    ]),
                    withDirectives(createVNode(QBtn, {
                      flat: "",
                      label: "Delete",
                      color: "negative",
                      onClick: _ctx.deleteWorkload
                    }, null, 8, ["onClick"]), [
                      [ClosePopup]
                    ])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ], 64);
    };
  }
});
const _hoisted_1$1 = /* @__PURE__ */ createBaseVNode("div", { class: "text-h5 text-white q-my-xs" }, "Add Workload", -1);
const _hoisted_2$1 = {
  class: "q-gutter-md",
  style: { "max-width": "420px" }
};
const __default__$1 = {
  props: {
    value: Boolean
  },
  data() {
    return {
      workloadName: "",
      agent: null,
      agentsList: ["agent_A", "agent_B", "agent_C"],
      runtimeConfig: 'image: IMAGE_NAME \ncommandOptions: ["flag", "value"]',
      tags: '{"key1": "value1", "key2": "value2"}',
      restartPolicy: "NEVER",
      runtime: "podman",
      options: ["NEVER", "ALWAYS", "ON_FAILURE"]
    };
  },
  methods: {
    submit() {
      var tags_list = [];
      if (this.tags != "") {
        var json = JSON.parse(this.tags);
        Object.keys(json).forEach(function(key) {
          tags_list.push({ "key": key, "value": json[key] });
        });
      }
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workloadName: this.workloadName,
          agent: this.agent,
          runtime: this.runtime,
          tags: tags_list,
          restartPolicy: this.restartPolicy,
          runtimeConfig: this.runtimeConfig
        })
      };
      fetch("/addNewWorkload", requestOptions).then((response) => {
        console.log(response.status);
        this.$q.notify("Workload Added");
      });
    },
    close() {
      this.showDialog = false;
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
const _sfc_main$1 = Object.assign(__default__$1, {
  name: "AddWorkloadDialog"
}, {
  __name: "AddWorkloadDialog",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(QDialog, {
        modelValue: _ctx.showDialog,
        "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => _ctx.showDialog = $event),
        class: "q-px-sm q-pb-md"
      }, {
        default: withCtx(() => [
          createVNode(QCard, {
            class: "bg-gray-4",
            style: { "width": "450px" }
          }, {
            default: withCtx(() => [
              createVNode(QCardSection, { class: "row items-center bg-secondary" }, {
                default: withCtx(() => [
                  _hoisted_1$1,
                  createVNode(QSpace),
                  withDirectives(createVNode(QBtn, {
                    icon: "close",
                    color: "white",
                    flat: "",
                    round: "",
                    dense: "",
                    onClick: _ctx.close
                  }, null, 8, ["onClick"]), [
                    [ClosePopup]
                  ])
                ]),
                _: 1
              }),
              createVNode(QCardSection, { class: "q-pa-md" }, {
                default: withCtx(() => [
                  createBaseVNode("div", _hoisted_2$1, [
                    createVNode(QInput, {
                      filled: "",
                      modelValue: _ctx.workloadName,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.workloadName = $event),
                      label: "Workload Name"
                    }, null, 8, ["modelValue"]),
                    createVNode(QSelect, {
                      filled: "",
                      modelValue: _ctx.agent,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.agent = $event),
                      options: _ctx.agentsList,
                      label: "Agent",
                      style: { "width": "300px" }
                    }, null, 8, ["modelValue", "options"]),
                    createVNode(QInput, {
                      filled: "",
                      modelValue: _ctx.runtime,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.runtime = $event),
                      label: "Runtime"
                    }, null, 8, ["modelValue"]),
                    createVNode(QSelect, {
                      filled: "",
                      modelValue: _ctx.restartPolicy,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.restartPolicy = $event),
                      options: _ctx.options,
                      label: "restartPolicy"
                    }, null, 8, ["modelValue", "options"]),
                    createVNode(QInput, {
                      filled: "",
                      modelValue: _ctx.tags,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => _ctx.tags = $event),
                      label: "tags"
                    }, null, 8, ["modelValue"]),
                    createVNode(QInput, {
                      modelValue: _ctx.runtimeConfig,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => _ctx.runtimeConfig = $event),
                      label: "Runtime Config",
                      filled: "",
                      autogrow: ""
                    }, null, 8, ["modelValue"])
                  ]),
                  createVNode(QCardActions, { class: "row justify-end" }, {
                    default: withCtx(() => [
                      withDirectives(createVNode(QBtn, {
                        icon: "add",
                        color: "secondary",
                        label: "Add",
                        onClick: _ctx.submit
                      }, null, 8, ["onClick"]), [
                        [ClosePopup]
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]);
    };
  }
});
const _hoisted_1 = { class: "row justify-between items-center q-pa-md" };
const _hoisted_2 = { class: "text-h5" };
const _hoisted_3 = { class: "row justify-between" };
const _hoisted_4 = { class: "q-pa-md row q-gutter-md" };
const _hoisted_5 = { class: "q-pa-lg flex flex-center" };
const __default__ = {
  data() {
    return {
      search: "",
      workloads: [],
      dependencies: [],
      addworkload: false,
      filterState: "all",
      options: ["all", "running", "pending", "failed", "succeeded", "stopping"],
      desiredState: {},
      currentPage: 1,
      pageSize: 9
    };
  },
  methods: {
    loadState() {
      fetch("/completeState").then((response) => {
        if (!response.ok) {
          if (response.status == 405) {
            console.log("User not logged in. Changing to Login Page.");
            this.changeView("login");
          }
          return Promise.reject(response);
        } else {
          return response.json();
        }
      }).then((json) => {
        console.log("loadState");
        console.log(json);
        let completeState = null, workloads = null;
        if (json && json.response && json.response.completeState && json.response.completeState.workloadStates) {
          completeState = json.response.completeState;
          this.workloads = completeState.workloadStates;
          if (completeState.desiredState) {
            this.desiredState = completeState.desiredState;
            if (completeState.desiredState.workloads) {
              workloads = completeState.desiredState.workloads;
            }
          }
        }
        if (workloads) {
          const dependencies = [];
          for (let [workloadName, workloadDefinition] of Object.entries(workloads)) {
            if ("dependencies" in workloadDefinition) {
              for (let [dependency, condition] of Object.entries(workloadDefinition.dependencies)) {
                dependencies.push({
                  source: workloadName,
                  target: dependency,
                  type: condition
                });
              }
            }
          }
          EventBus.emit("update-dependencies", dependencies);
        }
      }).catch((error) => {
        console.log("There has been a problem with your fetch operation: ", error.message);
      });
    },
    toggle(id) {
      this.showConfig[id] = !this.showConfig[id];
    },
    updatePage(page) {
      this.currentPage = page;
    },
    getLastItemOfExecState(execState) {
      const keys = Object.keys(execState);
      const lastKey = keys[keys.length - 1];
      return lastKey;
    }
  },
  computed: {
    sortedWorkloads() {
      return this.workloads.sort((a, b) => a.instanceName.workloadName.localeCompare(b.instanceName.workloadName));
    },
    filteredWorkloads() {
      if (!this.search && !this.filterState) {
        return this.sortedWorkloads;
      }
      return this.sortedWorkloads.filter((workload) => {
        console.log(workload);
        let search = this.search.toLowerCase();
        let workloadName = workload.instanceName.workloadName.toLowerCase();
        let agentName = workload.instanceName.agentName.toLowerCase();
        let desiredState = this.desiredState.workloads[workload.instanceName.workloadName];
        if (!desiredState) {
          return false;
        }
        let runtimeConfig = desiredState.runtimeConfig.toLowerCase();
        let tagKeyExists = false;
        let tagValueExists = false;
        if ("tags" in desiredState) {
          let tags = desiredState.tags;
          tagKeyExists = tags.some((item) => item.key.toLowerCase().includes(search));
          tagValueExists = tags.some((item) => item.value.toLowerCase().includes(search));
        }
        let execStateFits = false;
        if (this.filterState == "all") {
          execStateFits = true;
        } else if (this.filterState == this.getLastItemOfExecState(workload.executionState)) {
          execStateFits = true;
        }
        return (workloadName.includes(search) || agentName.includes(search) || runtimeConfig.includes(search) || tagKeyExists || tagValueExists) && execStateFits;
      });
    },
    paginatedWorkloads() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredWorkloads.slice(start, end);
    },
    maxPages() {
      return Math.ceil(this.filteredWorkloads.length / this.pageSize);
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.loadState();
    }, 2e3);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  }
};
const _sfc_main = Object.assign(__default__, {
  name: "WorkloadsView"
}, {
  __name: "WorkloadsView",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(QPage, { padding: "" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createBaseVNode("div", null, [
              createBaseVNode("div", _hoisted_2, [
                createTextVNode("Workloads "),
                createVNode(QBtn, {
                  small: "",
                  round: "",
                  color: "secondary",
                  icon: "add",
                  onClick: _cache[0] || (_cache[0] = ($event) => _ctx.addworkload = true),
                  style: { "margin-left": "20px" }
                })
              ])
            ]),
            createBaseVNode("div", _hoisted_3, [
              createVNode(QInput, {
                modelValue: _ctx.search,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.search = $event),
                placeholder: "Search...",
                filled: "",
                dense: "",
                debounce: "300"
              }, null, 8, ["modelValue"]),
              createVNode(QSelect, {
                style: { "width": "125px", "margin-left": "10px" },
                filled: "",
                modelValue: _ctx.filterState,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.filterState = $event),
                options: _ctx.options,
                label: "State Filter"
              }, null, 8, ["modelValue", "options"])
            ])
          ]),
          createVNode(_sfc_main$1, {
            modelValue: _ctx.addworkload,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.addworkload = $event)
          }, null, 8, ["modelValue"]),
          createBaseVNode("div", _hoisted_4, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.paginatedWorkloads, (workload) => {
              return openBlock(), createElementBlock("div", {
                class: "col-md-3",
                key: workload.instanceName.id
              }, [
                createVNode(_sfc_main$2, {
                  workload,
                  workloadStates: _ctx.workloads,
                  desiredState: _ctx.desiredState,
                  dependencies: _ctx.dependencies
                }, null, 8, ["workload", "workloadStates", "desiredState", "dependencies"])
              ]);
            }), 128))
          ]),
          createBaseVNode("div", _hoisted_5, [
            createVNode(QPagination, {
              modelValue: _ctx.currentPage,
              "onUpdate:modelValue": [
                _cache[4] || (_cache[4] = ($event) => _ctx.currentPage = $event),
                _ctx.updatePage
              ],
              max: _ctx.maxPages
            }, null, 8, ["modelValue", "max", "onUpdate:modelValue"])
          ])
        ]),
        _: 1
      });
    };
  }
});
export { _sfc_main as default };

import { c as createComponent, a as computed, h, b as hSlot, g as getCurrentInstance, v as openBlock, H as createElementBlock, E as createVNode, y as withCtx, F as createTextVNode, $ as QIcon } from "./index.81c1eb7b.js";
import { u as useDarkProps, a as useDark } from "./use-dark.1833eca7.js";
var QBanner = createComponent({
  name: "QBanner",
  props: {
    ...useDarkProps,
    inlineActions: Boolean,
    dense: Boolean,
    rounded: Boolean
  },
  setup(props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const isDark = useDark(props, $q);
    const classes = computed(
      () => "q-banner row items-center" + (props.dense === true ? " q-banner--dense" : "") + (isDark.value === true ? " q-banner--dark q-dark" : "") + (props.rounded === true ? " rounded-borders" : "")
    );
    const actionClass = computed(
      () => `q-banner__actions row items-center justify-end col-${props.inlineActions === true ? "auto" : "all"}`
    );
    return () => {
      const child = [
        h("div", {
          class: "q-banner__avatar col-auto row items-center self-start"
        }, hSlot(slots.avatar)),
        h("div", {
          class: "q-banner__content col text-body2"
        }, hSlot(slots.default))
      ];
      const actions = hSlot(slots.action);
      actions !== void 0 && child.push(
        h("div", { class: actionClass.value }, actions)
      );
      return h("div", {
        class: classes.value + (props.inlineActions === false && actions !== void 0 ? " q-banner--top-padding" : ""),
        role: "alert"
      }, child);
    };
  }
});
const _hoisted_1 = { class: "q-pa-md q-gutter-sm" };
const _sfc_main = Object.assign({
  name: "NotLoggedInView"
}, {
  __name: "NotLoggedInView",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(QBanner, { class: "bg-grey text-white q-mt-xl" }, {
          default: withCtx(() => [
            createTextVNode(" Welcome to the Ankaios Dashboard. Log in and take off! "),
            createVNode(QIcon, {
              size: "sm",
              class: "q-ml-xs",
              name: "rocket_launch"
            })
          ]),
          _: 1
        })
      ]);
    };
  }
});
export { _sfc_main as default };

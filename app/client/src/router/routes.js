const routes = [
  {
    path: "/",
    redirect: { path: "/nologin" },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/home",
        component: () => import("components/HomeView.vue"),
      },
      {
        path: "/workloads",
        component: () => import("components/WorkloadsView.vue"),
      },
      {
        path: "/debug",
        component: () => import("components/DebugView.vue"),
      },
      {
        path: "/about",
        component: () => import("components/AboutView.vue"),
      },
      {
        path: "/nologin",
        component: () => import("components/NotLoggedInView.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

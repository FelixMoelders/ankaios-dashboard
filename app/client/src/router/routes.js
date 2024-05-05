const routes = [
  {
    path: "/",
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
        path: "/dependencygraph",
        component: () => import("components/DependencyGraphView.vue"),
      },
      {
        path: "/about",
        component: () => import("components/AboutView.vue"),
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

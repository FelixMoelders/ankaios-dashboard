function guardRoutes(to, from, next) {
  fetch("/checkAuthentication").then(function (res) {
    if (res.status == 200) {
      next();
    } else if (res.status == 401) {
      next("/nologin");
    }
  });
}

const routes = [
  {
    path: "/",
    redirect: { path: "/nologin" },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/home",
        beforeEnter: guardRoutes,
        component: () => import("components/HomeView.vue"),
      },
      {
        path: "/workloads",
        beforeEnter: guardRoutes,
        component: () => import("components/WorkloadsView.vue"),
      },
      {
        path: "/dependencies",
        beforeEnter: guardRoutes,
        component: () => import("components/DependencyGraphView.vue"),
      },
      {
        path: "/about",
        beforeEnter: guardRoutes,
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

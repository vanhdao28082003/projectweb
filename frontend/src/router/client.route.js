
const requireClientAuth = (to, from, next) => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('tokenUser')).split('=')[1];
      if (token) {
        next();
      } else {
        next('/auth/login');
      }
    } catch (error) {
      next('/auth/login');
    }
  };


const clientRoutes = [
    {
        path: "/books",
        name: "book-client",
        component: () => import("@/views/client/pages/books/ClientBook.vue"),
        beforeEnter: requireClientAuth
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/client/pages/books/ClientNotFound.vue"),
    },
    {
        path: "/reader/register",
        name: "register-client",
        component: () => import("@/views/client/pages/register/ClientRegister.vue"),
    },
    {
        path: "/auth/login",
        name: "login-client",
        component: () => import("@/views/client/pages/login/ClientLogin.vue"),
    },
    {
        path: "/reader/borrow",
        name: "borrow-client",
        component: () => import("@/views/client/pages/books/BorrowBook.vue"),
        beforeEnter: requireClientAuth
      },
      {
        path: "/reader/account",
        name: "account-client",
        component: () => import("@/views/client/pages/books/ClientAccount.vue"),
        beforeEnter: requireClientAuth
    },
    {
        path: "/reader/borrow/:id",
        name: "borrow-book",
        component: () => import("@/views/client/pages/books/ClientBorrow.vue"),
        beforeEnter: requireClientAuth
    },
]

export default clientRoutes;
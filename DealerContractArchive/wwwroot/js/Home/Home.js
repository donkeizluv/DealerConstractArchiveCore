//innit router
var router = new VueRouter({
    mode: 'history',
    base: 'Home',
    //root: window.location.href,
    routes: [
        { name: 'Default', path: '/', component: ContractsListing },
        { name: 'Index', path: '/Index', component: ContractsListing }, //retuns default page = 1
        { name: 'Login', path: '/Login', component: Login }
        //{ path: '/:page/:type/:contains', component: ContractsListing }
    ]
});
//resgister
Vue.use(VueRouter);
Vue.use(VeeValidate);

//start vue instance
var vm = new Vue({
    el: "#app",
    router: router,
});

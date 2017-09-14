const GetContractsListApiUrl = "/api/HomeApi/GetContractViewerModel?";
const AddContractApiUrl = "/api/HomeApi/AddNewContract";
const UploadContractApiUrl = "/api/HomeApi/UploadScan";
const GetScanPdfApiUrl = "/Scan/index?contractId=";
const GetDocumentApiUrl = "/Document/GetDocument?";
const CurrentHost = window.location.protocol + '//' + window.location.host;


//innit router
var router = new VueRouter({
    mode: 'history',
    base: 'Home/Index',
    root: window.location.href,
    routes: [
        { name: 'default', path: '/', component: ContractsListing } //retuns default page = 1
        //{ path: '/:page', component: ContractsListing },
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

    components: {
        'newcontract-modal': NewContractModal,
        'upload-modal': UploadModal,
        'printdocument-modal': PrintDocumentModal
    },

    mounted: function () {
        this.Innit();
    },

    data: {
        //may not need to store this
        ContractViewerModel: [],
        ContractModels: [],
        TotalRows: 0,
        TotalPages: 0,
        OnPage: 0,
        DocumentNames: [],

        SelectedFilterValue: 2,
        SearchString: "",

        ShowAddContractModal: false,
        ShowUploadModal: false,
        ShowDocumentModal: false,
        UploadToContractId: -1,
        ShowDocumentForId: -1
    },

    computed: {
        HasFilter: function () {
            var type = this.$data.SelectedFilterValue;
            var contains = this.$data.SearchString;
            if (type !== undefined && contains.length > 0) {
                return true;
            }
            return false;
        },

        ContractsListingApiPrefix: function () {
            return CurrentHost + GetContractsListApiUrl;
        },

        GetCurrentContractsListingApi: function () {
            var page = this.$data.OnPage;
            if (page < 1 || page == null) page = 1;
            var type = this.$data.SelectedFilterValue;
            var contains = this.$data.SearchString;
            var apiSuffix = "page=" + page;
            apiSuffix = apiSuffix + "&filter=" + this.HasFilter;
            if (this.HasFilter) {
                this.$data.SelectedFilterValue = type;
                this.$data.SearchString = contains;
                apiSuffix = apiSuffix + "&type=" + type + "&contains=" + contains;
            }
            return this.ContractsListingApiPrefix + apiSuffix;
        }
    },
    //notify router changes
    watch: {
        $route: function(to, from) {
            //console.log(to);
            //updates on backkey
            this.$data.SearchString = to.query.contains;
            this.$data.SelectedFilterValue = to.query.type;
            this.$data.OnPage = to.query.page;
            this.LoadContracts(this.GetCurrentContractsListingApi);
        }
    },

    methods: {
        //innit app
        Innit: function () {
            //restore page on pasted link
            //var page = router.history.current.params.page;
            var page = router.history.current.query.page;
            if (page < 1 || page == null) page = 1;
            var type = router.history.current.query.type;
            if (type == undefined)
                type = 2; //default select filter: Name
            var contains = router.history.current.query.contains;
            if (contains == undefined)
                contains = "";
            //restores
            this.$data.OnPage = page;
            this.$data.SearchString = contains;
            this.$data.SelectedFilterValue = type;
            this.LoadContracts(this.GetCurrentContractsListingApi);
        },
        //load contracts on startup
        LoadContracts: function (url) {
            var that = this;
            //console.log(url);
            axios.get(url)
                .then(function (response) {
                    that.$data.ContractViewerModel = response.data;
                    that.$data.ContractModels = response.data.ContractModels;
                    that.$data.DocumentNames = response.data.DocumentNames;
                    that.UpdatePagination();
                })
                .catch(function (error) {
                    console.log(error);
                    console.log("Failed to fetch model");
                });
        },

        //update paging
        UpdatePagination: function () {
            this.$data.TotalPages = this.$data.ContractViewerModel.TotalPages;
            this.$data.TotalRows = this.$data.ContractViewerModel.TotalRows;
        },

        //contract grid row clicked
        DataRowClicked: function (clickContract) {
            alert(clickContract.Name);
        },

        //add new row btn clicked
        AddNewContractClicked: function () {
            this.$data.ShowAddContractModal = true;
        },
        //open new tab show scan
        OpenNewScanPage: function (id) {
            var url = CurrentHost + GetScanPdfApiUrl + id;
            //console.log(url);
            window.open(url);
        },

        ShowUploadModalHandler: function (id) {
            this.$data.ShowUploadModal = true;
            this.$data.UploadToContractId = id;
        },
        PrinDocumentModalHandler: function (id) {
            this.$data.ShowDocumentModal = true;
            this.$data.ShowDocumentForId = id;
        },
        OnCloseUploadModal: function () {
            this.$data.ShowUploadModal = false;
            this.LoadContracts(this.GetCurrentContractsListingApi);
        },

        SearchButtonClicked: function () {
            //back to page 1 on search
            this.$data.OnPage = 1;
            router.push({ path: '/', query: this.GetSearchQuery(1) });

        },
        PageNavClicked: function (page) {
            ////router.push({ path: `${page}/${type}/${contains}` })
            this.$data.OnPage = page;
            router.push({ path: '/', query: this.GetSearchQuery(page) });

        },

        GetSearchQuery: function (pageNumber) {
            return {
                page: pageNumber,
                filter: this.HasFilter,
                type: this.$data.SelectedFilterValue,
                contains: this.$data.SearchString
            };
        }
    }

});

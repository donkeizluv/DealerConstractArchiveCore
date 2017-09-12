
const GetContractsListApiUrl = "/api/HomeApi/GetContractViewerModel?";
const AddContractApiUrl = "/api/HomeApi/AddNewContract";
const UploadContractApiUrl = "/api/HomeApi/UploadScan";

var ContractsListing = {
    name: 'ContractsListing',
    template: '#Contracts-Listing-Template',

    props: {
        contracts: {},
        currentpage: 0,
        totalpages: 0,
        totalrows: 0
    },

    data: function () {
        //do other shit here
        return {
            //not sure how this works
            //display: this.contracts
        };
    },
    methods: {
        ChangePageClicked: function (page) {
            //request app to fetch new page
            this.$emit('changepageclicked', page);
        }

    }
};
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

//upload modal component
Vue.component('upload-modal', {
    template: '#uploadscanned-modal-template',
    //props: parent data -> no mutate
    //data: personal data -> do whatever want!

    data: function(){
        return {
            options: {
                method: 'post',
                uploadMultiple: false,
                url: this.GetUploadScanApi(5),
                paramName: 'file',
                maxFilesize: 10,
                maxFiles: 1,
                acceptedFiles: {
                    extensions: ['application/pdf'],
                    message: 'You are uploading an invalid file'
                }
            },
            Uploading: 0,
            Progress: 0,
            Filename: "",
            Status: "..."
        };
    },
    computed: {
        progressStyle: function () {
            return {
                width: this.$data.Progress + '%'
            };
        }
    },

    methods: {
        GetUploadScanApi: function (id) {
            return UploadContractApiUrl + "?contractId=" + id;
        },
        //showsucsess: function (file) {
        //    console.log(file);
        //},
        addedfile: function (file) {
            this.$data.Uploading = 1;
            this.$data.Filename = file.name;
        },
        uploadcompleted: function (file, status, xhr) {
            console.log(xhr);
            if (status != 'success') {
                if (xhr.status == 500)
                    this.$data.Status = "Server error!";
                else
                    this.$data.Status = xhr.response;
            }
            else
                this.$data.Status = 'Success!';
            //disable upload
            this.$data.Uploading = 0;
            this.$data.Progress = 0;
        },
        progresschange(progress, totalBytes, bytesSent) {
            console.log(progress);
            this.$dat.Progress = progress;
        }
    }
});

//new contract modal component
Vue.component('newcontract-modal', {
    template: '#addcontract-modal-template',
    //props: parent data -> no mutate
    //data: personal data -> do whatever want!
    data: function () {
        return {
            Name: "",
            Phone: "",
            Address: "",
            TaxId: "",
            Commission: 0,
            Status: "",
            AddingContract: 0
        };
    },

    methods: {
        AddContract: function () {
            var that = this;
            //ref: http://vee-validate.logaretm.com/
            that.$validator.validateAll().then((result) => {
                if (!result) {
                    // eslint-disable-next-line
                    that.SetStatus("Errors in inputs.");
                    return;
                }
                that.SetStatus("Adding contracts....");
                that.DoAddContract();
            });


        },

        DoAddContract: function () {
            var that = this;
            that.$data.AddingContract = 1;
            var url = window.ServerUrl + AddContractApiUrl;
            axios.post(url, {
                Name: that.$data.Name,
                Address: that.$data.Address,
                Phone: that.$data.Phone,
                TaxId: that.$data.TaxId,
                Commission: that.$data.Commission,
                Effective: true,
                UserId: 1, //demo: admin user
                ScannedContractUrl: null
            })
                .then(function (response) {
                    console.log(response);
                    that.SetStatus("Success!");
                    that.$data.AddingContract = 0;
                    that.ClearData();
                })
                .catch(function (error) {
                    console.log(error);
                    that.SetStatus("Fail to add contract, status: " + error.response.status);
                    that.$data.AddingContract = 0;
                    that.ClearData();
                });
        },
        ClearData: function () {
            this.$data.Name = "";
            this.$data.Phone = "";
            this.$data.Address = "";
            this.$data.TaxId = "";
            this.$data.Commission = 0;
            this.errors.clear();
            this.$validator.reset();
        },
        SetStatus: function (message) {
            this.$data.Status = message;
        }
    }
});

//start vue instance
var vm = new Vue({
    el: "#app",
    router: router,
    mounted: function () {
        this.Innit();
    },

    data: {
        ContractViewerModel: {},
        ContractModels: {},
        TotalRows: 0,
        TotalPages: 0,
        OnPage: 0,

        SelectedFilterValue: 2,
        SearchString: "",

        ShowAddContractModal: false,
        ShowUploadModal: false
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
        ApiPrefix: function () {
            return window.location.href + GetContractsListApiUrl;
        },
        GetCurrentApi: function () {
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
            return this.ApiPrefix + apiSuffix;
        }
    },
    //notify router changes
    watch: {
        $route: function(to, from) {
            console.log(to);
            //updates on backkey
            this.$data.SearchString = to.query.contains;
            this.$data.SelectedFilterValue = to.query.type;
            this.$data.OnPage = to.query.page;
            this.LoadContracts(this.GetCurrentApi);
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
            this.LoadContracts(this.GetCurrentApi);
        },
        //load contracts on startup
        LoadContracts: function (url) {
            var that = this;
            console.log(url);
            axios.get(url)
                .then(function (response) {
                    that.$data.ContractViewerModel = response.data;
                    that.$data.ContractModels = response.data.ContractModels;
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

        UploadClicked: function () {
            this.$data.ShowUploadModal = true;
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

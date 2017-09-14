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
        },
        UploadContractClicked: function (id) {
            this.$emit('uploadcontractclicked', id);
        },
        OpenScanPdfClicked: function (id) {
            this.$emit('openscannedpdfclicked', id);
        },
        PrintDocumentClicked: function (id) {
            this.$emit('printdocumentclicked', id);
        }

    }
};
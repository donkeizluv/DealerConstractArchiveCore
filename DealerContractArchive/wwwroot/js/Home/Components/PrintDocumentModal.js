//show document modal
var PrintDocumentModal = {
    name: 'printdocument-modal',
    template: '#printdocument-modal-template',
    props: ['docnames', 'contractid'],
    data: function () {
        return {
            SelectedDoc: ""
        };
    },

    methods: {
        OpenPrintPage: function () {
            var url = CurrentHost + GetDocumentApiUrl +
                "contractid=" +
                this.contractid +
                "&docName=" +
                this.$data.SelectedDoc;

            //console.log(url);
            window.open(url);
        }
    }
}
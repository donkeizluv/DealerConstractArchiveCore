//upload modal component
var UploadModal = {
    name: 'upload-modal',
    template: '#uploadscanned-modal-template',
    //props: parent data -> no mutate
    //data: personal data -> do whatever want!
    //https://github.com/thetutlage/vue-clip


    //doesnt work!
    computed: {
        progressStyle: function () {
            return {
                width: this.$data.Progress + '%'
            };
        }
    },
    props: ['contractid'],
    data: function () {
        return {
            options: {
                method: 'post',
                uploadMultiple: false,
                url: UploadContractApiUrl + "?contractId=" + this.contractid,
                paramName: 'file',
                maxFilesize: 10,
                maxFiles: 1,
                acceptedFiles: {
                    extensions: ['application/pdf'],
                    message: 'You are uploading an invalid file!'
                }
            },
            Uploading: 0,
            Progress: 0,
            Filename: "",
            Status: "",
            Uploadable: true

        };
    },
    methods: {
        //showsucsess: function (file) {
        //    console.log(file);
        //},
        addedfile: function (file) {
            this.$data.Uploading = 1;
            this.$data.Filename = file.name;
        },
        uploadcompleted: function (file, status, xhr) {
            //console.log(xhr);
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
            this.$data.Uploadable = false;
            //this.$emit('uploadcontractcompleted');
        },
        //doesnt work!
        uploadprogresschange: function (progress, totalBytes, bytesSent) {
            //console.log(progress);
            this.$data.Progress = progress;
        }
    }
};
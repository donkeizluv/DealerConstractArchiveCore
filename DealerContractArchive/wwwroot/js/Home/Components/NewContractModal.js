//new contract modal component
var NewContractModal = {
    name: 'newcontract-modal',
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
            that.$validator.validateAll().then(function (result) {
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
            var url = CurrentHost + AddContractApiUrl;
            console.log(url);
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
                    //console.log(response);
                    that.SetStatus("Success!");
                    that.$data.AddingContract = 0;
                    that.ClearData();
                })
                .catch(function (error) {
                    //console.log(error);
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
}
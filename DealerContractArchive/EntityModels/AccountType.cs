using System;
using System.Collections.Generic;

namespace DealerContractArchive.EntityModels
{
    public partial class AccountType
    {
        public AccountType()
        {
            Users = new HashSet<Users>();
        }

        public string Type { get; set; }
        public string Description { get; set; }

        public ICollection<Users> Users { get; set; }
    }
}

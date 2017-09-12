using System;
using System.Collections.Generic;

namespace DealerContractArchive.EntityModels
{
    public partial class Users
    {
        public Users()
        {
            Contracts = new HashSet<Contracts>();
        }

        public int UserId { get; set; }
        public string Username { get; set; }
        public string Type { get; set; }
        public bool Active { get; set; }
        public string Description { get; set; }

        public AccountType TypeNavigation { get; set; }
        public ICollection<Contracts> Contracts { get; set; }
    }
}

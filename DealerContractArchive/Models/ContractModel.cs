﻿using DealerContractArchive.EntityModels;

namespace DealContractArchiver.Models
{
    public class ContractModel
    {
        public int ContractId { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string TaxId { get; set; }
        public double Commission { get; set; }
        public string ScannedContractUrl { get; set; }
        public bool Effective { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }

        public virtual Users User { get; set; }
    }
}
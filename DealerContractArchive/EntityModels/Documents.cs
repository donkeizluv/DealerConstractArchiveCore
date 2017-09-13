using System;
using System.Collections.Generic;

namespace DealerContractArchive.EntityModels
{
    public partial class Documents
    {
        public int DocumentId { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string Filename { get; set; }
        public bool Effective { get; set; }
    }
}

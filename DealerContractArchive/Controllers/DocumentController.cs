using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DealerContractArchive.EntityModels;
using DealerContractArchive.Helper;
using System.IO;
using Microsoft.AspNetCore.Mvc.Formatters;
using System.Net.Http.Headers;
using System.Text;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DealerContractArchive.Controllers
{
    public class DocumentController : Controller
    {
        [HttpGet]
        //[Produces("text/html")] //doesnt work
        public IActionResult GetDocument([FromQuery] int contractId, [FromQuery] string docName)
        {
            using (var context = new DealerContractContext())
            {
                var contract = context.Contracts.FirstOrDefault(c => c.ContractId == contractId);
                if (contract == null) return BadRequest();

                var document = context.Documents.FirstOrDefault(c => string.Compare(docName, c.Name, true) == 0);
                if (document == null) return BadRequest();
                var docFullPath = EnviromentHelper.GetDocumentFullPath(document.Filename);

                if (!(new FileInfo(docFullPath)).Exists) return NoContent();
                string docContent = System.IO.File.ReadAllText(docFullPath);
                docContent = FillContractDocument(docContent, contract);
                //return Content(docContent);
                return Content(docContent, "text/html", Encoding.UTF8);
            }
            //return View();
        }

        //Name: @name
        //Address: @address
        //Tax Id: @taxid

        private string FillContractDocument(string documentContent, Contracts contract)
        {
            var content = documentContent.Replace("@name", contract.Name);
            content = content.Replace("@address", contract.Address);
            content = content.Replace("@taxid", contract.TaxId);
            return content;
        }
    }
}

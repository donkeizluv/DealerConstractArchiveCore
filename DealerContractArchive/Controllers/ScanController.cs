using Microsoft.AspNetCore.Mvc;
using DealerContractArchive.Models;
using System.Diagnostics;
using System.IO;
using DealerContractArchive.Helper;
using DealerContractArchive.EntityModels;
using System.Linq;
using Microsoft.AspNetCore.Http;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DealerContractArchive.Controllers
{
    public class ScanController : Controller
    {
        // GET: /<controller>/
        //https://docs.microsoft.com/en-us/aspnet/core/mvc/models/formatting
        public IActionResult Index([FromQuery] int? contractId)
        {
            if (contractId == null) return BadRequest();
            if((contractId?? -1) < 0) return BadRequest(); //auto increment index cant be negative
            int id = contractId ?? -1;
            int index;
            string dbFilename = string.Empty;
            using (var context = new DealerContractContext())
            {
                var contract = context.Contracts.FirstOrDefault(c => c.ContractId == id);
                if (contract == null) return BadRequest();
                index = contract.ContractId;
                dbFilename = contract.ScannedContractUrl;
                if (string.IsNullOrEmpty(dbFilename)) return BadRequest("This contract has not uploaded scan yet.");
            }
            string fullPath = EnviromentHelper.GetScanfileFullPath(dbFilename, index);
            if (!(new FileInfo(fullPath)).Exists) return NoContent();

            //https://stackoverflow.com/questions/42460198/return-file-in-asp-net-core-web-api
            var stream = new FileStreamResult(new FileStream(fullPath, FileMode.Open, FileAccess.Read), "application/pdf")
            {
                FileDownloadName = $"contract_{id}.pdf"
            };
            //to return file use File()
            var response = File(stream.FileStream, "application/pdf");
            return response;
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

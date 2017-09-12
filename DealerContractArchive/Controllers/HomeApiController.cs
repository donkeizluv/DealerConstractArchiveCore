using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DealContractArchiver.Models;
using DealerContractArchive.EntityModels;
using DealContractArchiver.Models.Helper;
using System.Diagnostics;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DealerContractArchive.Views
{
    [Route("api/[controller]")]
    public class HomeApiController : Controller
    {
        [HttpGet("GetContractViewerModel")]
        public ContractViewerModel GetContractViewerModel([FromQuery] int page = 1, [FromQuery] bool filter = false, [FromQuery] int type = 0, [FromQuery] string contains = "")
        {
            var model = new ContractViewerModel();
            //set model state
            var filterColumnName = FilterColumn.None;
            if (Enum.IsDefined(typeof(FilterColumn), type))
            {
                filterColumnName = (FilterColumn)type;
            }
            model.FilterType = filterColumnName.ToString();
            model.IsFilterApplied = filter;
            model.FilterString = contains;
            int totalRows;
            if (filter && !string.IsNullOrEmpty(contains))
            {
                model.ContractModels = GetFilteredConstractsQuery(filterColumnName, contains, page, out totalRows);
            }
            else
            {
                model.ContractModels = GetContracts(out totalRows, page);
            }
            model.UpdatePagination(totalRows);
            return model;
        }

        [HttpPost("AddNewContract")]
        public IActionResult AddNewContract([FromBody] ContractModel contract)
        {
            //NYI: validate data
            if (contract == null) return BadRequest();
            try
            {
                using (var context = new DealerContractContext())
                {
                    var newContract = new Contracts()
                    {
                        Name = contract.Name,
                        Address = contract.Address,
                        Phone = contract.Phone,
                        TaxId = contract.TaxId,
                        Commission = contract.Commission,
                        Effective = contract.Effective,
                        UserId = contract.UserId,
                        ScannedContractUrl = null
                    };
                    context.Contracts.Add(newContract);
                    int result = context.SaveChanges();
                    if (result > 0)
                    {
                        return Ok();
                    }

                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
#if DEBUG
                throw ex;
#endif
                return BadRequest();
            }
        }

        private List<ContractModel> GetFilteredConstractsQuery(FilterColumn filterCol, string filterString, int page, out int totalRows)
        {
            var list = new List<ContractModel>();
            using (var context = new DealerContractContext())
            {
                int excludedRows = (page - 1) * ContractViewerModel.ItemPerPage;
                string processedFilterString = filterString;
                if (filterCol == FilterColumn.Added) //convert username to int first
                {
                    var user = context.Users.Where(u => u.Username == filterString);
                    if (user == null || user.Count() < 1)
                        processedFilterString = "-1";
                    else
                        processedFilterString = user.First().UserId.ToString();
                }
                var query = context.Contracts
                    .OrderBy(c => c.ContractId)
                    .Where(ExpressionHelper.GetContainsExpression<Contracts>(filterCol.ToString(), processedFilterString));
                totalRows = query.Count();
                query = query.Skip(excludedRows).Take(ContractViewerModel.ItemPerPage);
                if (query.Any())
                {
                    list = (from c in query
                            select new ContractModel()
                            {
                                ContractId = c.ContractId,
                                Name = c.Name,
                                Address = c.Address,
                                Commission = c.Commission,
                                Effective = c.Effective,
                                Phone = c.Phone,
                                ScannedContractUrl = c.ScannedContractUrl,
                                TaxId = c.TaxId,
                                UserId = c.UserId,
                                Username = c.User.Username
                            }).ToList();

                }
#if DEBUG
                Debug.Print($"filterd list count: {list.Count}");
#endif

                return list;
            }
        }

        private List<ContractModel> GetContracts(out int totalRows, int pageNum = 1)
        {
            int getPage = pageNum < 1 ? 1 : pageNum;
            using (var context = new DealerContractContext())
            {
                totalRows = context.Contracts.Count();
                int excludedRows = (getPage - 1) * ContractViewerModel.ItemPerPage;
                var query = context.Contracts
                    .OrderBy(c => c.ContractId)
                    .Skip(excludedRows)
                    .Take(ContractViewerModel.ItemPerPage)
                    .AsQueryable();
                //copy to model
                //for some fucking reason, direct entity to json is a paint in the ass :/
                var list = (from c in query
                            select new ContractModel()
                            {
                                ContractId = c.ContractId,
                                Name = c.Name,
                                Address = c.Address,
                                Commission = c.Commission,
                                Effective = c.Effective,
                                Phone = c.Phone,
                                ScannedContractUrl = c.ScannedContractUrl,
                                TaxId = c.TaxId,
                                UserId = c.UserId,
                                Username = c.User.Username
                            }).ToList();
                if (list.Any())
                {
                    return list;
                }
                return null;
            }
        }
    }
}

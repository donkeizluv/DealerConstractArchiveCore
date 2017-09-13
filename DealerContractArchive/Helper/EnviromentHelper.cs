using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DealerContractArchive.Helper
{
    public static class EnviromentHelper
    {
        public static string ScanFolder = "UploadedScans";
        public static string DocumentFolder = "PrintDocument";
        public static string RootPath { get; set; }
        public static string ScanFilePathMaker(string fileName, int index)
        {
            return $"contract_{index}_{fileName}";
        }
        public static string GetScanfileFullPath(string fileName, int index)
        {
            return $"{RootPath}\\{ScanFolder}\\{fileName}";
        }
        public static string GetDocumentFullPath(string fileName)
        {
            return $"{RootPath}\\{DocumentFolder}\\{fileName}";
        }
    }
}

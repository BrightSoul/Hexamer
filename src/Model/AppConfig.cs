using Hexamer.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Hexamer.Model
{
    public class AppConfig
    {
        public string Name { get; set; }

        private string examsDataDirectory;
        public string ExamsDataDirectory {
            get
            {
                return examsDataDirectory;
            }
            set
            {
                examsDataDirectory = value.ToAbsolutePath();
            }
        }
        private string userDataDirectory;
        public string UserDataDirectory
        {
            get
            {
                return userDataDirectory;
            }
            set
            {
                userDataDirectory = value.ToAbsolutePath();
            }
        }
        public string[] SupportedLogins { get; set; }
        public string DefaultLocalization { get; set; }

        public static AppConfig FromConfiguration(IConfigurationRoot configuration)
        {
            return new AppConfig
            {
                ExamsDataDirectory = configuration["App:ExamsDataDirectory"],
                UserDataDirectory = configuration["App:UserDataDirectory"],
                Name = configuration["App:Name"],
                DefaultLocalization = configuration["App:DefaultLocalization"]
            };
        }
    }
}

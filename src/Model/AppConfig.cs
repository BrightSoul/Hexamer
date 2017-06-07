using Hexamer.Extensions;
using Microsoft.Extensions.Configuration;

namespace Hexamer.Model
{
    public class AppConfig
    {
        private readonly string contentRootPath;
        public AppConfig(string contentRootPath)
        {
            this.contentRootPath = contentRootPath;
        }
        public string Name { get; set; }

        private string examsDataDirectory;
        public string ExamsDataDirectory {
            get
            {
                return examsDataDirectory;
            }
            set
            {
                if (value == null)
                    return;
                examsDataDirectory = value.ToAbsolutePath(contentRootPath);
                examsDataDirectory.CreateDirectoryIfNotExists();
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
                if (value == null)
                    return;
                userDataDirectory = value.ToAbsolutePath(contentRootPath);
                userDataDirectory.CreateDirectoryIfNotExists();
            }
        }
        public string[] SupportedLogins { get; set; }
        public string AdministratorUsername { get; set; }
        public string AdministratorPassword { get; set; }
        public string DefaultLocalization { get; set; }
        public string AuthenticationScheme { get; set; }
        public string SlackClientId { get; set; }
        public string SlackSecret { get; set; }
        public string SlackTeamId { get; set; }
        public string SlackScope { get; set; }

        public static AppConfig FromConfiguration(IConfigurationRoot configuration, string contentRootPath)
        {
            var config = new AppConfig(contentRootPath);

            
                configuration.GetSection("App").Bind(config);
                /*ExamsDataDirectory = configuration["App:ExamsDataDirectory"],
                UserDataDirectory = configuration["App:UserDataDirectory"],
                Name = configuration["App:Name"],
                DefaultLocalization = configuration["App:DefaultLocalization"],
                AuthenticationScheme = configuration["App:AuthenticationScheme"],
                Administrators = configuration.GetSection("App:Administrators").Bi,
                SupportedLogins = configuration.GetSection("App:SupportedLogins"),
                SlackClientId = configuration["App:SlackClientId"],
                SlackSecret = configuration["App:SlackSecret"],
                SlackTeamId = configuration["App:SlackTeamId"],
                SlackScope = configuration["App:SlackScope"]*/
            return config;
        }
    }
}

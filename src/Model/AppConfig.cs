using Hexamer.Extensions;
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

        public string SlackClientId { get; set; }
        public string SlackSecret { get; set; }
        public string SlackTeamId { get; set; }
        public string SlackScope { get; set; }

        public static AppConfig FromConfiguration(IConfigurationRoot configuration)
        {
            return new AppConfig
            {
                ExamsDataDirectory = configuration["App:ExamsDataDirectory"],
                UserDataDirectory = configuration["App:UserDataDirectory"],
                Name = configuration["App:Name"],
                DefaultLocalization = configuration["App:DefaultLocalization"],
                SlackClientId = configuration["App:SlackClientId"],
                SlackSecret = configuration["App:SlackSecret"],
                SlackTeamId = configuration["App:SlackTeamId"],
                SlackScope = configuration["App:SlackScope"]
            };
        }
    }
}

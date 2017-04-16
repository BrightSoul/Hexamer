using Hexamer.Model;
using System.Threading.Tasks;
using System.Security.Claims;

namespace Hexamer.Services
{
    public class UserRepository : IUserRepository
    {
        private readonly string examDataDirectory;
        public UserRepository(AppConfig config)
        {
            examDataDirectory = config.ExamsDataDirectory;
        }

        public async Task CreateUserIfNotExists(ClaimsPrincipal claimsPrincipal)
        {
         //TODO   
        }
    }
}

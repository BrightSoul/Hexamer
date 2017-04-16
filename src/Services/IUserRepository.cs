using System.Threading.Tasks;
using System.Security.Claims;

namespace Hexamer.Services
{
    public interface IUserRepository
    {
        Task CreateUserIfNotExists(ClaimsPrincipal claimsPrincipal);
    }
}

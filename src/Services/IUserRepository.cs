using System.Threading.Tasks;
using System.Security.Claims;
using Hexamer.Model;
using System.Collections.Generic;

namespace Hexamer.Services
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAll();
        Task CreateUserIfNotExists(ClaimsPrincipal claimsPrincipal);
    }
}

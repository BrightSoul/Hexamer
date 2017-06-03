using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Hexamer.Model;
using Microsoft.AspNetCore.Http;

namespace Hexamer.Services {
    public interface IAuthority {
        Task<ClaimsPrincipal> SignIn(IUser user, HttpContext context);
    }
}
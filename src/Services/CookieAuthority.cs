using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Hexamer.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Authentication;

namespace Hexamer.Services {
    public class CookieAuthority : IAuthority
    {
        private readonly string authenticationScheme;
        private readonly TimeSpan cookieDuration;
        private readonly AppConfig config;
        public CookieAuthority(AppConfig config)
        {
            authenticationScheme = config.AuthenticationScheme;
            cookieDuration = TimeSpan.FromDays(90);
            this.config = config;
        }
        public async Task<ClaimsPrincipal> SignIn(IUser user, HttpContext context)
        {
            var claims = CreateClaims(user);
            var principal = CreatePrincipal(claims);
            await SignIn(principal, context);
            return principal;
        }

        private IEnumerable<Claim> CreateClaims (IUser user) {
            yield return new Claim(ClaimTypes.Name, user.Username);
            yield return new Claim(ClaimTypes.GivenName, user.Name);
            yield return new Claim(ClaimTypes.Email, user.Email);
            yield return new Claim(ClaimTypes.Uri, user.ImageUrl);
            yield return new Claim(ClaimTypes.Thumbprint, CreateToken(user));

            if (IsAdministrator(user)) {
                yield return new Claim(ClaimTypes.Role, "Administrator");
            }
        }

        private string CreateToken(IUser user) {
            return DateTime.Now.ToString("yyyyMMdd.HHmmss.fff");
        }
        private bool IsAdministrator(IUser user) {
            var administrator = config.AdministratorUsername ?? string.Empty;
            return administrator.Equals(user.Username, StringComparison.OrdinalIgnoreCase);
        }

        private ClaimsPrincipal CreatePrincipal(IEnumerable<Claim> claims) {
            var identity = new ClaimsIdentity(claims, authenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            return principal;
        }
        private async Task SignIn(ClaimsPrincipal principal, HttpContext context) {
            var properties = new AuthenticationProperties() {
                  IsPersistent = true,
                  ExpiresUtc = DateTime.Now.Add(cookieDuration)  
            };
            await context.Authentication.SignInAsync(authenticationScheme, principal, properties);
        }
    }
}
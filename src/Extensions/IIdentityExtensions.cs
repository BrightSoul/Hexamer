using System.Security.Claims;
using System.Security.Principal;
using Microsoft.AspNetCore.Http;

namespace Hexamer.Extensions {
    public static class IIdentityExtensions {
        public static string Token(this IIdentity identity, HttpContext context = null) {
            var claimsIdentity = identity as ClaimsIdentity;
            var tokenClaim = claimsIdentity?.FindFirst(claim => claim.Type == ClaimTypes.Thumbprint);
            var token = tokenClaim?.Value ?? string.Empty;
            if (context != null) {
                token = $"{context.Connection.RemoteIpAddress}|{token}";
            }
            return token;
        }
    }
}
using Hexamer.Model;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace Hexamer.Extensions
{
    public static class RequestExtensions
    {
        public static string GetLanguage(this HttpRequest request, string defaultLanguage)
        {
            var acceptLanguage = request.GetTypedHeaders().AcceptLanguage.FirstOrDefault();
            return acceptLanguage?.Value ?? defaultLanguage;
        }
    }
}

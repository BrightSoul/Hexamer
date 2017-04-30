using Hexamer.Model;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace Hexamer.Extensions
{
    public static class RequestExtensions
    {
        public static string GetLanguage(this HttpRequest request)
        {
            var acceptLanguage = request.GetTypedHeaders().AcceptLanguage.FirstOrDefault();
            if (acceptLanguage == null)
                return "En";
            
            return acceptLanguage.Value;
        }
    }
}

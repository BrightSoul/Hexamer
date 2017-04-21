using System.IO;
using System.Reflection;

namespace Hexamer.Extensions
{
    public static class StringExtensions
    {
        public static string ToAbsolutePath(this string path)
        {
            if (Path.IsPathRooted(path))
                return path;

            var rootDirectory = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
            return Path.Combine(rootDirectory, path);
        }
        public static void CreateDirectoryIfNotExists(this string path)
        {
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
        }
    }
}

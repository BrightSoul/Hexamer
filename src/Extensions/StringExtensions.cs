using System.IO;
using System.Reflection;

namespace Hexamer.Extensions
{
    public static class StringExtensions
    {
        public static string ToAbsolutePath(this string path, string rootPath)
        {
            if (Path.IsPathRooted(path))
                return path;

            return Path.Combine(rootPath, path);
        }
        public static void CreateDirectoryIfNotExists(this string path)
        {
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
        }
    }
}

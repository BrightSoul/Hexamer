using Hexamer.Model;
using System.Threading.Tasks;
using System.Security.Claims;
using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;

namespace Hexamer.Services
{
    public class UserRepository : IUserRepository
    {
        private readonly string examDataDirectory;
        private readonly AppConfig config;
        public UserRepository(AppConfig config)
        {
            examDataDirectory = config.ExamsDataDirectory;
            this.config = config;
        }

        public async Task CreateUserIfNotExists(ClaimsPrincipal claimsPrincipal)
        {
            //TODO
            await Task.CompletedTask;
        }

        public Task<IEnumerable<User>> GetAll()
        {
            return Task.FromResult(Directory
                .EnumerateFiles(config.UserDataDirectory, "*.db")
                .Select(db => new User { Name = Path.GetFileNameWithoutExtension(db) })
            );
        }

        public async Task<bool> ToggleBlock(string username) {
            var lockFile = Path.Combine(config.UserDataDirectory, $"{username}.lock");
            if (File.Exists(lockFile)) {
                File.Delete(lockFile);
                return false;
            } else {
                File.AppendAllText(lockFile, DateTimeOffset.Now.ToString());
                return true;
            }
        }
    }
}
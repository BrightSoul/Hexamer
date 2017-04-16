using Hexamer.Model;

namespace Hexamer.Results {
    public class UserResult {
        public bool IsAuthenticated { get; set; }
        public User User { get; set; }
    }
}
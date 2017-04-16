using System.Linq;

namespace Hexamer.Model
{
    public class User
    {
        public string Email
        {
            get; set;
        }
        public string Username
        {
            get
            {
                return Email.Split('@').First();
            }
        }
        public string FullName { get; set; }
    }
}

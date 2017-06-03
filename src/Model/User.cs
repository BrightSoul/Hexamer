using System;

namespace Hexamer.Model
{
    public class User : IUser
    {
        
        public string ImageUrl { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        public string Username { get; set; }
    }
}

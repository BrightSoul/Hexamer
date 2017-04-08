using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

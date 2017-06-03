using System;
using Hexamer.Model.Results;
using Newtonsoft.Json;
namespace Hexamer.Model.Results
{
    public class SlackUser : IUser
    {
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
        [JsonProperty(PropertyName = "email")]
        public string Email { get; set; }
        [JsonProperty(PropertyName = "image_72")]
        public string ImageUrl { get; set; }
        public string Username
        {
            get
            {
                string username = Email;
                if (string.IsNullOrEmpty(username))
                    return "Anonymous" + Guid.NewGuid();

                return username;
            }
        }
    }
}
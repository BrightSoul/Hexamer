using System;
using Newtonsoft.Json;

namespace Hexamer.Model.Results
{
    public class SlackAuthorizationResult {

        public SlackAuthorizationResult()
        {
            this.User = new SlackUser();
        }
        public class SlackUser {
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
        [JsonProperty(PropertyName = "email")]
        public string Email {get; set; }
        [JsonProperty(PropertyName = "image_72")]
        public string ImageUrl {get;set;}
        public string Username {
            get {
                string username = Email;
                /*if (!string.IsNullOrEmpty(Email)){
                    username = Email.Split('@')[0];
                }*/
                if (string.IsNullOrEmpty(username))
                    return "Anonymous" + Guid.NewGuid();

                return username; 
            }
        }
        }

        [JsonProperty(PropertyName = "ok")]
        public bool Ok {get; set;}
        [JsonProperty(PropertyName = "access_token")]
        public string AccessToken {get; set;}
        [JsonProperty(PropertyName = "scope")]
        public string Scope {get;set;}
        
        [JsonProperty(PropertyName = "user")]
        public SlackUser User {get;set;}
    }
}
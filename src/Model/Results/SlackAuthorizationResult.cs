using System;
using Newtonsoft.Json;

namespace Hexamer.Model.Results
{
    public class SlackAuthorizationResult {

        public SlackAuthorizationResult()
        {
            this.User = new SlackUser();
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
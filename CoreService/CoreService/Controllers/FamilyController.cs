using CoreService.Modelle;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoreService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FamilyController : ControllerBase
    {
        const string FamilyServiceUrl = "http://host.docker.internal:3204/family";
        const string authServiceUrl = "http://host.docker.internal:3001/api/user";


        // GET: api/<FamilyController>/userid
        // Returns all Families for specific userId
        [HttpGet("{id}")]
        public async Task<string> Get(string id)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                HttpResponseMessage response = await client.GetAsync(FamilyServiceUrl+"/getmyfamilies/"+id);

                if (response.IsSuccessStatusCode)
                {
                    return response.Content.ReadAsStringAsync().Result;
                }

                return null;
            }
        }

        [Route("getfamilymembers/{id}")]
        [HttpGet]
        public async Task<List<User>> GetMembersForFamily(string id)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                HttpResponseMessage response = await client.GetAsync(FamilyServiceUrl+"/"+id+"/members");

                if (response.IsSuccessStatusCode)
                {
                    var content = response.Content.ReadAsStringAsync().Result;
                    var ResponseModel = JsonConvert.DeserializeObject<ResponseModel<string[]>>(content);
                    List<User> users = new List<User>();
                    
                    foreach(var userid in ResponseModel.Result)
                    {
                        var userResponse = await client.GetAsync(authServiceUrl + "/getUserById/" + userid + "?clientId=Jan");
                        var userContent = userResponse.Content.ReadAsStringAsync().Result;
                        var user = JsonConvert.DeserializeObject<User>(userContent);

                        users.Add(user);
                    }
                    return users;
                }

                return null;
            }
        }


        // POST api/<FamilyController>
        [HttpPost]
        public async Task<string> Post([FromBody] Family family)
        {
            using (HttpClient client = new HttpClient())
            {
                var SerializedFamily = JsonConvert.SerializeObject(family);
                var Familycontent = new StringContent(SerializedFamily, Encoding.UTF8, "application/json");
                var response = await client.PostAsync(FamilyServiceUrl, Familycontent);
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                var ResponseModel = JsonConvert.DeserializeObject<ResponseModel<bool>>(content);

                foreach(var member in family.members)
                {
                    await client.PostAsync(FamilyServiceUrl+"/"+ ResponseModel.ResponseId + "/" + member, null);
                    response.EnsureSuccessStatusCode();
                }
                return content;
            }
        }

        //Neue Shoppinglist in der Familie
        [HttpPost]
        [Route ("AddShoppingList")]
        public async Task<ShoppingList> Post([FromBody] ShoppingList list)
        {
            using (HttpClient client = new HttpClient())
            {
                var SerializedList = JsonConvert.SerializeObject(list);
                var shoppinglistcontent = new StringContent(SerializedList, Encoding.UTF8, "application/json");
                var response = await client.PostAsync(FamilyServiceUrl + "/" + list.family, shoppinglistcontent);
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                var createdList = JsonConvert.DeserializeObject<ShoppingList>(content);
                return createdList;
            }
        }

        [HttpPost]
        [Route("AddMemberToFamily/{family}/{user}")]
        public async Task<User> AddMemberToFamily(string family, string user)
        {

            using (HttpClient client = new HttpClient())
            {
                var response = await client.PostAsync(FamilyServiceUrl + "/" + family + "/" + user, null);
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                var ResponseModel = JsonConvert.DeserializeObject<ResponseModel<bool>>(content);

                var responseUser = await client.GetAsync(authServiceUrl + "/getUserById/" + user + "?clientId=Jan");
                var contentUser = await responseUser.Content.ReadAsStringAsync();

                return JsonConvert.DeserializeObject<User>(contentUser);
            }
        }

        // Delete family
        // DELETE api/<FamilyController>/5
        [HttpDelete("{id}")]
        public async Task<string> Delete(string id)
        {
            using (HttpClient client = new HttpClient())
            {
                var response = await client.DeleteAsync(FamilyServiceUrl + "/" + id);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsStringAsync();

            }
        }

        // Remove/ Delete user from family
        // DELETE api/family/familyid/userid
        [HttpDelete]
        [Route("removefamilymember/{family}/{member}")]
        public async Task<string> RemoveFamilyMember(string family, string member)
        {
            using (HttpClient client = new HttpClient())
            {
                var response = await client.DeleteAsync(FamilyServiceUrl + "/" + family + "/" + member);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsStringAsync();

            }
        }
    }
}

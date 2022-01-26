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

        // GET: api/<FamilyController>
        [HttpGet]
        public async Task<string> Get()
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                HttpResponseMessage response = await client.GetAsync(FamilyServiceUrl);

                if (response.IsSuccessStatusCode)
                {
                    Console.Write("Success");
                    return response.Content.ReadAsStringAsync().Result;
                }
                return null;

            }
        }

        // GET api/<FamilyController>/5
        [HttpGet("{id}")]
        public async Task<string> Get(int id)
        {
            return null;


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
                var ResponseModel = JsonConvert.DeserializeObject<ResponseModel>(content);

                foreach(var member in family.members)
                {
                    var FamilyMemberContent = new StringContent(member, Encoding.UTF8, "application/json");

                    var memberResponse = await client.PostAsync(FamilyServiceUrl+"/"+ResponseModel.ResponseId+"/"+member, null);
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

        // PUT api/<FamilyController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<FamilyController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}

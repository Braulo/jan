using CoreService.Modelle;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoreService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingController : ControllerBase
    {
        const string ShoppingServiceUrl = "http://localhost:3204/shopping";

        // GET: api/<ShoppingController>
        [HttpGet]
        public IEnumerable<string> GetShoppingListItems()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<ShoppingController>/5
        [HttpGet("{id}")]
        public async Task<string> GetShoppingListItems(string id)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                HttpResponseMessage response = await client.GetAsync(ShoppingServiceUrl+"/"+id);

                if (response.IsSuccessStatusCode)
                {
                    Console.Write("Success");
                    return response.Content.ReadAsStringAsync().Result;
                }
                return null;

            }
        }

        // POST api/<ShoppingController>
        [HttpPost]
        public async void Post([FromBody] ShoppingList list)
        {
          
        }

        // PUT api/<ShoppingController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {

        }

        // DELETE api/<ShoppingController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}

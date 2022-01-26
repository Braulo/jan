namespace CoreService.Modelle
{
    public class User
    {
        private string _Id;
        private string _UserName;
        private string _Email;
        private string _AccessToken;

        public string id { get => _Id; set => _Id = value; }
        public string username { get => _UserName; set => _UserName = value; }
        public string email { get => _Email; set => _Email = value; }
        public string accessToken { get => _AccessToken; set => _AccessToken = value; }
    }
}

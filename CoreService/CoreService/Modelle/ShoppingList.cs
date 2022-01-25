namespace CoreService.Modelle
{
    public class ShoppingList
    {
        private string _Id;
        private string _Owner;
        private string _Family;
        private string _Title;
        private string _Thumbnail;
        private bool _Status;

        public string id { get => _Id; set => _Id = value; }
        public string owner { get => _Owner; set => _Owner = value; }
        public string family { get => _Family; set => _Family = value; }
        public string title { get => _Title; set => _Title = value; }
        public string thumbnail { get => _Thumbnail; set => _Thumbnail = value; }
        public bool status { get => _Status; set => _Status = value; }
    }
}

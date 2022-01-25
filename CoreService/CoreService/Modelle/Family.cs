namespace CoreService.Modelle
{
    public class Family
    {
        private string _id;
        private string _title;
        private string _image;
        private string[] _members;

        public string id { get => _id; set => _id = value; }
        public string title { get => _title; set => _title = value; }
        public string image { get => _image; set => _image = value; }
        public string[] members { get => _members; set => _members = value; }
    }
}

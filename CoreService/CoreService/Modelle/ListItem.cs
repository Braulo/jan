namespace CoreService.Modelle
{
    public class ListItem
    {
        private string _Id;
        private string _Owner;
        private string _Family;
        private string _ShoppingList;
        private bool _Status;
        private string _Name;

        public string id { get => _Id; set => _Id = value; }
        public string owner { get => _Owner; set => _Owner = value; }
        public string family { get => _Family; set => _Family = value; }
        public string shoppingList { get => _ShoppingList; set => _ShoppingList = value; }
        public bool status { get => _Status; set => _Status = value; }
        public string name { get => _Name; set => _Name = value; }
    }
}

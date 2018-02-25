namespace Admin.Models.DbModels
{
    public class Bet
    {
        public int ID { get; set; }

        public string Address { get; set; }

        public Event Event { get; set; }
    }
}

namespace Admin.Models.DbModels
{
    using System;

    public class Event
    {
        public int ID { get; set; }
        public string Address { get; set; }
        public string HomeTeamName { get; set; }
        public string AwayTeamName { get; set; }
        public bool IsOpen { get; set; }
        public DateTime ExpireAt { get; set; }
    }
}

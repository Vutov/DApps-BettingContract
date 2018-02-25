namespace Admin.Models.DbModels
{
    using System;
    using System.Collections.Generic;

    public class Event
    {
        public Event()
        {
            this.Bets = new HashSet<Bet>();
        }

        public int ID { get; set; }
        public string Address { get; set; }
        public string HomeTeamName { get; set; }
        public string AwayTeamName { get; set; }
        public bool IsOpen { get; set; }
        public DateTime ExpireAt { get; set; }
        public virtual ICollection<Bet> Bets { get; set; }
        public bool IsDeleted { get; set; }
    }
}

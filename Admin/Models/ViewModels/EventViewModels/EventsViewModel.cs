using System.Collections.Generic;

namespace Admin.Models.ViewModels.EventViewModels
{
    using DbModels;

    public class EventsViewModel
    {
        public IEnumerable<Event> Events { get; set; }
    }
}

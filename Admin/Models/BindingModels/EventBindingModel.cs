namespace Admin.Models.BindingModels
{
    using System.ComponentModel.DataAnnotations;

    public class EventBindingModel
    {
        [Required]
        public string HomeTeamName { get; set; }
        [Required]
        public string AwayTeamName { get; set; }
    }
}

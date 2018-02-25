namespace Admin.Models.BindingModels
{
    using System.ComponentModel.DataAnnotations;

    public class BetBindingModel
    {
        [Required]
        public string EventAddress { get; set; }

        [Required]
        public string CustomerAddress { get; set; }
    }
}

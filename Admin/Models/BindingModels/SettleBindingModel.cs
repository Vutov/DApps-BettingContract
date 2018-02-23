namespace Admin.Models.BindingModels
{
    using System.ComponentModel.DataAnnotations;

    public class SettleBindingModel
    {
        [Required]
        public string Address { get; set; }

        [Range(1, 3)]
        public int Winner { get; set; }
    }
}

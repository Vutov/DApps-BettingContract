namespace Admin.Controllers
{
    using System;
    using System.Diagnostics;
    using Microsoft.AspNetCore.Mvc;
    using Models.ViewModels;

    public class HomeController : BaseController
    {
        public HomeController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        public IActionResult Index()
        {
            return this.View();
        }
        
        public IActionResult Error()
        {
            return this.View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? this.HttpContext.TraceIdentifier });
        }
    }
}

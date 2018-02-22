namespace Admin.Controllers
{
    using System;
    using Data;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.DependencyInjection;
    using Models.DbModels;

    public class BaseController : Controller
    {
        public BaseController(IServiceProvider serviceProvider)
        {
            this.ServiceProvider = serviceProvider;
            this.DbContext = serviceProvider.GetService<InvoiceDbContext>();
            this.UserManager = serviceProvider.GetService<UserManager<User>>();
        }

        public UserManager<User> UserManager { get; set; }

        public InvoiceDbContext DbContext { get; set; }

        public IServiceProvider ServiceProvider { get; set; }
        protected User GetCurrentUser()
        {
            return this.UserManager.GetUserAsync(this.HttpContext.User).Result;
        }
    }
}

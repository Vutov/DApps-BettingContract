namespace Admin.Extensions
{
    using System;
    using Data;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.DependencyInjection;
    using Models.DbModels;

    public static class DbContextExtensions
    {
        public static InvoiceDbContext Initialize(this InvoiceDbContext context, IServiceProvider provider)
        {
            var userManager = provider.GetService<UserManager<User>>();
            // TODO Seed here

            return context;
        }
    }
}

using System;

namespace Admin.Controllers
{
    using System.Threading.Tasks;
    using Filters;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.DependencyInjection;
    using Models.BindingModels;
    using Services;

    [Route("Event")]
    public class EventController : BaseController
    {
        public EventController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        [Route("")]
        [HttpGet]
        public IActionResult Index()
        {
            return this.View();
        }

        [Route("Create")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ValidateModel("Index")]
        public async Task<IActionResult> Create(EventBindingModel model)
        {
            var eventService = this.ServiceProvider.GetService<EventService>();
            await eventService.CreateEvent(this.DbContext, model.HomeTeamName, model.AwayTeamName);
            return this.View("Index");
        }
    }
}

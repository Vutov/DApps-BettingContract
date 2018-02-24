namespace Admin.Controllers.Api
{
    using System;
    using System.Linq;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.DependencyInjection;
    using Services;

    [AllowAnonymous]
    [Route("api/event")]
    public class EventApiController : BaseController
    {
        public EventApiController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        [HttpGet]
        [Route("")]
        public IActionResult GetEvents()
        {
            var events = this.DbContext.Events
                .OrderByDescending(e => e.ID)
                .ToList();

            return this.Ok(events);
        }

        [HttpGet]
        [Route("abi")]
        public IActionResult GetAbi()
        {
            var service = this.ServiceProvider.GetService<EventService>();
            return this.Ok(service.GetAbi());
        }
    }
}

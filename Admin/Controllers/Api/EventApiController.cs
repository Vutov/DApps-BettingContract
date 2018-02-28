namespace Admin.Controllers.Api
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using Filters;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.DependencyInjection;
    using Models.BindingModels;
    using Models.DbModels;
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
                .Where(e => e.IsDeleted == false)
                .OrderByDescending(e => e.ID)
                .ToList();

            return this.Ok(events);
        }

        [HttpGet]
        [Route("abi")]
        public IActionResult GetAbi()
        {
            var service = this.ServiceProvider.GetService<ContractService>();
            return this.Ok(service.GetContractDefinition().GetAbi());
        }

        [HttpPost]
        [Route("bet")]
        [ValidateApi]
        public IActionResult RegisterBet(BetBindingModel model)
        {
            var evnt = this.DbContext.Events.FirstOrDefault(e => e.Address == model.EventAddress);
            if (evnt != null)
            {
                evnt.Bets.Add(new Bet() { Address = model.CustomerAddress });
                this.DbContext.SaveChanges();
            }

            return this.Ok();
        }

        [HttpGet]
        [Route("bets/{address}")]
        [ValidateApi]
        public IActionResult GetBets([Required]string address)
        {
            var data = this.DbContext.Bets
                .Where(e => e.Address == address)
                .Where(e => e.Event.IsDeleted == false)
                .OrderByDescending(e => e.ID)
                .Select(b => new
                {
                    Address = b.Event.Address,
                    Title = $"{b.Event.HomeTeamName} vs {b.Event.AwayTeamName}"
                })
                .Distinct()
                .ToList();

            return this.Ok(data);
        }
    }
}

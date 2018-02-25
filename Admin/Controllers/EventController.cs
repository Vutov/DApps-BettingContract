namespace Admin.Controllers
{
    using System;
    using System.Linq;
    using Extensions;
    using Filters;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Models.BindingModels;
    using Models.DbModels;
    using Models.ViewModels.EventViewModels;
    using Services;

    [Authorize]
    [Route("Event")]
    public class EventController : BaseController
    {
        private readonly EventService _eventService;
        private readonly ILogger<EventController> _logger;

        public EventController(IServiceProvider serviceProvider) : base(serviceProvider)
        {

            _eventService = this.ServiceProvider.GetService<EventService>();
            _logger = this.ServiceProvider.GetService<ILogger<EventController>>();
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
        public IActionResult Create(EventBindingModel model)
        {
            var oracle = _eventService.GetSender();
            var result = _eventService.Deploy(oracle, model.HomeTeamName, model.AwayTeamName);
            if (result.Success == false)
            {
                this.ViewBag.ErrorMessage = "Deploy event failed";
                _logger.LogCritical($"Deploy event failed {result.GetListMessages()}");
                return this.View("Index");
            }

            var info = _eventService.GetEventInfo(result.Value);
            if (info.Success == false)
            {
                this.ViewBag.ErrorMessage = "Getting event info failed";
                _logger.LogCritical($"GetEventInfo failed {info.GetListMessages()}");
                return this.View("Index");
            }

            var dto = new Event()
            {
                Address = result.Value,
                AwayTeamName = info.Value.AwayTeamName,
                HomeTeamName = info.Value.HomeTeamName,
                IsOpen = info.Value.IsOpen,
                ExpireAt = DateTimeExtensions.UnixTimeStampToDateTime(info.Value.ExpireAt),
            };

            this.DbContext.Events.Add(dto);
            this.DbContext.SaveChanges();

            return this.RedirectToAction("ViewAll");
        }

        [Route("All")]
        [HttpGet]
        public IActionResult ViewAll()
        {
            var vm = new EventsViewModel()
            {
                Events = this.DbContext.Events.OrderByDescending(e => e.ID).ToList()
            };

            return this.View(vm);
        }

        [HttpPost]
        [Route("Balance")]
        public IActionResult GetBalance(string address)
        {
            var balance = _eventService.GetEventBalance(address);
            if (balance.Success)
            {
                return this.Ok(balance.Value);
            }

            this.ViewBag.ErrorMessage = "Get Balance failed";
            _logger.LogCritical($"GetEventBalance failed {balance.GetListMessages()}");
            return this.BadRequest();
        }

        [HttpPost]
        [Route("Settle")]
        [ValidateAntiForgeryToken]
        [ValidateModel("ViewAll")]
        public IActionResult Settle(SettleBindingModel model)
        {
            var settled = _eventService.SettleBet(model.Address, model.Winner);
            if (settled.Success == false)
            {
                _logger.LogCritical($"SettleBet failed {settled.GetListMessages()}");
                this.ViewBag.ErrorMessage = "Settlement failed";
            }

            var info = _eventService.GetEventInfo(model.Address);
            if (info.Success == false)
            {
                this.ViewBag.ErrorMessage = "Getting event info failed";
                _logger.LogCritical($"GetEventInfo failed {info.GetListMessages()}");
                return this.View("ViewAll", new EventsViewModel()
                {
                    Events = this.DbContext.Events.OrderByDescending(e => e.ID).ToList()
                });
            }

            var evnt = this.DbContext.Events.FirstOrDefault(e => e.Address == model.Address);
            if (evnt != null)
            {
                evnt.IsOpen = info.Value.IsOpen;
                this.DbContext.Events.Update(evnt);
                this.DbContext.SaveChanges();
            }

            return this.RedirectToAction("ViewAll");
        }

        [HttpPost]
        [Route("Close")]
        [ValidateAntiForgeryToken]
        [ValidateModel("ViewAll")]
        public IActionResult Close(string address)
        {
            var settled = _eventService.CloseExpiredEvent(address);
            if (settled.Success == false)
            {
                _logger.LogCritical($"CloseExpiredEvent failed {settled.GetListMessages()}");
                this.ViewBag.ErrorMessage = "Close Expired Event failed";
            }
            else
            {
                var evnt = this.DbContext.Events.FirstOrDefault(e => e.Address == address);
                if (evnt != null)
                {
                    evnt.IsDeleted = true;
                    this.DbContext.Events.Update(evnt);
                    this.DbContext.SaveChanges();
                }
            }

            return this.View("ViewAll", new EventsViewModel()
            {
                Events = this.DbContext.Events.OrderByDescending(e => e.ID).ToList()
            });
        }
    }
}

using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OurGames.Common.Logging;
using OurGames.Core.Model;
using OurGames.Repository;
using OurGames.UI.Models;

namespace OurGames.UI.Controllers
{
    [Route("api/[controller]")]
    public class LibraryController : Controller
    {
        private readonly OrderRepository _orderRepo;

        public LibraryController(DbContextOptions<OurGamesContext> dbContextOptions)
        {
            _orderRepo = new OrderRepository(dbContextOptions);
        }

        [HttpGet("[action]")]
        public JsonResult GetOrders(string uid)
        {
            try
            {
                var orders = _orderRepo.GetByUserUid(uid);

                var viewOrders = new List<OrderModel>();

                foreach (var order in orders)
                {                    
                    viewOrders.Add(new OrderModel
                    {
                       Id = order.Id,
                       GameId = order.GameId,
                       GameKey = order.GameKey,
                       Name = order.Game.Name,
                       OrderDate = order.OrderDate,
                       Value = order.Value,
                       ThumbnailLink = order.Game.ThumbnailLink,
                       Plataform = order.Plataform
                    });
                }

                return Json(new { orders = viewOrders, success = true });
            }
            catch (Exception ex)
            {
                Log.Error("Error while getting user orders.", ex);

                return Json(new { message = "Desculpe, não foi possível carregar essa página.", success = false });
            }
        }        
    }
}
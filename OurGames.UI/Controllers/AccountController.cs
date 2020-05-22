using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OurGames.Common.Logging;
using OurGames.Core.Model;
using OurGames.Repository;
using OurGames.UI.Models;

namespace OurGames.UI.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly CustomerRepository _customerRepo;

        public AccountController(DbContextOptions<OurGamesContext> dbContextOptions)
        {
            _customerRepo = new CustomerRepository(dbContextOptions);
        }

        [HttpPost("[action]")]
        public JsonResult AddOrUpdateUser(UserViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { message = "Desculpe, ocorreu um erro ao executar está ação.", success = false });
                }

                var customer = _customerRepo.GetBy(c => c.ProviderId == model.Uid).FirstOrDefault();

                var emailExists = false;

                if (!string.IsNullOrEmpty(model.Email))
                {
                    emailExists = _customerRepo.EmailExists(model.Email);
                }

                if (customer is null)
                {
                    if (emailExists)
                    {
                        return Json(new { message = "Este email já está cadastrado.", success = false });
                    }

                    _customerRepo.Create(new Customer
                    {
                        AccessLevelId = 1,
                        Email = model.Email,
                        Name = model.Name,
                        ProviderId = model.Uid
                    });
                }

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                Log.Error("Error on addOrUpdate.", ex);

                return Json(new { message = "Desculpe, ocorreu um erro ao executar está ação.", success = false });
            }
        }

        [HttpGet("[action]")]
        public JsonResult GetAccess(string uid)
        {
            try
            {
                if (!string.IsNullOrEmpty(uid))
                {
                    var access = _customerRepo.GetBy(c => c.ProviderId == uid).FirstOrDefault().AccessLevelId;

                    return Json(new { access, success = true });
                }
                else
                {
                    return Json(new { message = $"Bad Request {nameof(uid)} is required.", success = false });
                }
            }
            catch (Exception ex)
            {
                Log.Error("Error while getting access.", ex);

                return Json(new { message = "Desculpe, ocorreu um erro ao executar está ação.", success = false });
            }
        }

    }
}
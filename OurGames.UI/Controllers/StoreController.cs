using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OurGames.Common.Logging;
using OurGames.Core.Entity;
using OurGames.Core.Model;
using OurGames.Repository;
using OurGames.UI.Models;
using OurGames.UI.Services.Abstractions;

namespace OurGames.UI.Controllers
{
    [Route("api/[controller]")]
    public class StoreController : Controller
    {
        private readonly IPagSeguroPayment _pagSeguroService;

        private readonly GameRepository _gameRepo;

        private readonly CustomerRepository _customerRepo;

        private readonly IEmailSender _emailSender;

        private readonly OurGamesUIConfig _config;

        public StoreController(DbContextOptions<OurGamesContext> dbContextOptions, IPagSeguroPayment pagSeguro, IEmailSender emailSender, IOptions<OurGamesUIConfig> options)
        {
            _pagSeguroService = pagSeguro;

            _gameRepo = new GameRepository(dbContextOptions);

            _customerRepo = new CustomerRepository(dbContextOptions);

            _emailSender = emailSender;

            _config = options.Value;
        }

        [HttpGet("[action]")]
        public JsonResult Checkout(int? gameId, string uid)
        {
            try
            {
                if (!gameId.HasValue && string.IsNullOrEmpty(uid))
                {
                    return Json(new { message = "Desculpe, ocorreu um erro ao fazer o checkout.", success = false });
                }

                var game = _gameRepo.GetByKey(gameId);

                var user = _customerRepo.GetBy(c => c.ProviderId == uid).FirstOrDefault();

                if(game is null && user is null){
                    return Json(new { message = "Desculpe, ocorreu um erro ao fazer o checkout.", success = false });
                }

                var pagSeguroModel = new PagSeguroModel
                {
                    Amount = game.Price.ToString().Insert(game.Price.ToString().Length - 2, "."),
                    Name = game.Name,
                    Id = game.Id.ToString(),
                    SenderEmail = user.Email,
                    SenderName = user.Name
                };

                var redirectUrl = _pagSeguroService.GetPaymentURL(pagSeguroModel);

                return Json(new { redirectUrl, success = true });
            }
            catch (Exception ex)
            {
                Log.Error("Erro on checkout.", ex);

                return Json(new { message = "Desculpe, ocorreu um erro ao fazer o checkout.", success = false });
            }
        }

        [HttpPost("[action]")]
        public JsonResult Suport(SuportModel model)
        {
            try
            {
                var to = new MailAddress(_config.SuportEmail);

                var body = model.BodyText;

                var subject = model.Category;

                _emailSender.Send(to, body, subject, false);

                var prefix = model.Category == "Problema" ? "Seu" : "Sua";

                var send = model.Category == "Problema" ? "enviado" : "enviada";

                return Json(new { message = $"{prefix} {model.Category.ToLower()} foi {send} com sucesso, obrigado!", success = true });

            }
            catch (Exception ex)
            {
                Log.Error(String.Format("Erro ao enviar e-mail de suporte - assunto {0}", model.Category), ex);

                return Json(new { message = "Desculpe, não foi possível concluir esta ação!", success = false });
            }
        }

        [HttpGet("[action]")]
        public JsonResult SearchGames([FromQuery]string searchText)
        {
            try
            {
                var results = _gameRepo.SearchByName(searchText);
                
                var options = results.Select(r => new { label = r.Name, value = $"/game/{r.Id}" }).ToArray();

                return Json(options);
            }
            catch (Exception ex)
            {
                Log.Error("Error while searching items.", ex);

                return Json(new { message = "Desculpe não foi possível pesquisar NCMs.", success = false });
            }
        }

    }
}
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OurGames.Common.Logging;
using OurGames.Core.Model.Model;
using OurGames.Repository;
using OurGames.UI.Models;
using OurGames.UI.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;

namespace OurGames.UI.Controllers
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class GameController : Controller
    {
        private readonly GameRepository _gameRepo;

        private readonly CategoryRepository _categoryRepo;

        private readonly PlataformRepository _plataformRepo;

        private readonly CustomerFavoriteRepository _customerFavorite;

        private readonly string _mediaPrefix = "/static/media/";

        private readonly string _mediasPath;

        public GameController(DbContextOptions<OurGamesContext> dbContextOptions, IHostingEnvironment env)
        {
            _gameRepo = new GameRepository(dbContextOptions);

            _categoryRepo = new CategoryRepository(dbContextOptions);

            _plataformRepo = new PlataformRepository(dbContextOptions);

            _customerFavorite = new CustomerFavoriteRepository(dbContextOptions);

            _mediasPath = Path.Combine(env.WebRootPath, "static\\media");
        }

        [HttpPost("[action]")]
        public JsonResult Create(GameViewModel model)
        {
            try
            {
                var bgFilenameLastDot = model.BackgroundImage.FileName.LastIndexOf('.');

                var bgFileName = model.BackgroundImage.FileName.Insert(bgFilenameLastDot - 1, Guid.NewGuid().ToString());

                var thumbFilenameLatDot = model.Thumbnail.FileName.LastIndexOf('.');

                var thumbFilename = model.Thumbnail.FileName.Insert(thumbFilenameLatDot - 1, Guid.NewGuid().ToString());

                var bgPath = Path.Combine(_mediasPath, bgFileName);

                var thumbPath = Path.Combine(_mediasPath, thumbFilename);

                if (System.IO.File.Exists(bgPath))
                {
                    System.IO.File.Delete(bgPath);
                }

                using (var memoStream = new MemoryStream())
                {
                    model.BackgroundImage.CopyTo(memoStream);

                    System.IO.File.WriteAllBytes(bgPath, memoStream.ToArray());
                }

                if (System.IO.File.Exists(thumbPath))
                {
                    System.IO.File.Delete(thumbPath);
                }

                using (var memoStream = new MemoryStream())
                {
                    model.Thumbnail.CopyTo(memoStream);

                    System.IO.File.WriteAllBytes(thumbPath, memoStream.ToArray());
                }

                var entity = new Game
                {
                    Active = true,
                    CategoryGame = model.Categories.Select(c => new CategoryGame { CategoryId = c }).ToList(),
                    Description = model.Description,
                    Developer = model.Developer,
                    LaunchDate = model.LaunchDate,
                    Media = model.Videos.Select(v => new Media { Link = v, Type = "video" }).ToList(),
                    Price = model.Price,
                    Name = model.Name,
                    Publisher = model.Publisher,
                    Rating = model.Rating,
                    PlataformGame = model.Plataforms.Select(p => new PlataformGame { PlataformId = p }).ToList(),
                    Requirements = model.Requirements,
                    ThumbnailLink = _mediaPrefix + thumbFilename,
                    BackgroundLink = _mediaPrefix + bgFileName
                };

                _gameRepo.Create(entity);

                return Json(new { message = "Jogo criado com sucesso.", success = true });
            }
            catch (Exception ex)
            {
                Log.Error("Error while creating Game.", ex);

                return Json(new { message = "Desculpe, ocorreu um erro ao executar está ação.", success = false });
            }
        }

        [HttpGet("[action]")]
        public JsonResult GetGameData(int? id)
        {
            try
            {
                var game = _gameRepo.GetByKey(id);

                var viewModel = new GameViewModel
                {
                    Id = game.Id,
                    Active = game.Active,
                    BackgroundLink = game.BackgroundLink,
                    ThumbnailLink = game.ThumbnailLink,
                    Categories = game.CategoryGame.Select(c => c.Category.Id),
                    Plataforms = game.PlataformGame.Select(c => c.Plataform.Id),
                    CategoriesView = game.CategoryGame.Select(c => c.Category.Name),
                    PlataformsView = game.PlataformGame.Select(c => c.Plataform.Name),
                    Videos = game.Media.Where(m => m.Type.Equals("video")).Select(v => v.Link),
                    Description = game.Description,
                    Developer = game.Developer,
                    LaunchDate = game.LaunchDate,
                    Name = game.Name,
                    Price = game.Price,
                    Publisher = game.Publisher,
                    Rating = game.Rating,
                    Requirements = game.Requirements
                };

                return Json(new { game = viewModel, success = true });
            }
            catch (Exception ex)
            {
                Log.Error("Error while getting game data.", ex);

                return Json(new { message = "Desculpe, não foi possível carregar essa página.", success = false });
            }
        }

        [HttpPost("[action]")]
        public JsonResult Edit(GameViewModel model)
        {
            try
            {
                var game = _gameRepo.GetByKey(model.Id);

                if (game is null)
                {
                    return Json(new { message = "Desculpe, ocorreu um erro ao executar está ação.", success = false });
                }

                var bgPath = game.BackgroundLink;

                var thumbPath = game.ThumbnailLink;

                if (model.BackgroundImage != null)
                {
                    var bgFilenameLastDot = model.BackgroundImage.FileName.LastIndexOf('.');

                    var bgFileName = model.BackgroundImage.FileName.Insert(bgFilenameLastDot - 1, Guid.NewGuid().ToString());

                    bgPath = Path.Combine(_mediasPath, bgFileName);

                    if (System.IO.File.Exists(bgPath))
                    {
                        System.IO.File.Delete(bgPath);
                    }

                    using (var memoStream = new MemoryStream())
                    {
                        model.BackgroundImage.CopyTo(memoStream);

                        System.IO.File.WriteAllBytes(bgPath, memoStream.ToArray());
                    }

                    bgPath = _mediaPrefix + bgFileName;
                }

                if (model.Thumbnail != null)
                {
                    var thumbFilenameLastDot = model.Thumbnail.FileName.LastIndexOf('.');

                    var thumbFilename = model.Thumbnail.FileName.Insert(thumbFilenameLastDot - 1, Guid.NewGuid().ToString());

                    thumbPath = Path.Combine(_mediasPath, thumbFilename);


                    if (System.IO.File.Exists(thumbPath))
                    {
                        System.IO.File.Delete(thumbPath);
                    }

                    using (var memoStream = new MemoryStream())
                    {
                        model.Thumbnail.CopyTo(memoStream);

                        System.IO.File.WriteAllBytes(thumbPath, memoStream.ToArray());
                    }

                    thumbPath = _mediaPrefix + thumbPath;
                }


                game.Active = model.Active;

                game.CategoryGame = model.Categories.Select(c => new CategoryGame { CategoryId = c }).ToList();

                game.Description = model.Description;

                game.Developer = model.Developer;

                game.LaunchDate = model.LaunchDate;

                game.Media = model.Videos.Select(v => new Media { Link = v, Type = "video", GameId = model.Id }).ToList();

                game.Price = model.Price;

                game.Name = model.Name;

                game.Publisher = model.Publisher;

                game.Rating = model.Rating;

                game.PlataformGame = model.Plataforms.Select(p => new PlataformGame { PlataformId = p }).ToList();

                game.Requirements = model.Requirements;

                game.ThumbnailLink = thumbPath;

                game.BackgroundLink = bgPath;

                _gameRepo.Update(game);

                return Json(new { message = "Jogo editado com sucesso.", success = true });
            }
            catch (Exception ex)
            {
                Log.Error("Error while editing Game.", ex);

                return Json(new { message = "Desculpe, ocorreu um erro ao executar está ação.", success = false });
            }
        }

        [HttpGet("[action]")]
        public JsonResult ChangeGameStatus(int gameId)
        {
            try
            {
                _gameRepo.ChangeGameStatus(gameId);

                return Json(new { message = "Status do jogo foi alterado com sucesso.", success = true });
            }
            catch (Exception ex)
            {

                Log.Error("Error while changing game status.", ex);

                return Json(new { message = "Desculpe, ocorreu um erro ao executar está ação.", success = false });
            }
        }

        [HttpGet("[action]")]
        public JsonResult GetGames(int? skip, int? take, string search, int? categoryId, string plataform)
        {
            try
            {
                if (skip.HasValue && take.HasValue)
                {
                    var (games, totalCount) = _gameRepo.GetPage(skip.Value, take.Value, search);

                    var viewModel = games.Select(g =>
                        new GameViewModel
                        {
                            Id = g.Id,
                            Active = g.Active,
                            BackgroundLink = g.BackgroundLink,
                            ThumbnailLink = g.ThumbnailLink,
                            CategoriesView = g.CategoryGame.Select(c => c.Category.Name),
                            PlataformsView = g.PlataformGame.Select(c => c.Plataform.Name),
                            Videos = g.Media.Where(m => m.Type.Equals("video")).Select(v => v.Link),
                            Description = g.Description,
                            Developer = g.Developer,
                            LaunchDate = g.LaunchDate,
                            Name = g.Name,
                            Price = g.Price,
                            Publisher = g.Publisher,
                            Rating = g.Rating,
                            Requirements = g.Requirements
                        }
                    );

                    return Json(new { games = viewModel, totalCount, success = true });
                }
                else
                {
                    var games = default(IEnumerable<Game>);

                    if (categoryId.HasValue)
                    {
                        games = _gameRepo.GetAll().Where(g => g.Active && g.CategoryGame.Select(c => c.CategoryId).Contains(categoryId.Value));
                    }
                    else
                    {
                        games = _gameRepo.GetAll().Where(g => g.Active);
                    }
                    if (!string.IsNullOrEmpty(plataform))
                    {
                        games = games.Where(g => g.PlataformGame.Select(p => p.Plataform.Name.ToLower()).Contains(plataform.ToLower()));
                    }

                    var viewModel = games.Select(g =>
                        new GameViewModel
                        {
                            Id = g.Id,
                            Active = g.Active,
                            BackgroundLink = g.BackgroundLink,
                            ThumbnailLink = g.ThumbnailLink,
                            //CategoriesView = g.CategoryGame.Select(c => c.Category.Name),
                            //PlataformsView = g.PlataformGame.Select(c => c.Plataform.Name),
                            Videos = g.Media.Where(m => m.Type.Equals("video")).Select(v => v.Link),
                            Description = g.Description,
                            Developer = g.Developer,
                            LaunchDate = g.LaunchDate,
                            Name = g.Name,
                            Price = g.Price,
                            Publisher = g.Publisher,
                            Rating = g.Rating,
                            Requirements = g.Requirements
                        }

                    );

                    return Json(new { games = viewModel, success = true });
                }

            }
            catch (Exception ex)
            {
                Log.Error("Error while getting games.", ex);

                return Json(new { message = "Desculpe, não foi possível carregar as informações desta página.", success = false });
            }
        }

        [HttpGet("[action]")]
        public JsonResult GetCreateEditPageDefaultState()
        {
            try
            {
                var categories = _categoryRepo.GetAll().Select(c => new { label = c.Name, value = c.Id });

                var plataforms = _plataformRepo.GetAll().Select(c => new { label = c.Name, value = c.Id });

                return Json(new { categories, plataforms, success = true });
            }
            catch (Exception ex)
            {
                Log.Error("Error while getting default state for page Create/Edit game.", ex);

                return Json(new { message = "Desculpe, não foi possível carregar essa página.", success = false });
            }
        }

        [HttpGet("[action]")]
        public JsonResult ChangeGameFavoriteStatus(int? gameId, string userProviderId)
        {
            if (!gameId.HasValue && string.IsNullOrEmpty(userProviderId))
            {
                return Json(new { message = "Não foi possível completar esta ação!", success = false });
            }

            try
            {
                var added = _customerFavorite.ChangeGameFavoriteStatus(gameId.Value, userProviderId);

                if (added)
                {
                    return Json(new { message = "O jogo foi adicionado a sua lista de favoritos!", success = true });
                }

                return Json(new { message = "O jogo foi removido da sua lista de favoritos!", success = true });
            }
            catch (Exception ex)
            {
                Log.Error("Error while changing game favorite status.", ex);

                return Json(new { message = "Desculpe, ocorreu um erro inesperado!", success = false });
            }
        }

        [HttpGet("[action]")]
        public JsonResult GetFavoriteGames(string userProviderId)
        {
            try
            {
                var favoriteGames = _customerFavorite.GetFavoriteGames(userProviderId);

                return Json(new { games = favoriteGames, success = true }, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
            }
            catch (Exception ex)
            {
                Log.Error("Error while get favorite games.", ex);

                return Json(new { message = "Não foi possível carregar a lista de favoritos", success = false },
                     new JsonSerializerSettings
                     {
                         ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                     });
            }
        }
    }
}

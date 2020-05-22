using Microsoft.EntityFrameworkCore;
using OurGames.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace OurGames.Repository
{
    public class GameRepository : AbstractRepository<Game>
    {
        public GameRepository(DbContextOptions<OurGamesContext> dbContextOptions) 
            : base(dbContextOptions)
        {
        }

        public override IEnumerable<Game> GetAll()
        {
            return context.Game
                .Include(g => g.CategoryGame)
                .Include(g => g.PlataformGame)
                    .ThenInclude(g => g.Plataform)
                .OrderBy(g => g.Name)
                .ToList();
        }

        public override Game Update(Game entity)
        {

            context.RemoveRange(context.Media.Where(m => m.GameId == entity.Id));

            context.RemoveRange(context.CategoryGame.Where(m => m.GameId == entity.Id));

            context.RemoveRange(context.PlataformGame.Where(m => m.GameId == entity.Id));

            context.SaveChanges();

            return base.Update(entity);
        }

        public override Game GetByKey(params object[] keyValues)
        {
            return context.Game
                        .Include(g => g.PlataformGame)
                            .ThenInclude(g => g.Plataform)
                        .Include(g => g.CategoryGame)
                            .ThenInclude(g => g.Category)
                        .Include(g => g.Media)
                    .FirstOrDefault(g => g.Id == (int)keyValues[0]);
        }

        public void ChangeGameStatus(int gameId)
        {
            var entity = GetByKey(gameId);

            entity.Active = !entity.Active;

            context.SaveChanges();
        }

        public (IEnumerable<Game> games, int totalCount) GetPage(int skip, int take, string search)
        {
            return !string.IsNullOrEmpty(search) ? (
                    context.Game
                        .Include(g => g.PlataformGame)
                            .ThenInclude(g => g.Plataform)
                        .Include(g => g.CategoryGame)
                            .ThenInclude(g => g.Category)
                        .Include(g => g.Media)
                        .Where(g => g.Name.Contains(search))
                        .Skip(skip).Take(take).ToList(),
                    context.Game.Count()
                   ) : (context.Game
                        .Include(g => g.PlataformGame)
                            .ThenInclude(g => g.Plataform)
                        .Include(g => g.CategoryGame)
                            .ThenInclude(g => g.Category)
                        .Include(g => g.Media)
                        .Skip(skip).Take(take).ToList(),
                    context.Game.Count());
        }

        public IEnumerable<Game> SearchByName(string searchText)
        {
            return context.Game
                .Include(g => g.CategoryGame)
                    .ThenInclude(g => g.Category)
                .Where(g => g.Name.Contains(searchText) || g.CategoryGame.Any(c => c.Category.Name.Contains(searchText)))
                .ToList();
        }
    }
}

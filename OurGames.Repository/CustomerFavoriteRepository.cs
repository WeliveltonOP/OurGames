using Microsoft.EntityFrameworkCore;
using OurGames.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace OurGames.Repository
{
    public class CustomerFavoriteRepository : AbstractRepository<CustomerFavorite>
    {
        public CustomerFavoriteRepository(DbContextOptions<OurGamesContext> dbContextOptions) : base(dbContextOptions)
        {
        }

        public bool ChangeGameFavoriteStatus(int gameId, string userProviderId)
        {
            var customerId = context.Customer.FirstOrDefault(c => c.ProviderId == userProviderId).Id;

            var gameFavorite = context.CustomerFavorite.FirstOrDefault(g => g.GameId == gameId && g.CustomerId == customerId);

            if (gameFavorite is null)
            {
                context.CustomerFavorite.Add(new CustomerFavorite
                {
                    GameId = gameId,
                    CustomerId = customerId
                });

                context.SaveChanges();

                return true;
            }

            context.CustomerFavorite.Remove(gameFavorite);

            context.SaveChanges();

            return false;
        }

        public IEnumerable<CustomerFavorite> GetFavoriteGames(string userProviderId)
        {
            var customerId = context.Customer.FirstOrDefault(c => c.ProviderId == userProviderId)?.Id;

            if (!customerId.HasValue)
                return Enumerable.Empty<CustomerFavorite>();

            return context.CustomerFavorite
                            .Include(c => c.Game)
                            .Where(c => c.CustomerId == customerId)
                            .ToList();
        }
    }
}

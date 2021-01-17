namespace BorcDefteriApi.Migrations
{
    using BorcDefteriApi.Models;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<BorcDefteriApi.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(BorcDefteriApi.Models.ApplicationDbContext context)
        {
            var kullaniciEmail = "ornek@gmail.com";

            if (!context.Users.Any(x => x.UserName == kullaniciEmail))
            {
                #region Örnek Kullanıcıyı Oluştur
                var kullanici = new ApplicationUser()
                {
                    UserName = kullaniciEmail,
                    Email = kullaniciEmail,
                    EmailConfirmed = true
                };
                var userStore = new UserStore<ApplicationUser>(context);
                var userManager = new ApplicationUserManager(userStore);
                userManager.Create(kullanici, "Ankara1.");
                #endregion

                #region Oluşan Kullanıcıyla İlişkili Borç Kaydı Gir
                context.Borclar.AddRange(new List<Borc>()
                {
                    new Borc()
                    {
                        KullaniciId = kullanici.Id,
                        Taraf = "Aydın",
                        BorcMiktar = 1000,
                        BorcVerilisTarihi = DateTime.Now,
                        SonOdemeTarihi = DateTime.Now.AddDays(15),
                    },
                    new Borc()
                    {
                        KullaniciId = kullanici.Id,
                        Taraf = "Kamil",
                        BorcMiktar = 500,
                        BorcVerilisTarihi = DateTime.Now.AddDays(-5),
                        SonOdemeTarihi = DateTime.Now.AddDays(5),
                        BorcluMuyum = true
                    }
                }); 
                #endregion
            }
        }
    }
}

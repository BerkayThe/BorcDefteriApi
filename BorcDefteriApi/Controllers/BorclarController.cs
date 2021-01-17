using BorcDefteriApi.Dtos;
using BorcDefteriApi.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

// https://docs.microsoft.com/en-us/aspnet/web-api/overview/security/individual-accounts-in-web-api
namespace BorcDefteriApi.Controllers
{
    [Authorize]
    public class BorclarController : ApiController
    {
        ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        // api/Borclar/Listele
        public List<Borc> Listele()
        {
            var userId = User.Identity.GetUserId();
            return db.Borclar.Where(x => x.KullaniciId == userId).ToList();
        }

        [HttpPost]
        public IHttpActionResult Ekle(BorcEkleDto dto)
        {
            if (ModelState.IsValid)
            {
                Borc borc = new Borc()
                {
                    KullaniciId = User.Identity.GetUserId(),
                    Taraf = dto.Taraf,
                    BorcMiktar = dto.BorcMiktar,
                    SonOdemeTarihi = dto.SonOdemeTarihi,
                    BorcluMuyum = dto.BorcluMuyum,
                    BorcVerilisTarihi = DateTime.Now,
                    BorcKapanisTarihi = null,
                    BorcKapandiMi = false,
                    BorcOdenen = 0
                };
                db.Borclar.Add(borc);
                db.SaveChanges();
                return Ok(borc);
            }

            return BadRequest(ModelState);
        }

        [HttpPut]
        // PUT: api/Borclar/KapanmaDurumGuncelle/1
        public IHttpActionResult KapanmaDurumGuncelle(int id, BorcKapanmaDurumGuncelleDto dto)
        {
            if (id != dto.BorcId)
            {
                return BadRequest();
            }

            var borc = db.Borclar.Find(id);

            if (borc == null)
            {
                return NotFound();
            }

            if (borc.KullaniciId != User.Identity.GetUserId())
            {
                return Unauthorized();
            }

            borc.BorcKapandiMi = dto.BorcKapandiMi;
            borc.BorcOdenen = dto.BorcKapandiMi ? borc.BorcMiktar : 0;
            borc.BorcKapanisTarihi = dto.BorcKapandiMi ? DateTime.Now : (DateTime?)null;
            db.SaveChanges();

            return Ok(borc);
        }

        [HttpDelete]
        public IHttpActionResult BorcSil(int BorcId)
        {

            if (BorcId == 0)
            {
                return BadRequest();
            }
            var data = db.Borclar.Find(BorcId);
            if (data != null)
            {
                db.Entry(data).State = System.Data.Entity.EntityState.Deleted;
                db.SaveChanges();
            }

            return Ok(data);
        }
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}

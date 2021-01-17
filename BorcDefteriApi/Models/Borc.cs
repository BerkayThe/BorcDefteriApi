using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace BorcDefteriApi.Models
{
    [Table("Borclar")]
    public class Borc
    {
        public int Id { get; set; }

        [Required, ForeignKey("Kullanici")]
        public string KullaniciId { get; set; }

        [Required, MaxLength(50)]
        public string Taraf { get; set; }

        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal BorcMiktar { get; set; }

        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal BorcOdenen { get; set; }

        public bool BorcKapandiMi { get; set; }

        public bool BorcluMuyum { get; set; }

        public DateTime? BorcVerilisTarihi { get; set; }

        public DateTime? SonOdemeTarihi { get; set; }

        public DateTime? BorcKapanisTarihi { get; set; }


        public ApplicationUser Kullanici { get; set; }
    }
}
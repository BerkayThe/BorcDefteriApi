using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BorcDefteriApi.Dtos
{
    public class BorcEkleDto
    {

        [Required, MaxLength(50)]
        public string Taraf { get; set; }

        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal BorcMiktar { get; set; }

        public bool BorcluMuyum { get; set; }

        public DateTime? SonOdemeTarihi { get; set; }
    }
}